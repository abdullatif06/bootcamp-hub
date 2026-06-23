import type { Metadata } from "next";
import { RESOURCES, type Resource } from "@/lib/config";

export const metadata: Metadata = {
  title: "Resources — Build Your First Startup With AI",
  description: "Slides, prompts, and prep material for the bootcamp.",
};

const TYPE_STYLE: Record<Resource["type"], { emoji: string; label: string }> = {
  Slides: { emoji: "🖥️", label: "Slides" },
  PDF: { emoji: "📄", label: "PDF" },
  Prompt: { emoji: "💬", label: "Prompts" },
  Link: { emoji: "🔗", label: "Link" },
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="mb-4 max-w-2xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="star h-4 w-4 bg-royal" aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-[0.22em] text-royal">
            Prep Material
          </span>
        </div>
        <h1 className="headline text-[clamp(2.75rem,8vw,6rem)] text-ink">
          <span className="text-royal">Resources</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink/60">
          Everything you need before and during the bootcamp — slide decks, an AI
          prompt library, and the exact tools we&apos;ll use. Available to all
          registered attendees ahead of July 2.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {RESOURCES.map((r) => {
          const meta = TYPE_STYLE[r.type];
          const Wrapper = r.url ? "a" : "div";
          return (
            <Wrapper
              key={r.title}
              {...(r.url
                ? { href: r.url, target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={`card-brutal flex items-start gap-4 p-5 ${
                r.url ? "" : "cursor-default opacity-90"
              }`}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream-soft text-2xl">
                {meta.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-royal px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                    {meta.label}
                  </span>
                  {!r.url && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-ink/40">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="mt-1.5 font-display text-xl leading-none text-ink">
                  {r.title}
                </p>
                <p className="mt-1 text-sm text-ink/60">{r.desc}</p>
              </div>
              {r.url && <span className="font-display text-2xl text-royal">→</span>}
            </Wrapper>
          );
        })}
      </div>

      <p className="mt-8 rounded-2xl border-2 border-ink/10 bg-white p-4 text-center text-sm text-ink/60">
        📌 More resources will be unlocked here as the bootcamp gets closer.
      </p>
    </div>
  );
}
