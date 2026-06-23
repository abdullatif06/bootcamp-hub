"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "./supabase";
import { fetchEventState } from "./api";
import type { EventState } from "./types";

/** Subscribes to event_state and returns the live value. */
export function useEventState() {
  const [state, setState] = useState<EventState | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchEventState().then((s) => mounted && setState(s));

    const sb = getSupabase();
    if (!sb) return;

    const channel = sb
      .channel("event_state_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_state" },
        (payload) => {
          if (mounted && payload.new) setState(payload.new as EventState);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      sb.removeChannel(channel);
    };
  }, []);

  return state;
}
