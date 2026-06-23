"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "@/components/SessionProvider";
import { useEventState } from "@/lib/useEventState";
import { getSupabase, supabaseEnabled } from "@/lib/supabase";
import { fetchLeaderboard } from "@/lib/api";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import type { Attendee } from "@/lib/types";

export default function LeaderboardPage() {
  const { session } = useSession();
  const state = useEventState();
  const [rows, setRows] = useState<Attendee[]>([]);

  const visible = !!state?.leaderboard_visible || !!session?.isAdmin;

  const refresh = useCallback(() => {
    fetchLeaderboard(100).then(setRows);
  }, []);

  useEffect(() => {
    refresh();
    const sb = getSupabase();
    if (!sb) return;
    const channel = sb
      .channel("leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "attendees" }, refresh)
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, [refresh]);

  const myId = session?.attendeeId;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <span className="chip mb-3">🏆 Standings</span>
        <h1 className="font-display text-5xl font-black text-white sm:text-6xl">
          Leader<span className="text-lime">board</span>
        </h1>
      </div>

      {!supabaseEnabled ? (
        <Hidden text="Leaderboard isn't connected yet — add Supabase keys to enable it." emoji="🔌" />
      ) : !visible ? (
        <Hidden text="The leaderboard is hidden. The host will reveal it at the right moment 🤫" emoji="🙈" />
      ) : rows.length === 0 ? (
        <Hidden text="No scores yet. Answer some polls to get on the board!" emoji="📊" />
      ) : (
        <>
          {/* Podium for top 3 */}
          <div className="mb-6 grid grid-cols-3 items-end gap-2">
            {[1, 0, 2].map((idx) => {
              const a = rows[idx];
              if (!a) return <div key={idx} />;
              const heights = ["h-24", "h-32", "h-20"];
              const place = idx + 1;
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={a.id} className="flex flex-col items-center">
                  <span className="text-3xl">{medals[idx]}</span>
                  <p className="mt-1 max-w-full truncate text-center text-sm font-bold text-white">
                    {a.name.split(" ")[0]}
                  </p>
                  <p className="font-display text-xl font-black text-lime">{a.score}</p>
                  <div
                    className={`mt-2 w-full rounded-t-xl border-2 border-lime/50 bg-lime/10 ${heights[idx]} grid place-items-end justify-center pb-1`}
                  >
                    <span className="font-display text-2xl font-black text-lime/70">#{place}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full list */}
          <ol className="space-y-2">
            <AnimatePresence initial={false}>
              {rows.map((a, i) => {
                const mine = a.id === myId;
                return (
                  <motion.li
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${
                      mine ? "border-lime bg-lime/10 shadow-glow-sm" : "border-white/10 bg-navy-light/40"
                    }`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy/60 font-display font-black text-lime">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-bold text-white">
                      {a.name}
                      {mine && <span className="ml-2 text-xs font-bold text-lime">(you)</span>}
                    </span>
                    <span className="font-display text-xl font-black text-lime tabular-nums">
                      <AnimatedNumber value={a.score} />
                    </span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>
        </>
      )}
    </div>
  );
}

function Hidden({ text, emoji }: { text: string; emoji: string }) {
  return (
    <div className="card-brutal grid place-items-center p-12 text-center">
      <span className="text-5xl">{emoji}</span>
      <p className="mt-4 max-w-sm text-slate-300">{text}</p>
    </div>
  );
}
