# CLAUDE.md — Build log & working notes

Working notes for Claude Code on the **Build Your First Startup With AI** bootcamp hub.
Full product spec lives in [CONCEPT.md](CONCEPT.md). This file tracks decisions, progress, and gotchas.

---

## Project at a glance

- **What:** All-in-one bootcamp hub — pre-event landing + live event hub on one site.
- **Stack:** Next.js · Supabase · Vercel
- **Design:** Bold maximalism — lime `#deff9a` + navy `#0f172a`, Montserrat + Playfair Display. App-like on mobile.
- **Event:** July 2, 2026, 5–7 PM, online via Google Meet. Price 3 JOD.
- **Deadline:** ~9 days from June 23. MVP-first — cut scope, not the date.

---

## Decisions locked (from requirements interview)

| Topic | Decision |
|---|---|
| Site name | Build Your First Startup With AI |
| Project submissions | **Cut** for MVP |
| Resources | Available before event as prep material |
| Home mode switch | **Manual** — host flips from dashboard |
| Registration | Link out to Google Form |
| Auth | Phone number only (no OTP), matched against registration sheet; unregistered blocked |
| Phone matching | Smart normalize — ignore spaces, `962` country code, leading `0` |
| Admin auth | Special admin phone `0782173172` → stored in `.env` |
| Registration sheet | Live-connect to Google Form responses sheet, **published to web as CSV** |
| Sheet columns | Name · Email · Phone · Confirmed · University · Gender |
| Profile display | Full registration info + current score |
| Poll format | Mixed — host picks MCQ or open text per poll |
| Scoring | Points from answering live polls only |
| Leaderboard visibility | Host-controlled |
| Realtime | Supabase Realtime (websockets) |
| Prizes | Top leaderboard scorers win; tied to final reveal |
| 3rd speaker | Hidden until details provided |
| Domain | Free Vercel subdomain |
| Sponsor logos | Files to be dropped in by user (placeholders meanwhile) |
| Speaker photos | Provided in `images/` |

---

## Key references

- **Google Form (register):** `https://docs.google.com/forms/d/e/1FAIpQLSf2wdizy1jwxNhfeHfkK9ifMZW4O2OO7LpoinSSoY0DODbWSQ/viewform`
- **Google Meet:** `meet.google.com/dkw-qmct-qui`
- **Admin phone:** `0782173172` (must live in `.env` / Supabase, never hardcoded in client)

---

## Assets dropped in `images/`

| File | Use | Status |
|---|---|---|
| `Osama Al-Said.jpg` | Speaker 1 photo | ✅ ready |
| `Eng. Zeyad Alsarahne.jpg` | Speaker 2 photo | ✅ ready |
| `Abdullatif Qaisieh.jpg` | Host photo | ✅ ready (portrait — crop to face/upper body for card) |
| `sponsor logos/curacode.jpeg` | CuraCode logo (@cura.code) | ✅ ready (blue magnifier "CURA CODE") |
| `sponsor logos/fastsource.jpg` | FastSource logo (@fast.source) | ✅ ready (pink/red "F" neon circle) |

---

## Open items / pending from user

- [ ] 3rd speaker details (name, bio, photo) — *placeholder for now*
- [x] ~~Sponsor logo files (@cura.code, @fast.source)~~ — done
- [x] ~~Convert host photo HEIC → JPG~~ — done (`images/Abdullatif Qaisieh.jpg`)
- [ ] Prize details (specific prizes for top scorers)
- [ ] Publish the Form responses sheet to web → provide CSV URL
- [ ] Resources content (slide decks, PDFs, prompt library, links)
- [ ] Speaker social links

---

## Progress log

### 2026-06-23
- Ran full requirements interview; all major decisions locked (table above).
- Fetched agenda from Google Calendar share link (event is 5–7 PM, online).
- Created [CONCEPT.md](CONCEPT.md) (product spec) and this file.
- Speaker photos present in `images/`; host HEIC replaced with `Abdullatif Qaisieh.jpg`.
- Sponsor logos added & renamed: `curacode.jpeg`, `fastsource.jpg`.
- All blocking assets in. Remaining placeholders: 3rd speaker, prizes, resources content, published CSV URL.
- **BUILT the full MVP** — Next.js 14 (App Router) + Supabase + Tailwind. All 12 routes compile; prod build green; `tsc --noEmit` clean.
  - Pages: Home (pre/live modes), `/login`, `/me`, `/polls`, `/leaderboard`, `/speakers`, `/resources`, `/host`, `/api/login`.
  - Login API verified: registered ✓, smart phone-match ✓ (`+962 79 527 6144` == `0795276144`), admin ✓, unregistered blocked ✓.
  - Supabase schema in `supabase/schema.sql`. App degrades gracefully when Supabase/CSV unset (uses seed list).
  - Maximalist design system: lime/navy, Montserrat + Playfair, gradient blobs, brutal cards, glow.
  - Images copied to `public/speakers/` + `public/sponsors/`.
- **Supabase connected** — keys in `.env.local`, schema run, full poll/vote/score lifecycle verified live.
- **Google Sheet linked** — published-CSV URL wired. Form sheet has 34 columns with DUPLICATE headers (multiple "Email"/"Phone"/"Full Name"); rewrote `registry.ts` `findCol` to map by header NAME and pick the most-populated matching column (handles duplicates + comma-in-header quoting). Verified name/email/phone/university/gender all resolve. Real column order: Timestamp, Full Name (English), Email, Phone Number, University student?, If yes which University?, Gender, …
- **Countdown hydration fix** — `Countdown` rendered live time during SSR and client a few seconds apart → React hydration mismatch. Now renders `--` placeholders until mounted, then ticks (client-only via `useEffect`).
- **Speakers section on landing page** — added `HomeSpeakers` component (horizontal cards: photo left, name/role/bio/socials right; host featured with badge; 3rd-speaker teaser). `/speakers` page updated to match the same layout (full bios, not clamped).
- **Social icons** — `SocialIcon.tsx` with Instagram + LinkedIn glyphs (currentColor, scalable). Real links added for all 3 speakers in `config.ts`.
- **Repo init + deploy prep** — initialized standalone git repo inside `Bootcamp-web/` (was previously tracked under the user home dir). Added `/images` to `.gitignore` (source originals; optimized copies live in `public/`). `.env.local` excluded so Supabase keys stay private.
- **Deployed** — repo at github.com/abdullatif06/bootcamp-hub (public); live on Vercel with 6 env vars; Supabase + Google Sheet working in production.
- **Animation pass (GSAP + Framer Motion)** — added `gsap`, `@gsap/react`, `framer-motion`. New primitives in `src/components/motion/`: `Reveal`/`RevealGroup`/`RevealItem` (scroll-reveal, reduced-motion aware) and `AnimatedNumber` (spring count-up + live updates). Hero extracted to `Hero.tsx` with a GSAP entrance timeline (clip-reveal headline, staggered CTAs, elastic shapes). Countdown digits flip via AnimatePresence. Live counters/scores animate. Micro-interactions: card hover lifts, poll-answer tap + result-bar fill, leaderboard `layout` reorder. All respect `prefers-reduced-motion`.
- **Next.js bumped** 14.2.15 → 14.2.35 (latest safe 14.x). Remaining audit advisories (next/image disk cache, postcss) only patch in Next 16 (breaking) and don't apply to Vercel-hosted setup — deferred.

---

## Gotchas & notes

- **HEIC images** don't render in browsers — convert before use.
- **Phone normalization** is critical: the registration sheet has mixed formats (`0795...`, `962 779...`). Normalize to a canonical form (strip non-digits, drop leading `962` and `0`, compare last 9 digits) on both the stored sheet value and user input.
- **Published CSV is publicly readable** by anyone with the URL — fine for this use case (unguessable link), but don't treat it as private data.
- **No real auth** — "login" is just a phone-in-sheet check. Don't store anything sensitive tied to it. Admin gate is a single phone number; keep it server-side.
- **MVP discipline:** with ~9 days, resist scope creep. Submission gallery, OTP, and extras are explicitly deferred.
