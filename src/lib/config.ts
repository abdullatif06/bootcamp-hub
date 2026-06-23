// Central event config. Most values are also overridable via env vars.

export const EVENT = {
  name: "Build Your First Startup With AI",
  tagline: "Vibe Coding Bootcamp",
  // July 2, 2026, 5:00 PM Amman time (UTC+3) → 14:00 UTC
  startsAtISO: "2026-07-02T17:00:00+03:00",
  endsAtISO: "2026-07-02T19:00:00+03:00",
  dateLabel: "July 2, 2026",
  timeLabel: "5:00 – 7:00 PM",
  locationLabel: "Online · Google Meet",
  priceLabel: "3 JOD",
  meetUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MEET_URL || "https://meet.google.com/dkw-qmct-qui",
  formUrl:
    process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ||
    "https://docs.google.com/forms/d/e/1FAIpQLSf2wdizy1jwxNhfeHfkK9ifMZW4O2OO7LpoinSSoY0DODbWSQ/viewform",
};

export const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_PHONE || "0782173172";

export const REGISTRATION_CSV_URL =
  process.env.NEXT_PUBLIC_REGISTRATION_CSV_URL || "";

export type AgendaItem = {
  time: string;
  title: string;
  desc?: string;
  highlight?: boolean;
};

export const AGENDA: AgendaItem[] = [
  { time: "5:00", title: "Welcome & Intro", desc: "Kick-off and what to expect." },
  {
    time: "5:15",
    title: "Speakers Session",
    desc: "Meet the founders and AI leaders behind the bootcamp.",
  },
  { time: "5:30", title: "Break", desc: "Grab a coffee — back in 10." },
  {
    time: "5:40",
    title: "Prompt Engineering Session",
    desc: "Learn to talk to AI so it builds what you actually want.",
  },
  {
    time: "6:00",
    title: "Building",
    desc: "Hands-on: ship your first startup with AI.",
    highlight: true,
  },
  {
    time: "6:40",
    title: "Wrap Up + Prizes + What's Next",
    desc: "Top leaderboard scorers win. Where to go from here.",
  },
];

export type Speaker = {
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  isHost?: boolean;
  socials?: { label: string; url: string }[];
};

export const SPEAKERS: Speaker[] = [
  {
    name: "Osama Al-Said",
    role: "6th-year Medical Student & Co-Founder of CuraCode",
    bio: "CuraCode is a student-led initiative dedicated to providing hands-on research training. We empower aspiring researchers through a comprehensive digital ecosystem, featuring an advanced, all-in-one web platform equipped with essential research tools.",
    photo: "/speakers/osama.jpg",
    socials: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/osama-al-said-535681222/" },
      { label: "Instagram", url: "https://www.instagram.com/osamasaid03/" },
    ],
  },
  {
    name: "Eng. Zeyad Alsarahne",
    role: "Chief AI Transformation Officer, FastSource Solution",
    bio: "A digital transformation and AI leader with over 10 years of experience in business development, digital marketing, and technology. As Chief AI Transformation Officer at FastSource Solution, he helps organizations leverage AI to drive growth, efficiency, and innovation. With a background in Computer Software Engineering, Zeyad turns emerging technologies into practical, high-impact solutions.",
    photo: "/speakers/zeyad.jpg",
    socials: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/zeyadalsarahneh/" },
      { label: "Instagram", url: "https://www.instagram.com/zeyad_alsarahneh/" },
    ],
  },
  // 3rd speaker intentionally omitted until details are provided.
];

export const HOST: Speaker = {
  name: "Abdullatif Qaisieh",
  role: "Frontend Developer & AI Engineer",
  bio: "My goal is to completely shatter the technical barrier to entry. If you can text, you can build.",
  photo: "/speakers/abdullatif.jpg",
  isHost: true,
  socials: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/abdullatif-qaisieh-63b3b531b/" },
    { label: "Instagram", url: "https://www.instagram.com/abdullatiff.dev/" },
  ],
};

export const SPONSORS = [
  { name: "CuraCode", handle: "@cura.code", logo: "/sponsors/curacode.jpeg" },
  { name: "FastSource", handle: "@fast.source", logo: "/sponsors/fastsource.jpg" },
];

// Prep resources — placeholders until real links/files are provided.
export type Resource = {
  title: string;
  desc: string;
  type: "Slides" | "PDF" | "Prompt" | "Link";
  url?: string;
};

export const RESOURCES: Resource[] = [
  {
    title: "Bootcamp Slide Deck",
    desc: "The full presentation — added before the session.",
    type: "Slides",
  },
  {
    title: "AI Prompt Library",
    desc: "Copy-paste prompts to build faster with AI.",
    type: "Prompt",
  },
  {
    title: "Setup Checklist",
    desc: "What to install and sign up for before July 2.",
    type: "PDF",
  },
  {
    title: "Recommended AI Tools",
    desc: "The exact tools we'll use during the build.",
    type: "Link",
  },
];
