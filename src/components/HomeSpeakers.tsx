import Image from "next/image";
import Link from "next/link";
import { SPEAKERS, HOST, type Speaker } from "@/lib/config";
import { InstagramIcon, LinkedInIcon } from "./SocialIcon";

function SocialIcons({ socials }: { socials?: Speaker["socials"] }) {
  // Instagram + LinkedIn only. A speaker's real link (matched by keyword)
  // activates the button; otherwise it shows dimmed as a placeholder.
  const items = [
    { key: "instagram", label: "Instagram", Icon: InstagramIcon },
    { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
  ];
  return (
    <div className="mt-4 flex gap-2">
      {items.map(({ key, label, Icon }) => {
        const href = socials?.find((s) => s.label.toLowerCase().includes(key))?.url;
        const cls =
          "grid h-9 w-9 place-items-center rounded-lg border border-lime/30 text-slate-300 transition hover:border-lime hover:bg-lime hover:text-navy";
        return href ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
            <Icon className="h-4 w-4" />
          </a>
        ) : (
          <span key={key} aria-label={label} className={`${cls} opacity-40`}>
            <Icon className="h-4 w-4" />
          </span>
        );
      })}
    </div>
  );
}

function SpeakerCard({ s, badge }: { s: Speaker; badge?: string }) {
  return (
    <article className="card-brutal group flex gap-4 p-4 sm:gap-5 sm:p-5">
      {/* photo — left */}
      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-32">
        {s.photo ? (
          <Image
            src={s.photo}
            alt={s.name}
            fill
            className="object-cover object-top transition duration-500 group-hover:scale-105"
            sizes="128px"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-navy-light text-4xl">🧑‍💻</div>
        )}
      </div>

      {/* content — right */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-black leading-tight text-white sm:text-xl">
            {s.name}
          </h3>
          {badge && (
            <span className="shrink-0 rounded-full bg-lime/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-lime">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-bold text-lime sm:text-sm">{s.role}</p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">
          {s.bio}
        </p>
        <SocialIcons socials={s.socials} />
      </div>
    </article>
  );
}

export function HomeSpeakers() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-14">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 animate-float-slow rounded-full bg-lime/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 animate-float rounded-[40%] bg-lime-deep/10 blur-3xl" />

      {/* heading */}
      <div className="relative mb-10 text-center">
        <span className="chip mb-3">🎤 The Lineup</span>
        <h2 className="font-display text-4xl font-black leading-tight text-white sm:text-5xl">
          Meet our <span className="text-lime">talented speakers</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Founders, engineers, and AI leaders guiding you through your first build —
          each bringing real experience, creativity, and passion.
        </p>
      </div>

      {/* 2-column card grid */}
      <div className="relative grid gap-5 sm:grid-cols-2">
        <SpeakerCard s={HOST} badge="Host" />
        {SPEAKERS.map((s) => (
          <SpeakerCard key={s.name} s={s} />
        ))}

        {/* mystery 3rd speaker, same card shape */}
        <article className="group flex items-center gap-4 rounded-[1.25rem] border-2 border-dashed border-lime/40 p-4 transition hover:border-lime sm:gap-5 sm:p-5">
          <div className="grid h-28 w-24 shrink-0 place-items-center rounded-xl bg-navy-light/40 text-4xl sm:h-36 sm:w-32">
            👀
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-black text-white sm:text-xl">Speaker #3</h3>
            <p className="mt-1 text-xs font-bold text-lime sm:text-sm">To be announced</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              A third speaker is joining the lineup soon. Stay tuned for the reveal.
            </p>
          </div>
        </article>
      </div>

      {/* link to full speakers page */}
      <div className="relative mt-9 text-center">
        <Link href="/speakers" className="btn-outline">
          Full speaker details →
        </Link>
      </div>
    </section>
  );
}
