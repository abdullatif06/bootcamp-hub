"use client";

/**
 * Lime ticker band — the reference's "BRANDING + GRAPHIC DESIGN + ..." strip.
 * Heavy condensed caps separated by bold star glyphs. Pure-CSS infinite scroll
 * (GPU-safe transform). Respects prefers-reduced-motion via the global reset.
 */

const ITEMS = ["AI Startup", "Build in 2 Hours", "July 2", "Vibe Coding"];

function Track() {
  return (
    <div className="marquee-track animate-marquee">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display whitespace-nowrap px-7 text-5xl text-ink sm:text-7xl">
            {item}
          </span>
          <span className="star h-7 w-7 bg-ink sm:h-9 sm:w-9" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    // Slightly rotated band. The outer wrapper clips only the X axis
    // (overflow-x-clip) so the band can't cause horizontal page scroll, while
    // the tilted top/bottom corners remain fully visible (no Y clipping). The
    // band is scaled wider than the viewport so its rotated ends always cover
    // the full width. Generous vertical padding gives the tilt room to show.
    <div className="relative my-2 overflow-x-clip overflow-y-visible py-8 sm:py-10">
      <div className="section-lime relative -rotate-2 scale-x-110 border-y-[3px] border-ink py-4 sm:py-6">
        <div className="marquee-mask flex" aria-hidden="true">
          {/* two identical tracks for a seamless -50% loop */}
          <Track />
          <Track />
        </div>
      </div>
    </div>
  );
}
