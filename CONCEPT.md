# Build Your First Startup With AI — Web Concept

The companion hub for the **Vibe Coding Bootcamp**. One site that works in two modes: a pre-event landing page *and* a live in-event hub, all controlled by the host.

---

## Event facts

| | |
|---|---|
| **Event name** | Build Your First Startup With AI (Vibe Coding Bootcamp) |
| **Date & time** | Thursday, July 2, 2026 · 5:00–7:00 PM |
| **Format** | Fully online via Google Meet |
| **Meet link** | `meet.google.com/dkw-qmct-qui` |
| **Price** | 3 JOD, cash at the door |
| **Location text** | Online (Google Meet is the main CTA — no physical venue) |
| **Sponsors** | @cura.code (`images/sponsor logos/curacode.jpeg`), @fast.source (`images/sponsor logos/fastsource.jpg`) |

### Brand
- **Colors:** lime green `#deff9a`, navy `#0f172a`
- **Fonts:** Montserrat (headings/UI), Playfair Display (display/accent)
- **Design language:** **Bold maximalism** — layered overlapping elements, gradient blobs, dynamic shapes, big lime splashes on navy, ultra-bold Montserrat headings. Busy but intentional.
- **Mobile:** App-like — full-screen cards, large tap targets. Attendees are on phones during the event.

---

## What the site does

### Two modes on the Home page
1. **Before the event** — countdown to July 2, registration CTA, agenda preview, speakers preview.
2. **During the event** — live hub: polls, leaderboard, "happening now" banner.

**Mode switch is manual** — the host flips it from the dashboard (no auto date-switching).

---

## Sitemap

### Public pages (nav bar)
- **Home** — personalized welcome, live "happening now" banner (host-driven), agenda snapshot, quick-access cards, live attendee count + top-3 leaderboard preview, sponsor logos, countdown + registration CTA.
- **Live Polls** — synced in real time across every device.
- **Leaderboard** — live-updating scores (visibility host-controlled).
- **Speakers** — host + guest speakers (photo, bio, social links).
- **Resources** — downloadable slides/PDFs, AI prompt library, external links. Available as **prep material before the event**.
- ~~Project Gallery~~ — **cut for now** (no submissions in MVP).

### Private
- **Host Dashboard** — push live polls, award/update scores, toggle leaderboard visibility, flip Home between pre-event/live modes, set the "happening now" banner.

---

## Auth & identity

- **Attendees log in with their phone number only** — no OTP, no password.
- Phone is matched against the **registration sheet**. If it's not in the sheet → blocked (ensures only registrants get in).
- **Smart phone matching:** normalize all formats (spaces, country code `962`, leading `0`) so `0795276144`, `962 795276144`, `+962 795 276144` all resolve to the same person.
- On login, the attendee sees **their full registration info + their current score**.
- **Admin** logs in with a special admin phone number: `0782173172` (stored in `.env`, not in code).

### Registration sheet
- **Source:** the Google Form responses sheet, **published to web as CSV** (File → Share → Publish to web).
- **Columns:** Name · Email · Phone · Confirmed (Yes/No) · University · Gender
- **Live-connected** — the app fetches the published CSV so new registrations (which keep coming until July 2) are picked up automatically.
- **Registration CTA** links out to the existing Google Form:
  `https://docs.google.com/forms/d/e/1FAIpQLSf2wdizy1jwxNhfeHfkK9ifMZW4O2OO7LpoinSSoY0DODbWSQ/viewform`

---

## Live features

### Polls / quizzes
- **Host chooses format per poll:** multiple choice (A/B/C/D) **or** open text.
- Pushed live from the dashboard; appear instantly on attendee devices.
- **Realtime:** Supabase Realtime (websockets) — true instant sync, venue WiFi assumed reliable.

### Leaderboard
- **Scoring:** points come from **answering live polls/quizzes only**.
- **Visibility is host-controlled** — hidden by default, host reveals at key moments.
- **Prizes:** top leaderboard scorers win — the wrap-up ties winners to the final leaderboard reveal.

---

## Agenda (July 2, 5:00–7:00 PM)

| Time | Session |
|---|---|
| 5:00 | Welcome & Intro |
| 5:15–5:30 | Speakers Session (3 speakers; 3rd hidden for now) |
| 5:30–5:40 | Break |
| 5:40–6:00 | Prompt Engineering Session |
| 6:00–6:40 | Building |
| 6:40–7:00 | Wrap Up + Prizes + What's Next |

---

## Speakers

1. **Osama Al-Said** — 6th-year Medical Student & Co-Founder of CuraCode
   > CuraCode is a student-led initiative dedicated to providing hands-on research training. We empower aspiring researchers through a comprehensive digital ecosystem, featuring an advanced, all-in-one web platform equipped with essential research tools.
   - Photo: `images/Osama Al-Said.jpg`

2. **Eng. Zeyad Alsarahne** — Chief AI Transformation Officer, FastSource Solution
   > A digital transformation and AI leader with over 10 years of experience in business development, digital marketing, and technology. Currently Chief AI Transformation Officer at FastSource Solution, helping organizations leverage AI and digital transformation to drive growth, efficiency, and innovation. With a background in Computer Software Engineering, Zeyad combines technical expertise with business strategy to turn emerging technologies into practical, high-impact solutions.
   - Photo: `images/Eng. Zeyad Alsarahne.jpg`

3. **Special Guest** — *3rd speaker, hidden until details are provided.*

### Host
- **Abdullatif Qaisieh** — Frontend Developer & AI Engineer
  > My goal is to completely shatter the technical barrier to entry. If you can text, you can build.
  - Photo: `images/Abdullatif Qaisieh.jpg` ✅ *(portrait shot — will be cropped to face/upper body for the card)*

---

## Tech stack

- **Next.js** — frontend framework
- **Supabase** — database, auth-by-phone-match, realtime sync
- **Vercel** — hosting (free subdomain, e.g. `*.vercel.app`)

---

## Timeline risk

Today is **June 23** — ~9 days to build before the event. This is an **MVP build**. Cut scope before cutting the deadline.

### MVP scope (must-have for July 2)
- Home (both modes) with manual host toggle
- Phone-match login against live Google Sheet CSV
- Live polls (MCQ + open text) via Supabase Realtime
- Leaderboard (host-controlled visibility) + scoring from polls
- Speakers page (2 visible + host)
- Resources page (prep material)
- Host dashboard (push polls, scores, toggles, mode switch)

### Explicitly cut / deferred
- Project submission gallery
- OTP/SMS verification
- 3rd speaker details
- ~~Real sponsor logos~~ ✅ provided (CuraCode + FastSource)
- ~~HOST photo~~ ✅ done (`images/Abdullatif Qaisieh.jpg`)
