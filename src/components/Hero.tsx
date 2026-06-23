"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { EVENT } from "@/lib/config";
import { Countdown } from "@/components/Countdown";
import { LiveStats } from "@/components/LiveStats";
import { Marquee } from "@/components/Marquee";
import type { EventState } from "@/lib/types";
import type { Session } from "@/lib/types";

/** Hero stat counters — agency-reference style (big number + label). */
const STATS = [
  { value: "34+", label: "Registered" },
  { value: "3+", label: "Speakers" },
  { value: "2h", label: "Live Build" },
];

const AI_LOGOS = [
  { src: "/ai-logos/chatgpt.svg", alt: "ChatGPT" },
  { src: "/ai-logos/claude.svg", alt: "Claude" },
  { src: "/ai-logos/gemini.svg", alt: "Gemini" },
];

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

      tl.from(".hero-rail > *", { x: -24, opacity: 0, duration: 0.5, stagger: 0.12 })
        // headline lines clip-reveal upward, staggered
        .from(
          ".hero-line",
          { yPercent: 115, opacity: 0, duration: 0.85, stagger: 0.12 },
          "-=0.3"
        )
        // outline headline fades in alongside the solid one
        .from(
          ".hero-outline",
          { opacity: 0, duration: 0.6 },
          "<"
        )
        // person cutout drops in over the headline
        .from(
          ".hero-photo",
          { y: 60, opacity: 0, scale: 0.94, duration: 1, ease: "back.out(1.3)" },
          "-=0.6"
        )
        .from(".hero-side > *", { x: 24, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.7")
        // mobile AI logo icons pop in
        .from(
          ".hero-logos > *",
          { scale: 0, opacity: 0, duration: 0.4, stagger: 0.08, ease: "back.out(2)" },
          "-=0.4"
        )
        // decorative stars spin in
        .from(
          ".hero-star",
          { scale: 0, rotate: -120, opacity: 0, duration: 0.8, stagger: 0.12, ease: "back.out(2)" },
          0.2
        );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section-royal relative overflow-hidden">
      {/* decorative stars (reference has lime stars scattered) */}
      <span className="hero-star star pointer-events-none absolute right-[6%] top-24 h-14 w-14 text-lime sm:h-20 sm:w-20" aria-hidden="true" />
      <span className="hero-star star pointer-events-none absolute left-[40%] top-12 hidden h-8 w-8 text-lime lg:block" aria-hidden="true" />

      <div className="container-wide relative grid grid-cols-1 gap-x-6 gap-y-8 pt-6 sm:pt-12 lg:grid-cols-[clamp(190px,18vw,240px)_1fr_clamp(190px,18vw,260px)] lg:items-start lg:pt-12">
        {/* ── LEFT RAIL: AI logos + tagline + stats ─────────── */}
        <div className="hero-rail relative z-20 order-3 flex flex-row flex-wrap items-start gap-x-8 gap-y-6 sm:gap-x-10 lg:order-1 lg:flex-col lg:gap-10 lg:pt-8">
          {/* AI logo cluster + tagline — desktop only; on mobile the icons
              live at the top of the headshot instead. */}
          <div className="hidden lg:block">
            <div className="flex -space-x-2.5">
              {AI_LOGOS.map((l) => (
                <span
                  key={l.alt}
                  className="grid h-14 w-14 place-items-center rounded-full border-2 border-royal bg-white shadow-md"
                  title={l.alt}
                >
                  <Image src={l.src} alt={l.alt} width={30} height={30} className="h-7 w-7 object-contain" />
                </span>
              ))}
            </div>
            <p className="mt-4 max-w-[200px] text-sm font-bold uppercase leading-snug tracking-wide text-white/85">
              Build with the best AI tools — no code experience needed.
            </p>
          </div>

          {/* stat column */}
          <div className="flex flex-row gap-7 sm:gap-8 lg:flex-col lg:gap-7">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-5xl leading-none text-lime sm:text-7xl lg:text-8xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 sm:text-xs">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTER: giant headline + person cutout ──────────
            Mobile: this is order-1 and the headline+photo form a tight
            stacked unit so they fill the first screen together without a
            gap. The inner wrapper is sized by the photo; the headline is
            absolutely positioned RELATIVE TO THAT WRAPPER. */}
        <div className="relative order-1 flex min-w-0 items-end justify-center lg:order-2 lg:min-h-[clamp(540px,66vw,960px)]">
          <div className="relative flex w-full min-w-0 items-end justify-center">
            {/* Layer 1 — SOLID lime headline BEHIND the person (z-0).
                Headline is sized in vw so it spans nearly edge-to-edge on
                mobile (matching the reference framing); the rem cap keeps it
                controlled on large screens. */}
            <h1 className="headline pointer-events-none absolute inset-x-0 top-0 z-0 text-center text-lime">
              <span className="block overflow-hidden">
                <span className="hero-line block text-[22vw] lg:text-[clamp(8rem,18vw,21rem)]">Build</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block text-[22vw] lg:text-[clamp(8rem,18vw,21rem)]">Startup</span>
              </span>
            </h1>

            {/* real h1 for SEO/screen-readers (visually hidden) */}
            <span className="sr-only">Build Your First Startup With AI</span>

            {/* Layer 2 — person cutout (z-10), large, cropped at the waist.
                A small top padding on mobile drops the photo so the top of his
                head clears the headline (no hair poking into the letters). */}
            <div className="hero-photo relative z-10 flex w-full min-w-0 items-end justify-center pt-[14vw] lg:pt-0">
              <Image
                src="/hero/person.png"
                alt="Bootcamp host Abdullatif"
                width={764}
                height={1024}
                priority
                className="h-[min(74svh,620px)] w-auto max-w-full object-contain object-bottom drop-shadow-2xl sm:h-[min(72svh,760px)] lg:h-[clamp(540px,66vw,960px)] lg:max-w-none"
              />
            </div>

            {/* Layer 3 — OUTLINE-only headline ON TOP of the person (z-20). */}
            <div className="hero-outline pointer-events-none absolute inset-x-0 top-0 z-20 text-center" aria-hidden="true">
              <span className="headline block text-[22vw] lg:text-[clamp(8rem,18vw,21rem)] text-transparent [-webkit-text-stroke:2px_rgba(222,255,154,0.9)]">
                Build
              </span>
              <span className="headline block text-[22vw] lg:text-[clamp(8rem,18vw,21rem)] text-transparent [-webkit-text-stroke:2px_rgba(222,255,154,0.9)]">
                Startup
              </span>
            </div>
          </div>
        </div>

        {/* ── MOBILE MARQUEE: overlaps the bottom of the headshot ──
            On mobile the slider sits directly under the photo and is pulled
            up with a negative top margin so the headshot's bottom edge tucks
            UNDER the slider. The wrapper has the hero's royal background so the
            thin gap above the tilted band reads as blue (continuing the hero),
            not the cream of the next section. Full-bleed via container-busting
            negative side margins. z-30 keeps it above the photo. Hidden on
            desktop (the page-level marquee shows in its normal spot there). */}
        <div className="relative z-30 order-2 -mx-6 -mt-28 sm:-mx-10 sm:-mt-32 lg:hidden">
          <Marquee />
        </div>

        {/* ── RIGHT SIDE: body + CTAs ───────────────────────── */}
        <div className="hero-side relative z-20 order-4 flex w-full min-w-0 flex-col items-start gap-5 lg:order-3 lg:gap-6 lg:pt-20">
          <span className="star h-12 w-12 bg-lime" aria-hidden="true" />

          {session ? (
            <p className="font-display text-3xl text-lime">
              Welcome back, {session.name.split(" ")[0]} 👋
            </p>
          ) : (
            <p className="w-full max-w-[34ch] text-pretty break-words text-base font-medium leading-relaxed text-white/85">
              {EVENT.tagline}. {EVENT.dateLabel} · {EVENT.timeLabel}. {EVENT.locationLabel}.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            {isLive ? (
              <a href={EVENT.meetUrl} target="_blank" rel="noopener noreferrer" className="btn-lime !px-7 !py-4 !text-sm">
                Join Meet
                <span className="arrow-badge">→</span>
              </a>
            ) : (
              <a href={EVENT.formUrl} target="_blank" rel="noopener noreferrer" className="btn-lime !px-7 !py-4 !text-sm">
                Get Started
                <span className="arrow-badge">→</span>
              </a>
            )}
            {/* play / secondary action */}
            <Link
              href={isLive ? "/polls" : "/login"}
              aria-label={isLive ? "Live polls" : "Log in"}
              className="grid h-14 w-14 place-items-center rounded-full border-2 border-lime text-lg text-lime transition hover:bg-lime hover:text-royal"
            >
              ▶
            </Link>
          </div>

          {/* Countdown / live stats live INSIDE the hero (right column) */}
          <div className="hero-counter mt-6 w-full">
            {isLive ? (
              <LiveStats leaderboardVisible={!!state?.leaderboard_visible} />
            ) : (
              <>
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-white/70">
                  Doors open in
                </p>
                <Countdown targetISO={EVENT.startsAtISO} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Happening-now banner (live mode) */}
      {isLive && state?.banner && (
        <div className="container-wide relative z-20 mt-6 flex items-center gap-3 pb-8">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
          </span>
          <p className="text-sm font-bold text-white">
            <span className="text-lime">Happening now:</span> {state.banner}
          </p>
        </div>
      )}
    </section>
  );
}
