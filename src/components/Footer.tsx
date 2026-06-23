import Link from "next/link";
import Image from "next/image";
import { EVENT, SPONSORS } from "@/lib/config";

export function Footer() {
  return (
    <footer className="relative mt-0">
      {/* ── Big CTA block (royal) ─────────────────────────── */}
      <div className="section-royal relative overflow-hidden">
        <span className="star pointer-events-none absolute right-[8%] top-10 h-12 w-12 text-lime sm:h-16 sm:w-16" aria-hidden="true" />
        <div className="container-wide py-16 text-center sm:py-20">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="star h-4 w-4 bg-lime" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-[0.22em] text-lime">
              Let&apos;s build
            </span>
          </div>
          <h2 className="headline mx-auto max-w-4xl text-[clamp(2.5rem,9vw,7rem)] text-white">
            Ready to ship your <span className="text-lime">first startup?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-white/80">
            {EVENT.priceLabel} at the door. Spots are limited — grab yours before {EVENT.dateLabel}.
          </p>
          <a
            href={EVENT.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lime mt-8 !text-sm"
          >
            Register now
            <span className="arrow-badge">→</span>
          </a>
        </div>
      </div>

      {/* ── Footer info (cream) ───────────────────────────── */}
      <div className="section-cream border-t-2 border-ink">
        <div className="container-wide py-14">
          {/* Sponsors */}
          <div className="mb-12 text-center">
            <p className="mb-5 text-[11px] font-black uppercase tracking-[0.22em] text-ink/50">
              Powered by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {SPONSORS.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-ink bg-white">
                    <Image src={s.logo} alt={s.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="text-left">
                    <p className="font-display text-xl leading-none text-ink">{s.name}</p>
                    <p className="text-xs font-semibold text-royal">{s.handle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 border-t-2 border-ink/15 pt-10 md:grid-cols-3">
            <div>
              <p className="font-display text-3xl leading-none text-ink">{EVENT.name}</p>
              <p className="mt-2 text-sm text-ink/60">{EVENT.tagline}</p>
            </div>
            <div className="text-sm text-ink/70">
              <p className="text-xs font-black uppercase tracking-wider text-royal">When &amp; Where</p>
              <p className="mt-2">{EVENT.dateLabel}</p>
              <p>{EVENT.timeLabel}</p>
              <p>{EVENT.locationLabel}</p>
              <p className="mt-1 font-semibold text-ink">Entry: {EVENT.priceLabel}</p>
            </div>
            <div className="text-sm">
              <p className="text-xs font-black uppercase tracking-wider text-royal">Quick links</p>
              <div className="mt-2 flex flex-col gap-1.5">
                <Link href="/speakers" className="text-ink/70 hover:text-royal">Speakers</Link>
                <Link href="/resources" className="text-ink/70 hover:text-royal">Resources</Link>
                <a href={EVENT.formUrl} target="_blank" rel="noopener noreferrer" className="text-ink/70 hover:text-royal">
                  Register
                </a>
              </div>
            </div>
          </div>

          <p className="mt-12 text-center text-xs text-ink/40">
            © {new Date().getFullYear()} {EVENT.name}. Built with AI, in Jordan.
          </p>
        </div>
      </div>
    </footer>
  );
}
