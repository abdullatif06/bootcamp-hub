"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "./SessionProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/polls", label: "Live Polls" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/speakers", label: "Speakers" },
  { href: "/resources", label: "Resources" },
];

export function NavBar() {
  const pathname = usePathname();
  const { session, logout } = useSession();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-cream/90 backdrop-blur-xl">
      <nav className="container-wide flex items-center justify-between py-3">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-royal font-display text-2xl text-lime">
            B
          </span>
          <span className="font-display text-xl leading-none text-ink sm:text-2xl">
            Startup<span className="text-royal">/AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider transition ${
                isActive(l.href)
                  ? "bg-royal text-white"
                  : "text-ink/70 hover:bg-ink/10 hover:text-royal"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden items-center gap-2 md:flex">
          {session?.isAdmin && (
            <Link
              href="/host"
              className="rounded-full border-2 border-ink px-3 py-1.5 text-xs font-black uppercase tracking-wide text-ink hover:bg-ink hover:text-lime"
            >
              Host
            </Link>
          )}
          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/me"
                className="rounded-full bg-ink/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink hover:bg-ink/20"
              >
                {session.name.split(" ")[0]}
              </Link>
              <button
                onClick={logout}
                className="text-xs font-bold uppercase tracking-wide text-ink/50 hover:text-royal"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-dark !py-2.5 !text-xs">
              Log in
              <span className="arrow-badge !bg-lime !text-ink">→</span>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="grid h-10 w-10 place-items-center rounded-lg border-2 border-ink text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-ink transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t-2 border-ink bg-cream px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-extrabold uppercase tracking-wider transition ${
                  isActive(l.href) ? "bg-royal text-white" : "text-ink/80 hover:bg-ink/10"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {session?.isAdmin && (
              <Link
                href="/host"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-black uppercase tracking-wide text-royal hover:bg-ink/10"
              >
                Host Dashboard
              </Link>
            )}
            <div className="mt-2 border-t-2 border-ink/15 pt-3">
              {session ? (
                <div className="flex items-center justify-between">
                  <Link
                    href="/me"
                    onClick={() => setOpen(false)}
                    className="font-bold text-ink"
                  >
                    {session.name}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="text-sm font-bold text-ink/50"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-dark w-full justify-center"
                >
                  Log in
                  <span className="arrow-badge !bg-lime !text-ink">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
