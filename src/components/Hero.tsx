"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { EVENT } from "@/lib/config";
import { Countdown } from "@/components/Countdown";
import { LiveStats } from "@/components/LiveStats";
import type { EventState } from "@/lib/types";
import type { Session } from "@/lib/types";

export function Hero({
  state,
  session,
}: {
  state: EventState | null;
  session: Session | null;
}) {
  const root = useRef<HTMLDivElement>(null);
  const isLive = state?.mode === "live";

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return; // respect reduced motion — elements stay visible

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-chip", { y: 20, opacity: 0, duration: 0.5 })
        .from(
          ".hero-welcome",
          { y: 20, opacity: 0, duration: 0.4 },
          "-=0.25"
        )
        // headline lines reveal with a clip + stagger
        .from(
          ".hero-line",
          { yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.12 },
          "-=0.2"
        )
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          ".hero-cta",
          { y: 24, opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
          "-=0.3"
        )
        .from(".hero-counter", { y: 30, opacity: 0, duration: 0.6 }, "-=0.2")
        // floating shapes drift in
        .from(
          ".hero-shape",
          { scale: 0, opacity: 0, duration: 1, stagger: 0.15, ease: "elastic.out(1, 0.6)" },
          0.2
        );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative mx-auto max-w-6xl px-4 pb-10 pt-12 sm:pt-16"
    >
      {/* floating shapes */}
      <div className="hero-shape pointer-events-none absolute -left-16 top-10 h-40 w-40 animate-float rounded-full bg-lime/20 blur-2xl" />
      <div className="hero-shape pointer-events-none absolute right-0 top-40 h-56 w-56 animate-float-slow rounded-[40%] bg-lime-deep/10 blur-3xl" />

      {/* Happening-now banner (live mode) */}
      {isLive && state?.banner && (
        <div className="hero-chip mb-6 flex items-center gap-3 rounded-2xl border-2 border-lime bg-lime/10 px-5 py-3 shadow-glow-sm animate-pulse-glow">
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
        <span className="hero-chip chip mb-5 inline-block">
          {isLive ? "🔴 Live now" : `${EVENT.dateLabel} · ${EVENT.locationLabel}`}
        </span>

        {session && (
          <p className="hero-welcome mb-3 font-display text-xl font-bold text-lime">
            Welcome back, {session.name.split(" ")[0]} 👋
          </p>
        )}

        <h1 className="font-display text-5xl font-black leading-[0.95] text-white sm:text-7xl lg:text-8xl">
          <span className="block overflow-hidden">
            <span className="hero-line inline-block">Build Your</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line inline-block">
              First <span className="text-stroke">Startup</span>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line inline-block">
              With <span className="text-lime">AI</span>
            </span>
          </span>
        </h1>

        <p className="hero-sub mt-6 max-w-xl text-lg text-slate-300">
          {EVENT.tagline}. No code experience needed. If you can text, you can
          build. {EVENT.dateLabel} · {EVENT.timeLabel}.
        </p>
      </div>

      {/* CTA row — changes by mode */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {isLive ? (
          <>
            <a href={EVENT.meetUrl} target="_blank" rel="noopener noreferrer" className="hero-cta btn-lime text-base">
              Join Google Meet →
            </a>
            <Link href="/polls" className="hero-cta btn-outline text-base">Live Polls</Link>
          </>
        ) : (
          <>
            <a href={EVENT.formUrl} target="_blank" rel="noopener noreferrer" className="hero-cta btn-lime text-base">
              Register · {EVENT.priceLabel} →
            </a>
            {!session && <Link href="/login" className="hero-cta btn-outline text-base">I&apos;m registered → Log in</Link>}
          </>
        )}
      </div>

      {/* Countdown (pre) or live stats (live) */}
      <div className="hero-counter mt-12">
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
  );
}
