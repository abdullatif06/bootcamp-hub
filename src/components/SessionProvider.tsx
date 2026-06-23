"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session } from "@/lib/types";

const STORAGE_KEY = "bootcamp.session.v1";

type Ctx = {
  session: Session | null;
  ready: boolean;
  login: (s: Session) => void;
  logout: () => void;
  setScore: (score: number) => void;
};

const SessionContext = createContext<Ctx>({
  session: null,
  ready: false,
  login: () => {},
  logout: () => {},
  setScore: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const login = useCallback((s: Session) => {
    setSession(s);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setScore = useCallback((_score: number) => {
    // Score lives in the DB; session keeps profile only. No-op placeholder
    // kept for API symmetry / future use.
  }, []);

  return (
    <SessionContext.Provider value={{ session, ready, login, logout, setScore }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
