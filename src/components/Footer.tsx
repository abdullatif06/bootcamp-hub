import Link from "next/link";
import Image from "next/image";
import { EVENT, SPONSORS } from "@/lib/config";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t-2 border-lime/30 bg-navy/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Sponsors */}
        <div className="mb-10 text-center">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Powered by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {SPONSORS.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <Image src={s.logo} alt={s.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="text-left">
                  <p className="font-display text-base font-black text-white">{s.name}</p>
                  <p className="text-xs font-semibold text-lime">{s.handle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-black text-white">
              {EVENT.name}
            </p>
            <p className="mt-1 text-sm text-slate-400">{EVENT.tagline}</p>
          </div>
          <div className="text-sm text-slate-300">
            <p className="font-bold text-lime">When & Where</p>
            <p className="mt-1">{EVENT.dateLabel}</p>
            <p>{EVENT.timeLabel}</p>
            <p>{EVENT.locationLabel}</p>
            <p className="mt-1 font-semibold text-white">Entry: {EVENT.priceLabel}</p>
          </div>
          <div className="text-sm">
            <p className="font-bold text-lime">Quick links</p>
            <div className="mt-1 flex flex-col gap-1">
              <Link href="/speakers" className="text-slate-300 hover:text-lime">Speakers</Link>
              <Link href="/resources" className="text-slate-300 hover:text-lime">Resources</Link>
              <a href={EVENT.formUrl} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-lime">
                Register
              </a>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {EVENT.name}. Built with AI, in Jordan.
        </p>
      </div>
    </footer>
  );
}
