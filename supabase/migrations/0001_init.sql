-- Phase 1 (Foundation): roles + profiles.
-- Campaign/Ticket/Shift/Earnings tables come in later phases (see docs/PRD.md
-- Section 15) and are deliberately not included here.

create type public.user_role as enum ('creator', 'editor', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'creator',
  account_status text not null default 'active'
    check (account_status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- SECURITY DEFINER so RLS policies on other tables can check "is this user
-- an admin?" without recursing into profiles' own RLS policies.
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = user_id and role = 'admin'
  );
$$;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin(auth.uid()));

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin(auth.uid()));

-- RLS's WITH CHECK can't compare against the pre-update row, so role /
-- account_status escalation is blocked here instead: only an admin (or the
-- service role, e.g. a future admin API route) may change either column.
create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role
      or new.account_status is distinct from old.account_status)
     and not public.is_admin(auth.uid()) then
    raise exception 'Only admins can change role or account_status';
  end if;
  return new;
end;
$$;

create trigger trg_prevent_privilege_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_privilege_escalation();

-- Self-serve signup always creates a 'creator' profile. Editor/admin
-- accounts are promoted later by an admin updating this row directly —
-- there's no invite UI yet (docs/PRD.md Section 18).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    'creator'
  );
  return new;
end;
$$;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();
