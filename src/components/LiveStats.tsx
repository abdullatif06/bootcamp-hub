"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getSupabase } from "@/lib/supabase";
import { fetchAttendeeCount, fetchLeaderboard } from "@/lib/api";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import type { Attendee } from "@/lib/types";

/** Live attendee count + top-3 leaderboard preview (Home above-the-fold). */
export function LiveStats({ leaderboardVisible }: { leaderboardVisible: boolean }) {
  const [count, setCount] = useState<number>(0);
  const [top, setTop] = useState<Attendee[]>([]);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      const [c, lb] = await Promise.all([fetchAttendeeCount(), fetchLeaderboard(3)]);
      if (!mounted) return;
      setCount(c);
      setTop(lb);
    };
    refresh();

    const sb = getSupabase();
    if (!sb) return;
    const channel = sb
      .channel("livestats")
      .on("postgres_changes", { event: "*", schema: "public", table: "attendees" }, refresh)
      .subscribe();
    return () => {
      mounted = false;
      sb.removeChannel(channel);
    };
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Online count */}
      <div className="card-brutal flex flex-col justify-center p-5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-lime" />
          </span>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Attendees in
          </span>
        </div>
        <p className="mt-2 font-display text-5xl font-black text-lime tabular-nums">
          <AnimatedNumber value={count} />
        </p>
      </div>

      {/* Top 3 preview */}
      <div className="card-brutal p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Top 3
          </span>
          <Link href="/leaderboard" className="text-xs font-bold text-lime hover:underline">
            View all →
          </Link>
        </div>
        {!leaderboardVisible ? (
          <p className="py-4 text-center text-sm text-slate-500">
            Leaderboard hidden — revealed by the host 🤫
          </p>
        ) : top.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">No scores yet.</p>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {top.map((a, i) => (
                <motion.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="text-lg">{medals[i]}</span>
                    <span className="truncate font-bold text-white">{a.name}</span>
                  </span>
                  <span className="font-display font-black text-lime tabular-nums">
                    <AnimatedNumber value={a.score} />
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
