import { Suspense } from "react";
import BathroomMapLoader from "@/components/map/BathroomMapLoader";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toBathroom } from "@/lib/bathrooms";
import { connection } from "next/server";
import TopBar from "@/components/layout/TopBar";
import { getIsSignedIn } from "@/lib/auth";
async function BathroomMapWithData() {
  
  const isSignedIn = await getIsSignedIn();
  const admin = createSupabaseAdminClient();


  

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
    <div className="grid h-dvh ">
      <TopBar></TopBar>
      <main className="w-full relative">
        <Suspense fallback={<p>Loading bathrooms…</p>}>
          <BathroomMapWithData />
        </Suspense>
      </main>
      {/* <footer className="flex place-content-center pt-4">
         <div className="text-center">All Rights Reserved. 2026 &copy;</div>
      </footer> */}
    </div>
  );
}

