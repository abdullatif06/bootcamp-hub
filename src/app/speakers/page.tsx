"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SPEAKERS, HOST, type Speaker } from "@/lib/config";
import { InstagramIcon, LinkedInIcon } from "@/components/SocialIcon";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

function SocialIcons({ socials }: { socials?: Speaker["socials"] }) {
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

// Horizontal card — same layout as the landing page, but full (un-clamped)
// bios since this is the dedicated detail page.
function SpeakerCard({ s, badge }: { s: Speaker; badge?: string }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="card-brutal group flex h-full gap-4 p-4 sm:gap-5 sm:p-5"
    >
      {/* photo — left */}
      <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-xl sm:h-40 sm:w-36">
        {s.photo ? (
          <Image
            src={s.photo}
            alt={s.name}
            fill
            className="object-cover object-top transition duration-500 group-hover:scale-105"
            sizes="144px"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-navy-light text-4xl">🧑‍💻</div>
        )}
      </div>

      {/* content — right */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl font-black leading-tight text-white sm:text-2xl">
            {s.name}
          </h3>
          {badge && (
            <span className="shrink-0 rounded-full bg-lime/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-lime">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-bold text-lime sm:text-sm">{s.role}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.bio}</p>
        <SocialIcons socials={s.socials} />
      </div>
    </motion.article>
  );
}

export default function SpeakersPage() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 animate-float-slow rounded-full bg-lime/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 animate-float rounded-[40%] bg-lime-deep/10 blur-3xl" />

      {/* heading */}
      <Reveal className="relative mb-10 text-center">
        <span className="chip mb-3">🎤 The Lineup</span>
        <h1 className="font-display text-4xl font-black leading-tight text-white sm:text-6xl">
          Meet the <span className="text-stroke">Speakers</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Founders, engineers, and AI leaders guiding you through your first build —
          each bringing real experience, creativity, and passion.
        </p>
      </Reveal>

      {/* 2-column card grid */}
      <RevealGroup className="relative grid gap-5 sm:grid-cols-2" stagger={0.12}>
        <RevealItem>
          <SpeakerCard s={HOST} badge="Host" />
        </RevealItem>
        {SPEAKERS.map((s) => (
          <RevealItem key={s.name}>
            <SpeakerCard s={s} />
          </RevealItem>
        ))}

        {/* mystery 3rd speaker, same card shape */}
        <RevealItem>
          <article className="group flex h-full items-center gap-4 rounded-[1.25rem] border-2 border-dashed border-lime/40 p-4 transition hover:border-lime sm:gap-5 sm:p-5">
            <div className="grid h-32 w-28 shrink-0 place-items-center rounded-xl bg-navy-light/40 text-4xl sm:h-40 sm:w-36">
              👀
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xl font-black text-white sm:text-2xl">Speaker #3</h3>
              <p className="mt-1 text-xs font-bold text-lime sm:text-sm">To be announced</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                A third speaker is joining the lineup soon. Stay tuned for the reveal.
              </p>
            </div>
          </article>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
