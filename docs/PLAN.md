# MaxxUGC v1 plan

A free tool for UGC creators. Build in this order; don't skip ahead.

1. **Landing page + portfolio builder (Week 1)**
   - Port `reference/portfolio-builder.html` into React: same sections, 12 palettes,
     4 fonts, phone/desktop preview, click-to-edit. Rebrand TurboUGC → MaxxUGC,
     remove sample personal data.
   - Supabase magic link + Google login; save portfolio per user (sections as JSON);
     publish to `maxxugc.com/<handle>` with a share preview image; photo/logo uploads;
     TikTok/IG/YouTube embeds; "Made with MaxxUGC" footer; view counter.
   - Landing page: "Build my free portfolio" button, feature blocks (autoposting = Beta),
     Discord invite, editing-service waitlist form, privacy + terms pages.
2. **Campaign & earnings tracker, manual entry (Week 2)**
   - Campaigns: brand, dates, deliverables, pay terms (flat per post, monthly retainer
     spread daily, per-1K-views bonus with cap, one-time fee).
   - Dashboard: earned today/week/month, owed vs paid, daily earnings chart, payments.
3. **Connect accounts + auto-pull IG/TikTok stats via Upload-Post (Week 3)**
   - Daily stats snapshots, "verified" portfolio numbers, per-view earnings.
4. **Autoposting + scheduling via Upload-Post (Week 4)**
   - Instagram, TikTok, YouTube Shorts, Facebook Reels. Upload once, per-platform
     captions, calendar, queue, failed-post retry.
   - Never build account warm-up or engagement automation.

Out of scope: editor dashboards, ticket queues, payroll (archived on the
`old-editor-plan` branch).

## Rules

- Stack: Next.js App Router + TypeScript + Tailwind + shadcn/ui, Supabase (Postgres,
  Auth, Storage, RLS so users only see their own data), Vercel.
- All Upload-Post calls live in `lib/social/` so the provider can be swapped.
- Tables: profiles, portfolios, social_accounts (no passwords/tokens), campaigns,
  posts, post_stats_daily, payments.
- Money in integer cents. Dates stored UTC, shown in the user's time zone
  (`profiles.time_zone`).
- Schema changes only as SQL migrations in `supabase/migrations/`.
- Secrets only in `.env.local`; keep `.env.example` updated.
- Commit after each working step.
