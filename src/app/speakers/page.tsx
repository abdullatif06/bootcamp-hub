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
          "grid h-9 w-9 place-items-center rounded-lg border border-ink/20 text-ink/70 transition hover:border-ink hover:bg-ink hover:text-lime";
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

// Image-forward card — agency style (photo on top), but with full
// (un-clamped) bios since this is the dedicated detail page.
function SpeakerCard({ s, badge }: { s: Speaker; badge?: string }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border-2 border-ink/10 bg-white"
    >
      {/* photo — top */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-soft">
        {s.photo ? (
          <Image
            src={s.photo}
            alt={s.name}
            fill
            className="object-cover object-top transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-5xl">🧑‍💻</div>
        )}
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1 text-[10px] font-black uppercase tracking-wide text-ink">
            {badge}
          </span>
        )}
      </div>

      {/* content — below */}
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <h3 className="font-display text-2xl leading-none text-ink sm:text-3xl">
          {s.name}
        </h3>
        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-royal">{s.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">{s.bio}</p>
        <SocialIcons socials={s.socials} />
      </div>
    </motion.article>
  );
}

export default function SpeakersPage() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
      {/* decorative stars */}
      <span className="star pointer-events-none absolute right-[5%] top-10 h-12 w-12 text-royal opacity-80 sm:h-16 sm:w-16" aria-hidden="true" />
      <span className="star pointer-events-none absolute bottom-10 left-[3%] h-8 w-8 text-ink opacity-50" aria-hidden="true" />

      {/* heading — agency offset layout */}
      <Reveal className="relative mb-12 max-w-2xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="star h-4 w-4 bg-royal" aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-[0.22em] text-royal">
            The Lineup
          </span>
        </div>
        <h1 className="headline text-[clamp(2.75rem,8vw,6rem)] text-ink">
          Meet the <span className="text-royal">speakers</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink/60">
          Founders, engineers, and AI leaders guiding you through your first build —
          each bringing real experience, creativity, and passion.
        </p>
      </Reveal>

      {/* card grid */}
      <RevealGroup className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
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
          <article className="group flex h-full flex-col overflow-hidden rounded-lg border-2 border-dashed border-ink/30 transition hover:border-ink">
            <div className="grid aspect-[4/5] w-full place-items-center bg-cream-soft text-6xl">
              👀
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-2xl leading-none text-ink sm:text-3xl">Speaker #3</h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-royal">To be announced</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/50">
                A third speaker is joining the lineup soon. Stay tuned for the reveal.
              </p>
            </div>
          </article>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
