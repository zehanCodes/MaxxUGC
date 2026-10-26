# MAXXUGC

Tech UGC Creator Operating System — a managed human video-editing service plus
creator business operations platform. Full product scope is in
[`docs/PRD.md`](./docs/PRD.md); read that before making architecture or
business-rule decisions.

Stack: Next.js 16 (App Router, TypeScript) + Tailwind v4 + shadcn/ui, Supabase
(Postgres, Auth, Storage, Realtime).

## Status

Phase 1 (Foundation) in progress: auth, roles, the three dashboard shells
(Creator / Editor / Admin), and the `profiles` table with RLS. Campaigns,
tickets, the shared editing queue, shifts, and earnings are later phases —
see `docs/PRD.md` Section 15 for the full build order.

## Local setup

1. Create a Supabase project (or use an existing dev one).
2. Copy `.env.local.example` to `.env.local` and fill in your project's URL
   and anon key (Supabase dashboard → Project Settings → API).
3. Run `supabase/migrations/0001_init.sql` against your project — easiest
   via the Supabase dashboard's SQL Editor (the `supabase` CLI isn't set up
   on this machine yet; Xcode Command Line Tools need a manual update first
   if you want to install it via `brew install supabase/tap/supabase`).
4. `npm install`
5. `npm run dev`

### Creating the first admin

Self-serve signup only ever creates a `creator` account, and a database
trigger blocks non-admins from changing `role`. To bootstrap the first admin,
sign up normally, then in the Supabase SQL Editor (which runs as the
Postgres superuser and bypasses RLS) run:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Promote editors the same way once editor accounts exist — there's no invite
UI yet (see `docs/PRD.md` Section 18).
