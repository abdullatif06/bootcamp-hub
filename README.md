# Build Your First Startup With AI — Bootcamp Hub

All-in-one companion site for the Vibe Coding Bootcamp: a pre-event landing page **and** a live in-event hub (polls, leaderboard, host dashboard) on one site.

**Stack:** Next.js 14 (App Router) · Supabase (DB + Realtime) · Tailwind CSS · Vercel
**Full spec:** [CONCEPT.md](CONCEPT.md) · **Build log:** [CLAUDE.md](CLAUDE.md)

---

## Quick start

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev                        # http://localhost:3000
```

The app runs **without Supabase** out of the box: login works against the seed
registration list, and live features show a friendly "not connected" notice.
To enable realtime polls/leaderboard, add Supabase (below).

---

## Setup checklist

### 1. Supabase (enables polls, leaderboard, scores)
1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste and run [`supabase/schema.sql`](supabase/schema.sql).
3. **Settings → API** → copy the Project URL and anon key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

### 2. Registration sheet (controls who can log in)
1. Open the Google Form responses sheet.
2. **File → Share → Publish to web → (responses tab) → CSV → Publish**.
3. Paste the CSV URL into `.env.local`:
   ```
   NEXT_PUBLIC_REGISTRATION_CSV_URL=https://docs.google.com/.../pub?output=csv
   ```
   Columns expected: **Name · Email · Phone · Confirmed · University · Gender**.
   Until you set this, the app uses the 9-person seed list in
   [`src/lib/attendees-seed.ts`](src/lib/attendees-seed.ts).

### 3. Admin phone (unlocks the Host Dashboard)
Already set to `0782173172` in `.env.local`. Change `NEXT_PUBLIC_ADMIN_PHONE` if needed.

---

## How it works

| Page | What it does |
|---|---|
| `/` | Home — flips between **pre-event** (countdown + register) and **live** (banner + stats) based on host toggle |
| `/login` | Phone-number login, matched against the registration sheet (smart-normalized) |
| `/me` | Attendee profile — full registration info + live score |
| `/polls` | Live poll, pushed by the host. MCQ (auto-scored) or open text |
| `/leaderboard` | Live standings — hidden until the host reveals it |
| `/speakers` | Host + 2 guest speakers (3rd hidden) |
| `/resources` | Prep material (slides, prompts, links) |
| `/host` | **Admin only** — flip mode, push polls, toggle leaderboard, set banner |

### Host flow on event day
1. Log in with the admin phone → redirected to `/host`.
2. Create polls ahead of time (MCQ with a correct answer, or open text).
3. Flip Home to **Live** mode; optionally set the "happening now" banner.
4. **Push live** a poll → it appears instantly on every attendee's `/polls`.
5. Correct MCQ answers auto-award points; **Close** the poll when done.
6. Reveal the **leaderboard** at the wrap-up; top scorers win.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it on [vercel.com](https://vercel.com).
3. Add the same env vars (from `.env.local`) in **Project → Settings → Environment Variables**.
4. Deploy → you get a free `*.vercel.app` URL.

---

## Notes
- **No real auth** — "login" is a phone-in-sheet check. Don't store sensitive data.
- **Phone matching** normalizes country code (`962`), leading `0`, and spaces, comparing the last 9 digits.
- Speaker/sponsor images live in `public/`. Source originals are in `images/`.
