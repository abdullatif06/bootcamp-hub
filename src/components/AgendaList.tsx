import { AGENDA } from "@/lib/config";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function AgendaList({ compact = false }: { compact?: boolean }) {
  return (
    <RevealGroup className="relative space-y-3" stagger={0.08}>
      {AGENDA.map((item, i) => (
        <RevealItem key={i} direction="right">
          <div
            className={`relative flex gap-4 rounded-2xl border-2 p-4 transition hover:-translate-y-1 ${
              item.highlight
                ? "border-lime bg-lime/10 shadow-glow-sm"
                : "border-white/10 bg-navy-light/40 hover:border-lime/40"
            }`}
          >
            <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-navy/60 py-2">
              <span className="font-display text-lg font-black text-lime">{item.time}</span>
              <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">PM</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-black text-white">{item.title}</p>
              {!compact && item.desc && (
                <p className="mt-0.5 text-sm text-slate-400">{item.desc}</p>
              )}
            </div>
            {item.highlight && <span className="chip self-start">Main</span>}
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
