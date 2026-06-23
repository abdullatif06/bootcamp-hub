"use client";

import Link from "next/link";
import { EVENT } from "@/lib/config";
import { useEventState } from "@/lib/useEventState";
import { useSession } from "@/components/SessionProvider";
import { Countdown } from "@/components/Countdown";
import { LiveStats } from "@/components/LiveStats";
import { AgendaList } from "@/components/AgendaList";
import { QuickCards } from "@/components/QuickCards";
import { HomeSpeakers } from "@/components/HomeSpeakers";

export default function HomePage() {
  const state = useEventState();
  const { session } = useSession();
  const isLive = state?.mode === "live";

  return (
    <div className="overflow-hidden">
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-4 pb-10 pt-12 sm:pt-16">
        {/* floating shapes */}
        <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 animate-float rounded-full bg-lime/20 blur-2xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-56 w-56 animate-float-slow rounded-[40%] bg-lime-deep/10 blur-3xl" />

        {/* Happening-now banner (live mode) */}
        {isLive && state?.banner && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-lime bg-lime/10 px-5 py-3 shadow-glow-sm animate-pulse-glow">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-lime" />
            </span>
            <p className="font-bold text-white">
              <span className="text-lime">Happening now:</span> {state.banner}
            </p>
          </div>
        )}

        <div className="relative">
          <span className="chip mb-5">
            {isLive ? "🔴 Live now" : `${EVENT.dateLabel} · ${EVENT.locationLabel}`}
          </span>

          {session && (
            <p className="mb-3 font-display text-xl font-bold text-lime">
              Welcome back, {session.name.split(" ")[0]} 👋
            </p>
          )}

          <h1 className="font-display text-5xl font-black leading-[0.95] text-white sm:text-7xl lg:text-8xl">
            Build Your <br />
            First <span className="text-stroke">Startup</span> <br />
            With <span className="text-lime">AI</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-300">
            {EVENT.tagline}. No code experience needed. If you can text, you can
            build. {EVENT.dateLabel} · {EVENT.timeLabel}.
          </p>
        </div>

        {/* CTA row — changes by mode */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {isLive ? (
            <>
              <a href={EVENT.meetUrl} target="_blank" rel="noopener noreferrer" className="btn-lime text-base">
                Join Google Meet →
              </a>
              <Link href="/polls" className="btn-outline text-base">Live Polls</Link>
            </>
          ) : (
            <>
              <a href={EVENT.formUrl} target="_blank" rel="noopener noreferrer" className="btn-lime text-base">
                Register · {EVENT.priceLabel} →
              </a>
              {!session && <Link href="/login" className="btn-outline text-base">I&apos;m registered → Log in</Link>}
            </>
          )}
        </div>

        {/* Countdown (pre) or live stats (live) */}
        <div className="mt-12">
          {isLive ? (
            <LiveStats leaderboardVisible={!!state?.leaderboard_visible} />
          ) : (
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Doors open in
              </p>
              <Countdown targetISO={EVENT.startsAtISO} />
            </div>
          )}
        </div>
      </section>

      {/* ── QUICK ACCESS CARDS ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <QuickCards />
      </section>

      {/* ── AGENDA SNAPSHOT ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="chip mb-2">The Plan</span>
            <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
              Today&apos;s <span className="text-lime">Agenda</span>
            </h2>
          </div>
        </div>
        <AgendaList />
      </section>

      {/* ── SPEAKERS ───────────────────────────────────────── */}
      <HomeSpeakers />

      {/* ── REGISTER STRIP (pre mode) ──────────────────────── */}
      {!isLive && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="card-brutal relative overflow-hidden p-8 text-center sm:p-12">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-lime/20 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-lime-deep/10 blur-2xl" />
            <div className="relative">
              <h2 className="font-display text-4xl font-black text-white sm:text-5xl">
                Ready to <span className="text-lime">build?</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-300">
                {EVENT.priceLabel} at the door. Spots are limited — grab yours before July 2.
              </p>
              <a href={EVENT.formUrl} target="_blank" rel="noopener noreferrer" className="btn-lime mt-6 text-lg">
                Register now →
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
