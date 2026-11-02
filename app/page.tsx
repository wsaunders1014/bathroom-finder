import { Suspense } from "react";
import BathroomMapLoader from "@/components/map/BathroomMapLoader";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toBathroom } from "@/lib/bathrooms";

import Brand from "@/components/layout/Brand";
import MapSkeleton from "@/components/map/MapSkeleton";
import { getIsSignedIn } from "@/lib/auth";
async function getBathroomsFromDB() {
  const client = await createSupabaseServerClient();
  const { data, error } = await client
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
  return bathrooms;
}
async function BathroomMapWithData() {

  const isSignedIn = await getIsSignedIn();
  const bathroomsPromise = getBathroomsFromDB();

  return <BathroomMapLoader bathroomsPromise={bathroomsPromise} isSignedIn={isSignedIn} />;
}
export default async function Home() {

  return (
    <div className="grid h-dvh ">
      <main className="w-full relative">
        <Brand />
        <Suspense fallback={<MapSkeleton />}>
          <BathroomMapWithData />
        </Suspense>
      </main>
      {/* <footer className="flex place-content-center pt-4">
         <div className="text-center">All Rights Reserved. 2026 &copy;</div>
      </footer> */}
    </div>
  );
}

