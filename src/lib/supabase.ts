import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** True when Supabase is configured. When false, live features degrade gracefully. */
export const supabaseEnabled = Boolean(url && anon);

let _client: SupabaseClient | null = null;

/** Returns the singleton Supabase client, or null if not configured. */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseEnabled) return null;
  if (!_client) {
    _client = createClient(url, anon, {
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }
  return _client;
}
