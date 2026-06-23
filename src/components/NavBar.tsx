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
    <header className="sticky top-0 z-50 border-b-2 border-lime/30 bg-navy/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime font-display text-lg font-black text-navy shadow-glow-sm">
            B
          </span>
          <span className="hidden font-display text-lg font-black leading-none text-white sm:block">
            Startup<span className="text-lime">/AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-2 text-sm font-bold transition ${
                isActive(l.href)
                  ? "bg-lime text-navy"
                  : "text-slate-200 hover:bg-white/10 hover:text-lime"
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
              className="rounded-full border-2 border-lime px-3 py-1.5 text-xs font-black uppercase tracking-wide text-lime hover:bg-lime hover:text-navy"
            >
              Host
            </Link>
          )}
          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/me"
                className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/20"
              >
                {session.name.split(" ")[0]}
              </Link>
              <button
                onClick={logout}
                className="text-xs font-bold text-slate-400 hover:text-lime"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-lime !px-4 !py-2 text-sm">
              Log in
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="grid h-10 w-10 place-items-center rounded-lg border-2 border-lime/50 text-lime md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-lime transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-lime transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-lime transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t-2 border-lime/20 bg-navy px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-base font-bold transition ${
                  isActive(l.href) ? "bg-lime text-navy" : "text-slate-200 hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {session?.isAdmin && (
              <Link
                href="/host"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-black text-lime hover:bg-white/10"
              >
                Host Dashboard
              </Link>
            )}
            <div className="mt-2 border-t border-white/10 pt-3">
              {session ? (
                <div className="flex items-center justify-between">
                  <Link
                    href="/me"
                    onClick={() => setOpen(false)}
                    className="font-bold text-white"
                  >
                    {session.name}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="text-sm font-bold text-slate-400"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-lime w-full justify-center"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
