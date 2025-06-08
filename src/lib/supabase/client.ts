import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

// Keep a single instance of the browser Supabase client per browser tab.
// This avoids spawning multiple websocket connections and duplicate
// auth-state listeners when different components call `createClient()`.
let browserClient: SupabaseClient<Database> | null = null;

export function createClient(): SupabaseClient<Database> {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}
