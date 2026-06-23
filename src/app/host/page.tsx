"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/SessionProvider";
import { useEventState } from "@/lib/useEventState";
import { supabaseEnabled } from "@/lib/supabase";
import {
  fetchPolls,
  createPoll,
  setPollStatus,
  updateEventState,
  fetchAttendeeCount,
} from "@/lib/api";
import type { Poll } from "@/lib/types";

export default function HostPage() {
  const { session, ready } = useSession();
  const router = useRouter();
  const state = useEventState();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [count, setCount] = useState(0);

  // Gate: admins only.
  useEffect(() => {
    if (ready && (!session || !session.isAdmin)) router.replace("/login");
  }, [ready, session, router]);

  const refresh = useCallback(async () => {
    const [p, c] = await Promise.all([fetchPolls(), fetchAttendeeCount()]);
    setPolls(p);
    setCount(c);
  }, []);

  useEffect(() => {
    if (session?.isAdmin) refresh();
  }, [session?.isAdmin, refresh]);

  if (!ready || !session?.isAdmin) return null;

  if (!supabaseEnabled) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="card-brutal p-10">
          <span className="text-5xl">🔌</span>
          <p className="mt-4 font-display text-2xl leading-none text-ink">Supabase not connected</p>
          <p className="mt-2 text-sm text-ink/60">
            Add <code className="font-bold text-royal">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="font-bold text-royal">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code className="font-bold text-royal">.env.local</code>, then run the schema in{" "}
            <code className="font-bold text-royal">supabase/schema.sql</code>.
          </p>
        </div>
      </div>
    );
  }

  const mode = state?.mode ?? "pre";
  const activePollId = state?.active_poll_id ?? null;

  async function setMode(m: "pre" | "live") {
    await updateEventState({ mode: m });
  }
  async function toggleLeaderboard() {
    await updateEventState({ leaderboard_visible: !state?.leaderboard_visible });
  }
  async function setBanner(text: string) {
    await updateEventState({ banner: text || null });
  }
  async function pushPoll(p: Poll) {
    // Close any other open poll, open this one, set it active.
    await Promise.all(
      polls.filter((x) => x.status === "open" && x.id !== p.id).map((x) => setPollStatus(x.id, "closed"))
    );
    await setPollStatus(p.id, "open");
    await updateEventState({ active_poll_id: p.id });
    refresh();
  }
  async function closePoll(p: Poll) {
    await setPollStatus(p.id, "closed");
    if (activePollId === p.id) await updateEventState({ active_poll_id: null });
    refresh();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="star h-4 w-4 bg-royal" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-[0.22em] text-royal">
              Host Dashboard
            </span>
          </div>
          <h1 className="headline text-[clamp(2.25rem,9vw,3.5rem)] text-ink">Control Center</h1>
        </div>
        <div className="text-right">
          <p className="font-display text-4xl leading-none text-royal">{count}</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-ink/50">checked in</p>
        </div>
      </div>

      {/* Mode + toggles */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-brutal p-5">
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-royal">Home mode</p>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("pre")}
              className={`flex-1 rounded-xl border-2 py-3 font-black transition ${
                mode === "pre" ? "border-ink bg-lime text-ink" : "border-ink/15 text-ink/50 hover:border-ink/40"
              }`}
            >
              Pre-event
            </button>
            <button
              onClick={() => setMode("live")}
              className={`flex-1 rounded-xl border-2 py-3 font-black transition ${
                mode === "live" ? "border-ink bg-lime text-ink" : "border-ink/15 text-ink/50 hover:border-ink/40"
              }`}
            >
              🔴 Live
            </button>
          </div>
        </div>

        <div className="card-brutal flex flex-col justify-between p-5">
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-royal">Leaderboard</p>
          <button
            onClick={toggleLeaderboard}
            className={`rounded-xl border-2 py-3 font-black transition ${
              state?.leaderboard_visible ? "border-ink bg-lime text-ink" : "border-ink/15 text-ink/50 hover:border-ink/40"
            }`}
          >
            {state?.leaderboard_visible ? "👁️ Visible — tap to hide" : "🙈 Hidden — tap to reveal"}
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="card-brutal mt-4 p-5">
        <p className="mb-2 text-xs font-black uppercase tracking-widest text-royal">
          &quot;Happening now&quot; banner
        </p>
        <BannerEditor initial={state?.banner ?? ""} onSave={setBanner} />
      </div>

      {/* Create poll */}
      <div className="mt-6">
        <h2 className="mb-3 font-display text-2xl leading-none text-ink">Create a poll</h2>
        <PollCreator onCreated={refresh} />
      </div>

      {/* Poll list */}
      <div className="mt-6">
        <h2 className="mb-3 font-display text-2xl leading-none text-ink">Your polls</h2>
        {polls.length === 0 ? (
          <p className="rounded-2xl border-2 border-ink/10 bg-white p-6 text-center text-sm text-ink/60">
            No polls yet — create one above.
          </p>
        ) : (
          <ul className="space-y-3">
            {polls.map((p) => (
              <li key={p.id} className="card-brutal flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-royal px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">{p.kind === "mcq" ? "MCQ" : "Text"}</span>
                    {p.status === "open" && <span className="text-xs font-black uppercase text-royal">● LIVE</span>}
                    {p.status === "closed" && <span className="text-xs font-bold uppercase text-ink/40">closed</span>}
                  </div>
                  <p className="mt-1 truncate font-bold text-ink">{p.question}</p>
                </div>
                {p.status === "open" ? (
                  <button onClick={() => closePoll(p)} className="btn-outline-dark !py-2 text-sm">
                    Close
                  </button>
                ) : (
                  <button onClick={() => pushPoll(p)} className="btn-dark !py-2 text-sm">
                    Push live →
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function BannerEditor({ initial, onSave }: { initial: string; onSave: (t: string) => void }) {
  const [text, setText] = useState(initial);
  useEffect(() => setText(initial), [initial]);
  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. Prompt Engineering session starting now!"
        className="flex-1 rounded-xl border-2 border-ink/20 bg-cream px-4 py-2.5 text-ink outline-none placeholder:text-ink/30 focus:border-royal"
      />
      <button onClick={() => onSave(text)} className="btn-dark !py-2 text-sm">Set</button>
      {initial && (
        <button onClick={() => onSave("")} className="btn-outline-dark !py-2 text-sm">Clear</button>
      )}
    </div>
  );
}

function PollCreator({ onCreated }: { onCreated: () => void }) {
  const [kind, setKind] = useState<"mcq" | "text">("mcq");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correct, setCorrect] = useState<number>(0);
  const [points, setPoints] = useState(10);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setBusy(true);
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    await createPoll({
      question: question.trim(),
      kind,
      options: kind === "mcq" ? cleanOptions : null,
      correct_index: kind === "mcq" ? correct : null,
      points,
    });
    setBusy(false);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
    onCreated();
  }

  return (
    <form onSubmit={submit} className="card-brutal space-y-4 p-5">
      <div className="flex gap-2">
        {(["mcq", "text"] as const).map((k) => (
          <button
            type="button"
            key={k}
            onClick={() => setKind(k)}
            className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-black transition ${
              kind === k ? "border-ink bg-lime text-ink" : "border-ink/15 text-ink/50 hover:border-ink/40"
            }`}
          >
            {k === "mcq" ? "Multiple choice" : "Open text"}
          </button>
        ))}
      </div>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Your question…"
        className="w-full rounded-xl border-2 border-ink/20 bg-cream px-4 py-3 text-ink outline-none placeholder:text-ink/30 focus:border-royal"
        required
      />

      {kind === "mcq" && (
        <div className="space-y-2">
          {options.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCorrect(i)}
                title="Mark correct"
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 text-sm font-black transition ${
                  correct === i ? "border-ink bg-lime text-ink" : "border-ink/15 text-ink/40 hover:border-ink/40"
                }`}
              >
                {correct === i ? "✓" : String.fromCharCode(65 + i)}
              </button>
              <input
                value={o}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = e.target.value;
                  setOptions(next);
                }}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 rounded-xl border-2 border-ink/15 bg-cream px-3 py-2.5 text-ink outline-none placeholder:text-ink/30 focus:border-royal"
              />
            </div>
          ))}
          <p className="text-xs text-ink/40">Tap the letter to mark the correct answer (✓).</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-sm font-bold text-ink/70">Points</label>
        <input
          type="number"
          min={1}
          value={points}
          onChange={(e) => setPoints(Number(e.target.value) || 0)}
          className="w-24 rounded-xl border-2 border-ink/15 bg-cream px-3 py-2 text-ink outline-none focus:border-royal"
        />
        <button type="submit" disabled={busy} className="btn-dark ml-auto disabled:opacity-60">
          {busy ? "Saving…" : "Create poll"}
        </button>
      </div>
    </form>
  );
}
