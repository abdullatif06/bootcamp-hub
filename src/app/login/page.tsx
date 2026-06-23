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
        <div className="mb-4 flex items-center gap-3">
          <span className="star h-4 w-4 bg-royal" aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-[0.22em] text-royal">
            Attendee Login
          </span>
        </div>
        <h1 className="headline text-[clamp(2.25rem,9vw,3.25rem)] text-ink">
          Welcome to the <span className="text-royal">Bootcamp</span>
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          Enter the phone number you registered with. We&apos;ll pull up your name
          and your score automatically.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink/50">
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
              className="w-full rounded-xl border-2 border-ink/20 bg-cream px-4 py-3.5 text-lg font-semibold text-ink outline-none transition placeholder:text-ink/30 focus:border-royal"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border-2 border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-dark w-full justify-center text-base disabled:opacity-60">
            {loading ? "Checking…" : "Enter the event"}
            <span className="arrow-badge">→</span>
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/50">
          Not registered yet?{" "}
          <a href={EVENT.formUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-royal underline">
            Register here
          </a>
        </p>
      </div>

      <Link href="/" className="mt-6 text-center text-sm font-bold text-ink/50 transition hover:text-royal">
        ← Back to home
      </Link>
    </div>
  );
}
