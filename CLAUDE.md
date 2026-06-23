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

### 2026-06-23 (later) — Bold-maximalist agency redesign

Retheme of the **home page + shared chrome** to match an uploaded agency reference (royal-blue / lime / cream flat color blocks, oversized condensed type, tilted ticker). Scope at the time was deliberately "home + chrome only" — inner pages still used the old dark navy theme. **That follow-up is now done** (see the next entry).

- **Fonts swapped** Montserrat/Playfair → **Bebas Neue** (oversized condensed display, all-caps) + **Inter** (body). `layout.tsx` + `tailwind.config.ts` (`--font-bebas`/`--font-inter`).
- **Dark mode removed** — body base is now cream, not ink. New color utilities in `tailwind.config.ts`: `royal` (#2233ff), `cream` (#f4f1ea), `ink` (#0b0e14). New section helpers in `globals.css`: `.section-royal/.section-lime/.section-cream/.section-ink`, four-point `.star` motif, `.container-wide` (1600px, near edge-to-edge), agency button/card restyles.
- **Hero rebuilt** (`Hero.tsx`) — royal block with a giant 3-layer headline (solid lime behind the person + outline-only copy on top that shows THROUGH the cutout — the "see-through" merge), the **Abdullatif cutout** (`public/hero/person.png`, real transparent PNG), stat rail (34+/3+/2H), AI logo chips (`public/ai-logos/{chatgpt,claude,gemini}.svg`), body+CTA, and the **countdown moved INSIDE** the hero. GSAP entrance extended (rail/headline/photo/logos/stars).
- **Marquee** (`Marquee.tsx`, new) — bold tilted lime ticker (`AI Startup ✦ Build in 2 Hours ✦ July 2 ✦ Vibe Coding`), pure-CSS infinite scroll, `overflow-x-clip`+`overflow-y-visible` so the tilt shows fully (not clipped). Rendered INSIDE the hero on mobile (overlapping the headshot bottom, royal gap above), and as a page-level band on desktop pulled up to bridge the hero→cream seam (royal-top/cream-bottom gradient wrapper).
- **Sections recolored** — QuickCards (white/royal/lime service bento on cream), Agenda (royal block, numbered rows), HomeSpeakers (cream, image-forward cards), Footer (royal CTA + cream info), NavBar (cream bar, royal "B"), Countdown (ink cells).
- **Responsive hero** — mobile-first ordering (headshot+headline fill the first screen → slider → stats → CTA → countdown), `clamp()`/`svh` sizing, head clears the headline (photo `pt-[14vw]` on mobile). LLM icons were added then **removed from mobile** per request. Desktop headshot+headline enlarged; slider overlap tuned to a small `-mt-16` so the photo is cut cleanly at the band (no jacket bleeding onto cream below).
- **Gotcha — stale `.next` cache dropped new Tailwind colors.** After adding `royal`/`ink`/`cream`, the `bg-royal`/`border-ink`/etc. utilities silently failed to compile (navbar "B" + hamburger rendered unstyled) until `.next` was cleared and rebuilt. If new theme colors don't apply, `rm -rf .next` and rebuild.

### 2026-06-23 (later still) — Inner pages converted to agency theme

Finished the outstanding follow-up: converted **all 7 inner pages** off the old dark-navy theme onto the agency theme (cream/white surfaces, `ink` text, `royal` accents, `headline`/`font-display` headings, `.star` eyebrows). Home page + chrome were already done; this brings the whole app visually consistent.

- **Pages converted:** `/login`, `/me`, `/speakers`, `/resources`, `/polls`, `/leaderboard`, `/host`.
- **Systematic class translation:** `text-white`→`text-ink`, `text-slate-300/400/500`→`text-ink/60`–`/40`, `bg-navy` inputs→`bg-cream` with `border-ink/20` + `focus:border-royal`, `border-white/10`→`border-ink/10`, `text-lime` accents on light bg→`text-royal`, `chip` eyebrows→`.star` + `tracking-[0.22em]` royal label, blurred gradient blobs→flat `.star` motifs. Headings now use `headline`/`font-display` (Bebas, no `font-black`).
- **New button utility** in `globals.css`: `.btn-outline-dark` (ink border/text, fills ink on hover) — the old `.btn-outline` is lime-on-transparent and is invisible on cream, so light-section secondary buttons use the new variant. Primary CTAs on light sections use `.btn-dark` + `.arrow-badge`.
- **`/speakers`** rebuilt from dark horizontal cards → agency image-forward cards (photo-on-top, 3-col grid) matching `HomeSpeakers`, but bios stay un-clamped (detail page).
- **`/polls`** MCQ result states re-keyed to light palette: correct=`border-royal`+`bg-royal/15` bar, wrong-mine=`border-red-400`, others=`border-ink/15`; letter badges `bg-cream-soft`. Flash banner now lime/ink.
- **`/leaderboard`** podium blocks tinted per place (gold→lime, silver→royal, bronze→white), "you" row `border-royal bg-royal/5`.
- **`/host`** toggle "active" state = `bg-lime` + `border-ink` (was `bg-lime text-navy`); inactive = `border-ink/15 text-ink/50`. All form inputs cream-themed.
- Cleared `.next` before building (per the gotcha above, since new utility combos were added). `tsc --noEmit` clean; prod build green — all 12 routes compile.
- **Remaining:** no inner pages left on the dark theme. `supabase/`-driven flows untouched (logic unchanged, styling only).

---

## Gotchas & notes

- **HEIC images** don't render in browsers — convert before use.
- **Phone normalization** is critical: the registration sheet has mixed formats (`0795...`, `962 779...`). Normalize to a canonical form (strip non-digits, drop leading `962` and `0`, compare last 9 digits) on both the stored sheet value and user input.
- **Published CSV is publicly readable** by anyone with the URL — fine for this use case (unguessable link), but don't treat it as private data.
- **No real auth** — "login" is just a phone-in-sheet check. Don't store anything sensitive tied to it. Admin gate is a single phone number; keep it server-side.
- **MVP discipline:** with ~9 days, resist scope creep. Submission gallery, OTP, and extras are explicitly deferred.
