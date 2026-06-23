import Link from "next/link";

const CARDS = [
  { href: "/polls", title: "Live Polls", desc: "Answer, earn points", emoji: "⚡", },
  { href: "/leaderboard", title: "Leaderboard", desc: "See who's winning", emoji: "🏆" },
  { href: "/speakers", title: "Speakers", desc: "Meet the lineup", emoji: "🎤" },
  { href: "/resources", title: "Resources", desc: "Slides & prompts", emoji: "📚" },
];

export function QuickCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CARDS.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="card-brutal group flex flex-col gap-2 p-5"
        >
          <span className="text-3xl">{c.emoji}</span>
          <span className="font-display text-lg font-black text-white group-hover:text-lime">
            {c.title}
          </span>
          <span className="text-xs font-semibold text-slate-400">{c.desc}</span>
        </Link>
      ))}
    </div>
  );
}
