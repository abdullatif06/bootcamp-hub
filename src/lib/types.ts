export type EventMode = "pre" | "live";

export type EventState = {
  id: number;
  mode: EventMode;
  banner: string | null;
  leaderboard_visible: boolean;
  active_poll_id: string | null;
  updated_at: string;
};

export type PollKind = "mcq" | "text";
export type PollStatus = "draft" | "open" | "closed";

export type Poll = {
  id: string;
  question: string;
  kind: PollKind;
  options: string[] | null;
  correct_index: number | null;
  points: number;
  status: PollStatus;
  created_at: string;
};

export type Attendee = {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  university: string | null;
  gender: string | null;
  score: number;
  created_at: string;
};

export type Vote = {
  id: string;
  poll_id: string;
  attendee_id: string;
  choice_index: number | null;
  text_answer: string | null;
  is_correct: boolean | null;
  created_at: string;
};

/** The logged-in attendee, persisted in localStorage. */
export type Session = {
  attendeeId: string | null; // null when Supabase is offline
  phone: string; // normalized
  name: string;
  email: string;
  university: string;
  gender: string;
  isAdmin: boolean;
};
