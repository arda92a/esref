import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for privileged operations (e.g. creating admin users).
 * Server-only — never import this from a Client Component. Bypasses RLS.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY tanımlı değil. Supabase Dashboard > Project Settings > API üzerinden alıp .env.local dosyasına ekleyin."
    );
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
