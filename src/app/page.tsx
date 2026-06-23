"use client";

import { EVENT } from "@/lib/config";
import { useEventState } from "@/lib/useEventState";
import { useSession } from "@/components/SessionProvider";
import { Hero } from "@/components/Hero";
import { AgendaList } from "@/components/AgendaList";
import { QuickCards } from "@/components/QuickCards";
import { HomeSpeakers } from "@/components/HomeSpeakers";
import { Reveal } from "@/components/motion/Reveal";

export default function HomePage() {
  const state = useEventState();
  const { session } = useSession();
  const isLive = state?.mode === "live";

  return (
    <div className="overflow-hidden">
      {/* ── HERO (GSAP entrance) ───────────────────────────── */}
      <Hero state={state} session={session} />

      {/* ── QUICK ACCESS CARDS ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Reveal>
          <QuickCards />
        </Reveal>
      </section>

      {/* ── AGENDA SNAPSHOT ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="chip mb-2">The Plan</span>
              <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
                Today&apos;s <span className="text-lime">Agenda</span>
              </h2>
            </div>
          </div>
        </Reveal>
        <AgendaList />
      </section>

      {/* ── SPEAKERS ───────────────────────────────────────── */}
      <HomeSpeakers />

      {/* ── REGISTER STRIP (pre mode) ──────────────────────── */}
      {!isLive && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <Reveal direction="scale">
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
          </Reveal>
        </section>
      )}
    </div>
  );
}
