"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const CARDS = [
  { href: "/polls", title: "Live Polls", desc: "Answer, earn points", emoji: "⚡" },
  { href: "/leaderboard", title: "Leaderboard", desc: "See who's winning", emoji: "🏆" },
  { href: "/speakers", title: "Speakers", desc: "Meet the lineup", emoji: "🎤" },
  { href: "/resources", title: "Resources", desc: "Slides & prompts", emoji: "📚" },
];

export function QuickCards() {
  return (
    <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-4" stagger={0.08}>
      {CARDS.map((c) => (
        <RevealItem key={c.href} direction="up">
          <motion.div
            whileHover={{ y: -6, rotate: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Link href={c.href} className="card-brutal group flex flex-col gap-2 p-5">
              <motion.span
                className="text-3xl"
                whileHover={{ scale: 1.25, rotate: 8 }}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
              >
                {c.emoji}
              </motion.span>
              <span className="font-display text-lg font-black text-white group-hover:text-lime">
                {c.title}
              </span>
              <span className="text-xs font-semibold text-slate-400">{c.desc}</span>
            </Link>
          </motion.div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
