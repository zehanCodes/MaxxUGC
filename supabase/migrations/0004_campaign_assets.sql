-- Phase 2: private per-campaign B-roll library (docs/PRD.md Section 5.4).
--
-- One row per stored file. Tickets will reference these rows rather than
-- copying files, so the same B-roll can back many tickets in a campaign.
-- Folders are a single-level label on the asset; a folder exists as long
-- as at least one asset is in it.

create type public.asset_type as enum ('video', 'image');

create table public.campaign_assets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  -- Denormalized from campaigns so RLS and the storage path check stay cheap.
  creator_id uuid not null references public.profiles (id) on delete cascade,
  uploaded_by uuid not null references public.profiles (id),
  storage_path text not null unique,
  filename text not null check (char_length(filename) between 1 and 255),
  mime_type text not null,
  asset_type public.asset_type not null,
  size_bytes bigint not null check (size_bytes >= 0),
  folder text check (folder is null or char_length(folder) between 1 and 80),
  tags text[] not null default '{}',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- The file must live under this campaign's prefix in campaign-assets.
  check (storage_path like creator_id::text || '/' || campaign_id::text || '/%')
);

create index campaign_assets_campaign_idx
  on public.campaign_assets (campaign_id, created_at desc);
create index campaign_assets_tags_idx
  on public.campaign_assets using gin (tags);

alter table public.campaign_assets enable row level security;

create policy "Creators can view own campaign assets"
  on public.campaign_assets for select
  using (auth.uid() = creator_id);

create policy "Creators can add assets to own campaigns"
  on public.campaign_assets for insert
  with check (
    auth.uid() = creator_id
    and auth.uid() = uploaded_by
    and public.owns_campaign(auth.uid(), campaign_id::text)
  );

create policy "Creators can update own campaign assets"
  on public.campaign_assets for update
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

create policy "Creators can delete own campaign assets"
  on public.campaign_assets for delete
  using (auth.uid() = creator_id);

create policy "Admins can view all campaign assets"
  on public.campaign_assets for select
  using (public.is_admin(auth.uid()));

-- Editor read access arrives with tickets: an editor sees an asset while
-- they hold a claimed ticket that references it.

create trigger trg_campaign_assets_updated_at
  before update on public.campaign_assets
  for each row
  execute function public.set_updated_at();

-- Where the file lives and who owns it are fixed at upload time.
create or replace function public.prevent_asset_relocation()
returns trigger
language plpgsql
as $$
begin
  if new.campaign_id is distinct from old.campaign_id
     or new.creator_id is distinct from old.creator_id
     or new.uploaded_by is distinct from old.uploaded_by
     or new.storage_path is distinct from old.storage_path then
    raise exception 'Asset location and ownership cannot be changed';
  end if;
  return new;
end;
$$;

create trigger trg_prevent_asset_relocation
  before update on public.campaign_assets
  for each row
  execute function public.prevent_asset_relocation();
