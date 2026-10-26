-- Phase 2: campaigns (docs/PRD.md Sections 5.3, 11 "Campaign").
--
-- The PRD doesn't define campaign statuses; active/paused/completed/archived
-- is a working set. Creators archive rather than delete, since tickets and
-- deliverables will reference campaigns and file retention rules are still
-- an open decision (Section 18).

create type public.campaign_status as enum ('active', 'paused', 'completed', 'archived');

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  brand_name text not null check (char_length(brand_name) between 1 and 120),
  -- Storage key in campaign-assets; logo upload UI lands with the B-roll library.
  brand_logo_path text,
  description text,
  start_date date,
  end_date date,
  deliverable_quota integer check (deliverable_quota is null or deliverable_quota > 0),
  guidelines text,
  default_instructions text,
  status public.campaign_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create index campaigns_creator_id_idx on public.campaigns (creator_id, created_at desc);

alter table public.campaigns enable row level security;

create policy "Creators can view own campaigns"
  on public.campaigns for select
  using (auth.uid() = creator_id);

create policy "Creators can create own campaigns"
  on public.campaigns for insert
  with check (auth.uid() = creator_id and public.is_creator(auth.uid()));

create policy "Creators can update own campaigns"
  on public.campaigns for update
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

create policy "Admins can view all campaigns"
  on public.campaigns for select
  using (public.is_admin(auth.uid()));

create policy "Admins can update all campaigns"
  on public.campaigns for update
  using (public.is_admin(auth.uid()));

-- Editors get no campaign access here; it's derived from claimed tickets
-- once the tickets table exists.

create trigger trg_campaigns_updated_at
  before update on public.campaigns
  for each row
  execute function public.set_updated_at();

-- creator_id must never move between accounts, even via an admin update.
create or replace function public.prevent_campaign_owner_change()
returns trigger
language plpgsql
as $$
begin
  if new.creator_id is distinct from old.creator_id then
    raise exception 'Campaign owner cannot be changed';
  end if;
  return new;
end;
$$;

create trigger trg_prevent_campaign_owner_change
  before update on public.campaigns
  for each row
  execute function public.prevent_campaign_owner_change();

-- Storage: uploads into campaign-assets now also require the second path
-- segment to be a campaign the uploader owns.

create or replace function public.owns_campaign(user_id uuid, campaign_id text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.campaigns
    where id::text = campaign_id and creator_id = user_id
  );
$$;

drop policy "Creators can upload own campaign assets" on storage.objects;

create policy "Creators can upload own campaign assets"
  on storage.objects for insert
  with check (
    bucket_id = 'campaign-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.is_creator(auth.uid())
    and public.owns_campaign(auth.uid(), (storage.foldername(name))[2])
  );
