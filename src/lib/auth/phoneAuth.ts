import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcrypt";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

/**
 * Normalize a phone number to E.164 format.
 * If no country code is provided, assume US (+1).
 */
export function normalizePhoneNumber(phone: string): string {
  let normalized = phone.trim().replace(/[^+\d]/g, "");
  if (!normalized.startsWith("+")) {
    normalized = "+1" + normalized;
  }
  return normalized;
}

/**
 * Find a phone profile record that matches the hashed phone number.
 * Returns the matching profile record or null.
 */
export async function findPhoneProfile(
  supabase: SupabaseClient<Database>,
  normalizedPhone: string
) {
  const { data: profiles, error } = await supabase.from("phones").select("*");

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!profiles) return null;

  for (const profile of profiles) {
    const isMatch = await bcrypt.compare(normalizedPhone, profile.phone_hash);
    if (isMatch) {
      return profile;
    }
  }

  return null;
}

/**
 * Convenience wrapper for getting a Supabase client in server-side code.
 */
export async function getSupabaseClient() {
  return await createClient();
}
