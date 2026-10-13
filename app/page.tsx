import { Suspense } from "react";
import BathroomMapLoader from "@/components/BathroomMapLoader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toBathroom } from "@/lib/bathrooms";
async function BathroomMapWithData() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("bathrooms")
    .select(
    "id, name, address, latitude, longitude, venue_category, access_policy, entry_method, access_notes, updated_at",
  );

  if (error) {
    console.error("Supabase read failed:", error.message);
    throw new Error("Could not load bathrooms");
  }
  const bathrooms = data.map(toBathroom);
  console.log("Supabase connection successful:", data);

  return <BathroomMapLoader bathrooms={bathrooms} />;
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