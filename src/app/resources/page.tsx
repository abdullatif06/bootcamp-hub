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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-4">
        <span className="chip mb-3">Prep Material</span>
        <h1 className="font-display text-5xl font-black text-white sm:text-6xl">
          <span className="text-lime">Resources</span>
        </h1>
        <p className="mt-3 max-w-xl text-slate-300">
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
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy/60 text-2xl">
                {meta.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="chip !border-lime/40 !px-2 !py-0.5 !text-[10px]">
                    {meta.label}
                  </span>
                  {!r.url && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="mt-1.5 font-display text-lg font-black text-white">
                  {r.title}
                </p>
                <p className="mt-0.5 text-sm text-slate-400">{r.desc}</p>
              </div>
              {r.url && <span className="text-lime">→</span>}
            </Wrapper>
          );
        })}
      </div>

      <p className="mt-8 rounded-2xl border border-white/10 bg-navy-light/30 p-4 text-center text-sm text-slate-400">
        📌 More resources will be unlocked here as the bootcamp gets closer.
      </p>
    </div>
  );
}
