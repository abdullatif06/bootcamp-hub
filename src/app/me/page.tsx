"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/components/SessionProvider";
import { fetchAttendee } from "@/lib/api";
import { getSupabase } from "@/lib/supabase";

export default function MePage() {
  const { session, ready, logout } = useSession();
  const router = useRouter();
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);

  // Live score: fetch + subscribe to this attendee's row.
  useEffect(() => {
    if (!session?.attendeeId) return;
    let mounted = true;
    fetchAttendee(session.attendeeId).then((a) => mounted && a && setScore(a.score));

    const sb = getSupabase();
    if (!sb) return;
    const channel = sb
      .channel(`me_${session.attendeeId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "attendees", filter: `id=eq.${session.attendeeId}` },
        (payload) => {
          if (mounted && payload.new) setScore((payload.new as { score: number }).score);
        }
      )
      .subscribe();
    return () => {
      mounted = false;
      sb.removeChannel(channel);
    };
  }, [session?.attendeeId]);

  if (!ready || !session) return null;

  const initials = session.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const info: { label: string; value: string }[] = [
    { label: "University", value: session.university || "—" },
    { label: "Email", value: session.email || "—" },
    { label: "Gender", value: session.gender || "—" },
    { label: "Phone", value: session.phone },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header card */}
      <div className="card-brutal relative overflow-hidden p-7">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lime/20 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-lime font-display text-3xl font-black text-navy shadow-glow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            {session.isAdmin && <span className="chip mb-1">Host</span>}
            <h1 className="truncate font-display text-2xl font-black text-white sm:text-3xl">
              {session.name}
            </h1>
            <p className="text-sm text-slate-300">You&apos;re checked in 🎉</p>
          </div>
        </div>

        {/* Score */}
        <div className="relative mt-6 flex items-center justify-between rounded-2xl border-2 border-lime/40 bg-navy/60 px-5 py-4">
          <span className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Your score
          </span>
          <span className="font-display text-4xl font-black text-lime tabular-nums">
            {score ?? 0}
          </span>
        </div>
      </div>

      {/* Info grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {info.map((i) => (
          <div key={i.label} className="rounded-2xl border border-white/10 bg-navy-light/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {i.label}
            </p>
            <p className="mt-1 truncate font-semibold text-white">{i.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/polls" className="btn-lime">Go to Live Polls →</Link>
        <Link href="/leaderboard" className="btn-outline">Leaderboard</Link>
        {session.isAdmin && (
          <Link href="/host" className="btn-outline">Host Dashboard</Link>
        )}
        <button onClick={logout} className="ml-auto text-sm font-bold text-slate-400 hover:text-lime">
          Log out
        </button>
      </div>
    </div>
  );
}
