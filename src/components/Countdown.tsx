"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const now = Date.now();
  const ms = Math.max(0, target - now);
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    mins: Math.floor((ms % 3_600_000) / 60_000),
    secs: Math.floor((ms % 60_000) / 1000),
    done: ms === 0,
  };
}

export function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime();
  // Start null so server and first client render produce identical markup
  // (placeholder dashes); fill in real values only after mount to avoid a
  // hydration mismatch on the live-ticking time.
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells = [
    { v: t?.days, l: "Days" },
    { v: t?.hours, l: "Hours" },
    { v: t?.mins, l: "Mins" },
    { v: t?.secs, l: "Secs" },
  ];

  return (
    <div className="flex gap-2 sm:gap-4">
      {cells.map((c) => (
        <div
          key={c.l}
          className="flex min-w-[64px] flex-col items-center rounded-2xl border-2 border-lime/40 bg-navy-light/60 px-3 py-3 backdrop-blur sm:min-w-[80px] sm:px-4"
        >
          <span className="font-display text-3xl font-black tabular-nums text-lime sm:text-5xl">
            {c.v === undefined ? "--" : String(c.v).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
            {c.l}
          </span>
        </div>
      ))}
    </div>
  );
}
