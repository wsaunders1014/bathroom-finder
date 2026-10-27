import { Suspense } from "react";
import BathroomMapLoader from "@/components/BathroomMapLoader";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toBathroom } from "@/lib/bathrooms";
import { connection } from "next/server";
async function BathroomMapWithData() {
  await connection();
  const authClient = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();
  const { data: authData } = await authClient.auth.getClaims()

  const isSignedIn = Boolean(authData?.claims);
  console.log("isSignedIn:", isSignedIn);
  const { data, error } = await admin
    .from("bathrooms")
    .select(`
  *,
  bathroom_access_codes (
    id,
    code,
    created_at
  )
`);
  
  if (error) {
    console.error("Supabase read failed:", error.message);
    throw new Error("Could not load bathrooms");
  }
  const bathrooms = data.map(toBathroom);

  return <BathroomMapLoader bathrooms={bathrooms} isSignedIn={isSignedIn} />;
}
export default async function Home() {
 
  return (
    <main className="h-dvh w-full relative">
     <Suspense fallback={<p>Loading bathrooms…</p>}>
        <BathroomMapWithData />
      </Suspense>
    </main>
  );
}