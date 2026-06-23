-- ============================================================
-- Build Your First Startup With AI — Supabase schema
-- Run this in the Supabase SQL editor (one time).
-- ============================================================

-- ── Event state (single row, host-controlled) ──────────────
create table if not exists event_state (
  id            int primary key default 1,
  mode          text not null default 'pre' check (mode in ('pre','live')),
  banner        text,                       -- "happening now" message, nullable
  leaderboard_visible boolean not null default false,
  active_poll_id uuid,                       -- which poll is live, nullable
  updated_at    timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into event_state (id) values (1) on conflict (id) do nothing;

-- ── Attendees (created on first phone login) ────────────────
-- Identity = normalized phone. Name/info come from the registration sheet.
create table if not exists attendees (
  id          uuid primary key default gen_random_uuid(),
  phone       text not null unique,         -- normalized (last 9 digits)
  name        text not null,
  email       text,
  university   text,
  gender       text,
  score        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Polls ───────────────────────────────────────────────────
create table if not exists polls (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  kind        text not null check (kind in ('mcq','text')),
  options     jsonb,                         -- ["A","B","C","D"] for mcq, null for text
  correct_index int,                         -- index of correct option for mcq, null otherwise
  points      int not null default 10,
  status      text not null default 'draft' check (status in ('draft','open','closed')),
  created_at  timestamptz not null default now()
);

-- ── Votes / answers ─────────────────────────────────────────
create table if not exists votes (
  id           uuid primary key default gen_random_uuid(),
  poll_id      uuid not null references polls(id) on delete cascade,
  attendee_id  uuid not null references attendees(id) on delete cascade,
  choice_index int,                          -- for mcq
  text_answer  text,                         -- for text polls
  is_correct   boolean,                      -- evaluated for mcq
  created_at   timestamptz not null default now(),
  unique (poll_id, attendee_id)              -- one answer per attendee per poll
);

-- ── Helpful indexes ─────────────────────────────────────────
create index if not exists idx_votes_poll on votes(poll_id);
create index if not exists idx_attendees_score on attendees(score desc);

-- ============================================================
-- Row Level Security
-- This event has no real auth (phone-match only), so the anon
-- key needs read + limited write. Lock down later if desired.
-- ============================================================
alter table event_state enable row level security;
alter table attendees   enable row level security;
alter table polls       enable row level security;
alter table votes       enable row level security;

-- Everyone can read everything (public hub).
create policy "read event_state" on event_state for select using (true);
create policy "read attendees"   on attendees   for select using (true);
create policy "read polls"       on polls       for select using (true);
create policy "read votes"       on votes       for select using (true);

-- Attendees can be created/updated by anon (login + score).
create policy "write attendees" on attendees for insert with check (true);
create policy "update attendees" on attendees for update using (true);

-- Votes can be inserted by anon.
create policy "write votes" on votes for insert with check (true);

-- Host actions (polls + event_state) are also via anon key in this MVP,
-- gated client-side by admin phone. Tighten with a service role later.
create policy "write polls"      on polls       for insert with check (true);
create policy "update polls"     on polls       for update using (true);
create policy "update event_state" on event_state for update using (true);

-- ============================================================
-- Realtime: enable on the tables the client subscribes to.
-- ============================================================
alter publication supabase_realtime add table event_state;
alter publication supabase_realtime add table polls;
alter publication supabase_realtime add table votes;
alter publication supabase_realtime add table attendees;
