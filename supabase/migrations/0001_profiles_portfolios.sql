-- Week 1: profiles + portfolios (docs/PLAN.md).
--
-- One profile and at most one portfolio per user. The public handle lives on
-- portfolios, not profiles, so the anonymous "view a published portfolio"
-- policy never has to expose a profile row (which holds the user's email).

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles ------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text check (display_name is null or char_length(display_name) <= 80),
  -- IANA name, e.g. 'America/New_York'. Dates are stored UTC and shown in this zone.
  time_zone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Every new auth user (magic link, Google, or password) gets a profile row.
-- Google sign-ins put the name in 'full_name' or 'name'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    )
  );
  return new;
end;
$$;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- portfolios ----------------------------------------------------------------

create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  -- Public URL: maxxugc.com/<handle>. Lowercase only, so uniqueness is
  -- case-insensitive. Reserved words are app routes that would collide.
  handle text unique
    check (
      handle ~ '^[a-z0-9_]{3,30}$'
      and handle not in (
        'about', 'admin', 'api', 'app', 'auth', 'blog', 'dashboard', 'discord',
        'help', 'login', 'logout', 'maxxugc', 'pricing', 'privacy', 'settings',
        'signup', 'support', 'terms', 'waitlist', 'www'
      )
    ),
  -- Builder state. Allowed palette/font names are enforced in the app.
  palette text not null default 'default',
  font text not null default 'default',
  sections jsonb not null default '[]'::jsonb
    check (jsonb_typeof(sections) = 'array'),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not is_published or handle is not null)
);

alter table public.portfolios enable row level security;

create policy "Users can view own portfolio"
  on public.portfolios for select
  using (auth.uid() = user_id);

create policy "Anyone can view published portfolios"
  on public.portfolios for select
  to anon, authenticated
  using (is_published);

create policy "Users can create own portfolio"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

create policy "Users can update own portfolio"
  on public.portfolios for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own portfolio"
  on public.portfolios for delete
  using (auth.uid() = user_id);

create trigger trg_portfolios_updated_at
  before update on public.portfolios
  for each row
  execute function public.set_updated_at();
