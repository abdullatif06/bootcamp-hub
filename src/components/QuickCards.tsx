"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

// Agency "service" blocks — each card gets a distinct flat color tone like
// the reference's bento grid (dark / blue / lime alternating).
const CARDS = [
  {
    href: "/polls",
    title: "Live Polls",
    desc: "Answer live questions and earn points during the session.",
    tone: "white" as const,
    no: "01",
  },
  {
    href: "/leaderboard",
    title: "Leaderboard",
    desc: "Track your rank in real time and race to the top.",
    tone: "royal" as const,
    no: "02",
  },
  {
    href: "/speakers",
    title: "Speakers",
    desc: "Founders, engineers and AI leaders guiding the build.",
    tone: "lime" as const,
    no: "03",
  },
  {
    href: "/resources",
    title: "Resources",
    desc: "Slide decks, prompt libraries and setup checklists.",
    tone: "white" as const,
    no: "04",
  },
];

const TONES = {
  white: {
    card: "bg-white border-2 border-ink hover:shadow-[8px_8px_0_#0b0e14]",
    no: "text-ink/15",
    title: "text-ink group-hover:text-royal",
    desc: "text-ink/60",
    badge: "bg-ink text-lime",
  },
  royal: {
    card: "bg-royal border-2 border-ink hover:shadow-[8px_8px_0_#0b0e14]",
    no: "text-white/25",
    title: "text-white",
    desc: "text-white/80",
    badge: "bg-lime text-ink",
  },
  lime: {
    card: "bg-lime border-2 border-ink hover:shadow-[8px_8px_0_#0b0e14]",
    no: "text-ink/20",
    title: "text-ink",
    desc: "text-ink/70",
    badge: "bg-ink text-lime",
  },
};

export function QuickCards() {
  return (
    <div>
      {/* eyebrow + section heading */}
      <div className="mb-3 flex items-center gap-3">
        <span className="star h-4 w-4 bg-royal" aria-hidden="true" />
        <span className="text-xs font-black uppercase tracking-[0.22em] text-royal">
          What you get
        </span>
      </div>
      <h2 className="headline mb-9 text-[clamp(2.5rem,7vw,5.5rem)] text-ink">
        Everything in <span className="text-royal">one hub</span>
      </h2>

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
        {CARDS.map((c) => {
          const t = TONES[c.tone];
          return (
            <RevealItem key={c.href} direction="up">
              <motion.div
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="h-full"
              >
                <Link
                  href={c.href}
                  className={`group flex h-full flex-col rounded-lg p-6 transition ${t.card}`}
                >
                  <div className="mb-6 flex items-start justify-between">
                    <span className={`font-display text-5xl leading-none ${t.no}`}>{c.no}</span>
                    <span className={`grid h-9 w-9 place-items-center rounded-full ${t.badge}`}>
                      →
                    </span>
                  </div>
                  <span className={`font-display text-3xl leading-none ${t.title}`}>
                    {c.title}
                  </span>
                  <span className={`mt-2 text-sm leading-relaxed ${t.desc}`}>{c.desc}</span>
                </Link>
              </motion.div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}
