"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/components/SessionProvider";
import { EVENT } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      login({
        attendeeId: data.attendeeId,
        phone: data.phone,
        name: data.name,
        email: data.email,
        university: data.university,
        gender: data.gender,
        isAdmin: data.isAdmin,
      });
      router.push(data.isAdmin ? "/host" : "/me");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="card-brutal p-7">
        <span className="chip mb-4">Attendee Login</span>
        <h1 className="font-display text-3xl font-black leading-tight text-white">
          Welcome to the <span className="text-lime">Bootcamp</span>
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Enter the phone number you registered with. We&apos;ll pull up your name
          and your score automatically.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="07XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border-2 border-lime/40 bg-navy px-4 py-3.5 text-lg font-semibold text-white outline-none transition focus:border-lime focus:shadow-glow-sm"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border-2 border-red-400/50 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-lime w-full justify-center text-base disabled:opacity-60">
            {loading ? "Checking…" : "Enter the event →"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Not registered yet?{" "}
          <a href={EVENT.formUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-lime underline">
            Register here
          </a>
        </p>
      </div>

      <Link href="/" className="mt-6 text-center text-sm font-semibold text-slate-400 hover:text-lime">
        ← Back to home
      </Link>
    </div>
  );
}
