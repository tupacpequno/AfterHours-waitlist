# AFTER HOURS® — Waitlist

Minimal waitlist landing page. Next.js 14 (App Router) + Tailwind CSS +
Supabase.

## Project structure

```
app/
  layout.jsx              root layout, metadata
  page.jsx                route entry, renders the component
  AfterHoursWaitlist.jsx  the page itself (client component)
  globals.css             Tailwind directives
lib/
  supabaseClient.js       Supabase client, reads env vars only
supabase/
  waitlist.sql            table + RLS policy — run once in Supabase
.env.local.example        copy to .env.local and fill in
```

## Local setup

```bash
npm install
cp .env.local.example .env.local   # then fill in your real values
npm run dev
```

Open http://localhost:3000.

## Supabase setup

1. In the Supabase SQL editor, run `supabase/waitlist.sql`. This creates the
   `waitlist` table and an RLS policy that allows anonymous **insert only** —
   no read, update, or delete access via the public key.
2. In Supabase → Project Settings → API, copy the **Project URL** and the
   **anon / publishable** key into `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
   ```

3. Never use the `service_role` key here — it bypasses RLS and must not be
   used in frontend code.

## Deploying to Vercel

1. Push this project to a GitHub repo (`.env.local` is gitignored — it will
   not be pushed).
2. In Vercel: **Add New → Project**, import the repo. Vercel auto-detects
   Next.js, no build settings need to change.
3. Before the first deploy, open **Settings → Environment Variables** and add:

   | Name | Value | Environments |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon/publishable key | Production, Preview, Development |

4. Deploy. Vercel builds with `next build` and serves automatically.
5. If you add or rotate keys later, redeploy (or use "Redeploy" in the
   Vercel dashboard) — env var changes don't apply to already-running builds.

## Verifying the live deploy

1. Open the deployed URL, submit a real-looking test email.
2. Confirm the **YOU'RE IN.** success state appears.
3. In Supabase → Table Editor → `waitlist`, confirm the row landed.
