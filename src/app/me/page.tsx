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
        <span className="star pointer-events-none absolute -right-4 -top-4 h-20 w-20 text-royal opacity-20" aria-hidden="true" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-royal font-display text-3xl text-lime">
            {initials}
          </div>
          <div className="min-w-0">
            {session.isAdmin && (
              <span className="mb-1 inline-block rounded-full bg-lime px-3 py-1 text-[10px] font-black uppercase tracking-wide text-ink">
                Host
              </span>
            )}
            <h1 className="truncate font-display text-3xl leading-none text-ink sm:text-4xl">
              {session.name}
            </h1>
            <p className="mt-1 text-sm text-ink/60">You&apos;re checked in 🎉</p>
          </div>
        </div>

        {/* Score */}
        <div className="relative mt-6 flex items-center justify-between rounded-2xl bg-ink px-5 py-4">
          <span className="text-sm font-black uppercase tracking-wide text-white/50">
            Your score
          </span>
          <span className="font-display text-4xl text-lime tabular-nums">
            {score ?? 0}
          </span>
        </div>
      </div>

      {/* Info grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {info.map((i) => (
          <div key={i.label} className="rounded-2xl border-2 border-ink/10 bg-white p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-royal">
              {i.label}
            </p>
            <p className="mt-1 truncate font-semibold text-ink">{i.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/polls" className="btn-dark">
          Go to Live Polls
          <span className="arrow-badge">→</span>
        </Link>
        <Link href="/leaderboard" className="btn-outline-dark">Leaderboard</Link>
        {session.isAdmin && (
          <Link href="/host" className="btn-outline-dark">Host Dashboard</Link>
        )}
        <button onClick={logout} className="ml-auto text-sm font-bold text-ink/50 transition hover:text-royal">
          Log out
        </button>
      </div>
    </div>
  );
}
