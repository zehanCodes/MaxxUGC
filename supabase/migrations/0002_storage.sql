-- Phase 1 (Foundation): private file storage.
--
-- Object keys are laid out as `{creator_id}/{campaign_id}/{object_id}.{ext}`
-- so policies can scope access by the leading path segment. Campaigns and
-- tickets don't exist yet, so for now only the owning creator (and admins)
-- can touch their files. Phase 2 tightens campaign-assets to require that
-- `campaign_id` belongs to the creator, and adds editor read access derived
-- from currently claimed tickets (docs/PRD.md Sections 5.4, 13 "File
-- permissions"). Editors never get access from a URL alone: every download
-- goes through a short-lived signed URL issued under the caller's own RLS.

create or replace function public.is_creator(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'creator' and account_status = 'active'
  );
$$;

-- file_size_limit is left null so the project-wide upload limit applies
-- (50 MB on the free plan; raise it in Storage settings on a paid plan
-- before creators start uploading full-length B-roll).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'campaign-assets',
    'campaign-assets',
    false,
    null,
    array['video/mp4', 'video/quicktime', 'video/webm', 'image/png', 'image/jpeg', 'image/webp']
  ),
  (
    'ticket-submissions',
    'ticket-submissions',
    false,
    null,
    array['video/mp4', 'video/quicktime', 'video/webm']
  )
on conflict (id) do nothing;

-- campaign-assets: creators manage files under their own prefix.

create policy "Creators can view own campaign assets"
  on storage.objects for select
  using (
    bucket_id = 'campaign-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Creators can upload own campaign assets"
  on storage.objects for insert
  with check (
    bucket_id = 'campaign-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.is_creator(auth.uid())
  );

create policy "Creators can update own campaign assets"
  on storage.objects for update
  using (
    bucket_id = 'campaign-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'campaign-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Creators can delete own campaign assets"
  on storage.objects for delete
  using (
    bucket_id = 'campaign-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ticket-submissions: creators can view finished edits under their prefix.
-- Editor upload/read policies need the tickets table and land in Phase 3.

create policy "Creators can view own ticket submissions"
  on storage.objects for select
  using (
    bucket_id = 'ticket-submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins: full access to both buckets for oversight and QC.

create policy "Admins can manage all files"
  on storage.objects for all
  using (
    bucket_id in ('campaign-assets', 'ticket-submissions')
    and public.is_admin(auth.uid())
  )
  with check (
    bucket_id in ('campaign-assets', 'ticket-submissions')
    and public.is_admin(auth.uid())
  );
