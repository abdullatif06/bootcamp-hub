"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "@/components/SessionProvider";
import { useEventState } from "@/lib/useEventState";
import { supabaseEnabled, getSupabase } from "@/lib/supabase";
import { fetchPoll, fetchMyVote, fetchVotesForPoll, submitVote } from "@/lib/api";
import type { Poll, Vote } from "@/lib/types";
import { EVENT } from "@/lib/config";

export default function PollsPage() {
  const { session, ready } = useSession();
  const state = useEventState();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [myVote, setMyVote] = useState<Vote | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const activeId = state?.active_poll_id ?? null;

  // Load the active poll + my vote + tallies.
  const loadPoll = useCallback(async () => {
    if (!activeId) {
      setPoll(null);
      setMyVote(null);
      setVotes([]);
      return;
    }
    const p = await fetchPoll(activeId);
    setPoll(p);
    if (p) {
      const [mv, vs] = await Promise.all([
        session?.attendeeId ? fetchMyVote(p.id, session.attendeeId) : Promise.resolve(null),
        fetchVotesForPoll(p.id),
      ]);
      setMyVote(mv);
      setVotes(vs);
    }
  }, [activeId, session?.attendeeId]);

  useEffect(() => {
    loadPoll();
  }, [loadPoll]);

  // Realtime: votes for the active poll + poll status changes.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !activeId) return;
    const channel = sb
      .channel(`poll_${activeId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "votes", filter: `poll_id=eq.${activeId}` }, () => {
        fetchVotesForPoll(activeId).then(setVotes);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "polls", filter: `id=eq.${activeId}` }, (payload) => {
        if (payload.new) setPoll(payload.new as Poll);
      })
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, [activeId]);

  async function handleMcq(choiceIndex: number) {
    if (!poll || !session?.attendeeId || myVote || submitting) return;
    setSubmitting(true);
    const res = await submitVote({ poll, attendeeId: session.attendeeId, choiceIndex });
    setSubmitting(false);
    if (res.alreadyVoted) {
      setFlash("You already answered this one.");
    } else if (res.ok) {
      setFlash(res.isCorrect ? `Correct! +${res.awarded} points 🎉` : "Answer locked in.");
      loadPoll();
    }
  }

  async function handleText(e: React.FormEvent) {
    e.preventDefault();
    if (!poll || !session?.attendeeId || myVote || submitting || !textAnswer.trim()) return;
    setSubmitting(true);
    const res = await submitVote({ poll, attendeeId: session.attendeeId, textAnswer: textAnswer.trim() });
    setSubmitting(false);
    if (res.ok) {
      setFlash(res.awarded > 0 ? `Submitted! +${res.awarded} points 🎉` : "Answer submitted.");
      loadPoll();
    } else if (res.alreadyVoted) {
      setFlash("You already answered this one.");
    }
  }

  // ── Gates ──────────────────────────────────────────────
  if (!supabaseEnabled) {
    return <Notice title="Live polls aren't connected yet" body="Add your Supabase keys to .env.local to enable realtime polls." />;
  }
  if (ready && !session) {
    return (
      <Notice
        title="Log in to join the polls"
        body="Enter your registered phone number to start answering and earning points."
        cta={{ href: "/login", label: "Log in →" }}
      />
    );
  }

  const totalVotes = votes.length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="chip mb-2">⚡ Live Polls</span>
          <h1 className="font-display text-3xl font-black text-white">Answer & Earn</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
          </span>
          Live
        </div>
      </div>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="mb-4 rounded-xl border-2 border-lime bg-lime/10 px-4 py-3 text-center font-bold text-lime"
          >
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      {!poll || poll.status !== "open" ? (
        <div className="card-brutal grid place-items-center p-12 text-center">
          <span className="text-5xl">⏳</span>
          <p className="mt-4 font-display text-xl font-black text-white">
            No poll is live right now
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Hang tight — the host will push the next question soon. Keep this page open.
          </p>
          <a href={EVENT.meetUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5 text-sm">
            Open Google Meet
          </a>
        </div>
      ) : (
        <motion.div
          key={poll.id}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="card-brutal p-6"
        >
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
            {poll.kind === "mcq" ? "Multiple choice" : "Open answer"} · {poll.points} pts
          </p>
          <h2 className="font-display text-2xl font-black leading-tight text-white">
            {poll.question}
          </h2>

          {/* MCQ */}
          {poll.kind === "mcq" && poll.options && (
            <div className="mt-5 space-y-3">
              {poll.options.map((opt, i) => {
                const count = votes.filter((v) => v.choice_index === i).length;
                const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                const answered = !!myVote;
                const isMine = myVote?.choice_index === i;
                const isCorrect = poll.correct_index === i;
                return (
                  <motion.button
                    key={i}
                    disabled={answered || submitting}
                    onClick={() => handleMcq(i)}
                    whileHover={!answered ? { scale: 1.02 } : undefined}
                    whileTap={!answered ? { scale: 0.97 } : undefined}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`relative w-full overflow-hidden rounded-xl border-2 px-4 py-4 text-left font-bold transition-colors ${
                      answered
                        ? isCorrect
                          ? "border-lime text-white"
                          : isMine
                          ? "border-red-400/60 text-white"
                          : "border-white/10 text-slate-300"
                        : "border-lime/40 text-white hover:border-lime hover:bg-lime/5"
                    } disabled:cursor-default`}
                  >
                    {/* result bar */}
                    {answered && (
                      <motion.span
                        className={`absolute inset-y-0 left-0 -z-0 ${isCorrect ? "bg-lime/20" : "bg-white/5"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/60 text-sm">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                        {answered && isCorrect && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          >
                            ✓
                          </motion.span>
                        )}
                      </span>
                      {answered && <span className="text-sm text-slate-400">{pct}%</span>}
                    </span>
                  </motion.button>
                );
              })}
              {myVote && (
                <p className="pt-1 text-center text-xs text-slate-500">{totalVotes} answer{totalVotes === 1 ? "" : "s"} in</p>
              )}
            </div>
          )}

          {/* Text */}
          {poll.kind === "text" && (
            <div className="mt-5">
              {myVote ? (
                <div className="rounded-xl border-2 border-lime bg-lime/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Your answer</p>
                  <p className="mt-1 font-semibold text-white">{myVote.text_answer}</p>
                </div>
              ) : (
                <form onSubmit={handleText} className="space-y-3">
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    rows={3}
                    placeholder="Type your answer…"
                    className="w-full rounded-xl border-2 border-lime/40 bg-navy px-4 py-3 text-white outline-none focus:border-lime"
                    required
                  />
                  <button type="submit" disabled={submitting} className="btn-lime w-full justify-center disabled:opacity-60">
                    {submitting ? "Submitting…" : "Submit answer"}
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      )}

      <Link href="/leaderboard" className="mt-6 block text-center text-sm font-bold text-slate-400 hover:text-lime">
        Check the leaderboard →
      </Link>
    </div>
  );
}

function Notice({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="card-brutal grid place-items-center p-10 text-center">
        <span className="text-5xl">🔒</span>
        <p className="mt-4 font-display text-xl font-black text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-400">{body}</p>
        {cta && (
          <Link href={cta.href} className="btn-lime mt-5">{cta.label}</Link>
        )}
      </div>
    </div>
  );
}
