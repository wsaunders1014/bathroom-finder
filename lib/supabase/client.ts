import { createBrowserClient } from "@supabase/ssr"

import type { Database } from "@/types/database";
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publicKey) {
    throw new Error("Missing Supabase client environment variables");
  }

  return createBrowserClient<Database>(url, publicKey);
}