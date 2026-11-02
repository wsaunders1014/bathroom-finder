import Image from "next/image";

// The Suspense fallback while the bathrooms stream in (see BathroomMap). It renders inside
// Leaflet's container, so it needs z-[1000] to sit above the map's layers (z-index 400–700),
// and pointer-events-none so dragging over it still pans the map.
// Bottom center, so it doesn't collide with the add-mode status bar at the top.
export default function MarkersLoading() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-2 rounded-full bg-white py-2 pr-4 pl-3 text-sm font-semibold text-(--brand-primary-blue) shadow-md">
      <Image src="/icons/icon-pooey.svg" alt="" width={20} height={24} className="motion-safe:animate-bob" />
      <p role="status">Loading bathrooms…</p>
    </div>
  );
}
