"use client";

import { useEventState } from "@/lib/useEventState";
import { useSession } from "@/components/SessionProvider";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { AgendaList } from "@/components/AgendaList";
import { QuickCards } from "@/components/QuickCards";
import { HomeSpeakers } from "@/components/HomeSpeakers";
import { Reveal } from "@/components/motion/Reveal";

export default function HomePage() {
  const state = useEventState();
  const { session } = useSession();

  return (
    <div className="overflow-hidden">
      {/* ── HERO (royal block, GSAP entrance) ──────────────── */}
      <Hero state={state} session={session} />

      {/* ── MARQUEE TICKER (lime band) ─────────────────────────
          On mobile the marquee is rendered INSIDE the hero (right under the
          headshot), so hide this page-level one there to avoid a duplicate.
          On desktop it's pulled up to straddle the hero→cream boundary so the
          tilted band hides the hero's hard bottom edge and bridges the two
          sections. The wrapper background is a hard split — royal on the top
          half (continuing the hero) and cream on the bottom half (continuing
          into the next section) — so the space ABOVE the tilted band reads as
          the hero blue, not cream. relative z-30 keeps it above both. */}
      <div className="relative z-30 -mt-10 hidden bg-gradient-to-b from-royal from-50% to-cream to-50% lg:-mt-16 lg:block 2xl:-mt-16">
        <Marquee />
      </div>

      {/* ── QUICK ACCESS / SERVICE GRID (cream) ────────────── */}
      <section className="section-cream dot-grid">
        <div className="container-wide py-16 sm:py-20">
          <Reveal>
            <QuickCards />
          </Reveal>
        </div>
      </section>

      {/* ── AGENDA (royal block) ───────────────────────────── */}
      <section className="section-royal relative overflow-hidden">
        <span className="star pointer-events-none absolute right-[5%] top-12 h-12 w-12 text-lime sm:h-16 sm:w-16" aria-hidden="true" />
        <div className="container-wide relative py-16 sm:py-20">
          <Reveal>
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="star h-4 w-4 bg-lime" aria-hidden="true" />
                <span className="text-xs font-black uppercase tracking-[0.22em] text-lime">
                  The Plan
                </span>
              </div>
              <h2 className="headline text-[clamp(2.5rem,7vw,5.5rem)] text-white">
                Today&apos;s <span className="text-lime">Agenda</span>
              </h2>
            </div>
          </Reveal>
          <AgendaList />
        </div>
      </section>

      {/* ── SPEAKERS (cream block) ─────────────────────────── */}
      <HomeSpeakers />
    </div>
  );
}
