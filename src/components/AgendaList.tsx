import { AGENDA } from "@/lib/config";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function AgendaList({ compact = false }: { compact?: boolean }) {
  return (
    <RevealGroup className="relative divide-y divide-white/10 border-y border-white/10" stagger={0.07}>
      {AGENDA.map((item, i) => (
        <RevealItem key={i} direction="right">
          <div
            className={`group relative flex items-center gap-4 px-2 py-5 transition sm:gap-6 sm:px-4 ${
              item.highlight ? "bg-lime/10" : "hover:bg-white/[0.03]"
            }`}
          >
            {/* index number */}
            <span
              className={`font-display text-4xl leading-none sm:text-5xl ${
                item.highlight ? "text-lime" : "text-white/20 group-hover:text-lime"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* time pill */}
            <div className="flex w-16 shrink-0 flex-col items-center sm:w-20">
              <span className="font-display text-2xl leading-none text-lime sm:text-3xl">
                {item.time}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">PM</span>
            </div>

            {/* content */}
            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl leading-none text-white sm:text-3xl">
                {item.title}
              </p>
              {!compact && item.desc && (
                <p className="mt-1.5 text-sm text-slate-400">{item.desc}</p>
              )}
            </div>

            {item.highlight && (
              <span className="hidden shrink-0 self-center rounded-full bg-lime px-3 py-1 text-[10px] font-black uppercase tracking-wide text-ink sm:inline-block">
                Main
              </span>
            )}
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
