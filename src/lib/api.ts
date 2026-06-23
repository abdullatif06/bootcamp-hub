// Data-access layer over Supabase. Every function tolerates Supabase being
// offline (returns sensible defaults) so the UI never hard-crashes.

import { getSupabase } from "./supabase";
import type { Attendee, EventState, Poll, Vote } from "./types";

const DEFAULT_EVENT_STATE: EventState = {
  id: 1,
  mode: "pre",
  banner: null,
  leaderboard_visible: false,
  active_poll_id: null,
  updated_at: new Date().toISOString(),
};

// ── Event state ─────────────────────────────────────────────
export async function fetchEventState(): Promise<EventState> {
  const sb = getSupabase();
  if (!sb) return DEFAULT_EVENT_STATE;
  const { data, error } = await sb.from("event_state").select("*").eq("id", 1).single();
  if (error || !data) return DEFAULT_EVENT_STATE;
  return data as EventState;
}

export async function updateEventState(patch: Partial<EventState>): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb
    .from("event_state")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", 1);
}

// ── Attendees ───────────────────────────────────────────────
/** Upsert an attendee on login (by normalized phone). Returns the row. */
export async function upsertAttendee(input: {
  phone: string;
  name: string;
  email?: string;
  university?: string;
  gender?: string;
}): Promise<Attendee | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const existing = await sb.from("attendees").select("*").eq("phone", input.phone).maybeSingle();
  if (existing.data) {
    // Refresh name/info from the sheet but keep the score.
    const { data } = await sb
      .from("attendees")
      .update({
        name: input.name,
        email: input.email ?? null,
        university: input.university ?? null,
        gender: input.gender ?? null,
      })
      .eq("phone", input.phone)
      .select("*")
      .single();
    return (data as Attendee) ?? (existing.data as Attendee);
  }

  const { data } = await sb
    .from("attendees")
    .insert({
      phone: input.phone,
      name: input.name,
      email: input.email ?? null,
      university: input.university ?? null,
      gender: input.gender ?? null,
    })
    .select("*")
    .single();
  return (data as Attendee) ?? null;
}

export async function fetchAttendee(id: string): Promise<Attendee | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from("attendees").select("*").eq("id", id).maybeSingle();
  return (data as Attendee) ?? null;
}

export async function fetchLeaderboard(limit = 50): Promise<Attendee[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("attendees")
    .select("*")
    .order("score", { ascending: false })
    .limit(limit);
  return (data as Attendee[]) ?? [];
}

export async function fetchAttendeeCount(): Promise<number> {
  const sb = getSupabase();
  if (!sb) return 0;
  const { count } = await sb.from("attendees").select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function addScore(attendeeId: string, delta: number): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const current = await fetchAttendee(attendeeId);
  if (!current) return;
  await sb.from("attendees").update({ score: current.score + delta }).eq("id", attendeeId);
}

// ── Polls ───────────────────────────────────────────────────
export async function fetchPolls(): Promise<Poll[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from("polls").select("*").order("created_at", { ascending: false });
  return (data as Poll[]) ?? [];
}

export async function fetchPoll(id: string): Promise<Poll | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from("polls").select("*").eq("id", id).maybeSingle();
  return (data as Poll) ?? null;
}

export async function createPoll(input: {
  question: string;
  kind: "mcq" | "text";
  options: string[] | null;
  correct_index: number | null;
  points: number;
}): Promise<Poll | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from("polls").insert({ ...input, status: "draft" }).select("*").single();
  return (data as Poll) ?? null;
}

export async function setPollStatus(id: string, status: Poll["status"]): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("polls").update({ status }).eq("id", id);
}

// ── Votes ───────────────────────────────────────────────────
export async function fetchVotesForPoll(pollId: string): Promise<Vote[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from("votes").select("*").eq("poll_id", pollId);
  return (data as Vote[]) ?? [];
}

export async function fetchMyVote(pollId: string, attendeeId: string): Promise<Vote | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("votes")
    .select("*")
    .eq("poll_id", pollId)
    .eq("attendee_id", attendeeId)
    .maybeSingle();
  return (data as Vote) ?? null;
}

/**
 * Submit an answer. For MCQ, evaluates correctness and awards points.
 * Returns { ok, alreadyVoted, isCorrect, awarded }.
 */
export async function submitVote(input: {
  poll: Poll;
  attendeeId: string;
  choiceIndex?: number;
  textAnswer?: string;
}): Promise<{ ok: boolean; alreadyVoted: boolean; isCorrect: boolean; awarded: number }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, alreadyVoted: false, isCorrect: false, awarded: 0 };

  const existing = await fetchMyVote(input.poll.id, input.attendeeId);
  if (existing) return { ok: false, alreadyVoted: true, isCorrect: !!existing.is_correct, awarded: 0 };

  const isCorrect =
    input.poll.kind === "mcq" &&
    input.poll.correct_index != null &&
    input.choiceIndex === input.poll.correct_index;

  const { error } = await sb.from("votes").insert({
    poll_id: input.poll.id,
    attendee_id: input.attendeeId,
    choice_index: input.choiceIndex ?? null,
    text_answer: input.textAnswer ?? null,
    is_correct: input.poll.kind === "mcq" ? isCorrect : null,
  });
  if (error) {
    // Unique violation → they already voted in a race.
    return { ok: false, alreadyVoted: true, isCorrect: false, awarded: 0 };
  }

  let awarded = 0;
  // MCQ: award for correct. Text: award participation points (scoring is poll-driven).
  if (input.poll.kind === "mcq" && isCorrect) awarded = input.poll.points;
  if (input.poll.kind === "text") awarded = input.poll.points;
  if (awarded > 0) await addScore(input.attendeeId, awarded);

  return { ok: true, alreadyVoted: false, isCorrect, awarded };
}
