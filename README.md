# MaxxUGC

Free portfolio, earnings, and posting tools for UGC creators. The roadmap and
project rules are in [`docs/PLAN.md`](./docs/PLAN.md).

Stack: Next.js 16 (App Router, TypeScript) + Tailwind v4 + shadcn/ui, Supabase
(Postgres, Auth, Storage), Vercel.

## Local setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in the project URL and anon key
   (Supabase dashboard → Project Settings → API).
3. Run each file in `supabase/migrations/` in order, by pasting it into the
   Supabase dashboard's SQL Editor and clicking Run.
4. `npm install`
5. `npm run dev`, then open http://localhost:3000
