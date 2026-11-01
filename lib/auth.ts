import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { createSupabaseServerClient } from "./supabase/server";

export const getIsSignedIn = cache(async ()=>{
    await connection();
    const client = await createSupabaseServerClient();
    const { data } = await client.auth.getClaims();
    return Boolean(data?.claims);
})