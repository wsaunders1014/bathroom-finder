import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 
  if (!url || !publicKey) {
    throw new Error("Missing Supabase server environment variables");
  }
  const cookieStore = await cookies();
  return createServerClient<Database>(url, publicKey, {
    cookies: { 
      getAll(){
      return cookieStore.getAll();
    }, setAll(cookiesToSet){
      try {
        cookiesToSet.forEach(({name, value, options}) => {
            cookieStore.set(name, value, options)
        });
      }catch(e){
        //Leaving empty, as Proxy.ts. will refresh the cookie instead.
      }
    }}
  });
}