import { Database } from "@/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  let key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!key) {
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle the case where setAll is called from Server Component
            // that doesn't have access to cookies().set()
          }
        },
      },
    }
  );
}
