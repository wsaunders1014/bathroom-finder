import Image from "next/image";
import styles from "./MapSkeleton.module.css";

// Shown while the bathrooms load (page.tsx) and then while the map's code downloads
// (BathroomMapLoader), so both waits look like one loading screen. No hooks, so it
// works in both the server page and the client loader.
export default function MapSkeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-(--map-bg)">
      {/* A tiny (96px, ~2.5KB) screenshot of the map's default starting area, stretched and
          blurred, so the real map seems to come into focus where it first appears.
          unoptimized: it's already tiny, so serve the file as is.
          scale-110 pushes the blur's faded edges off screen. */}
      <Image
        src="/images/map-placeholder.jpg"
        alt=""
        fill
        unoptimized
        preload
        className="scale-110 object-cover blur-md"
      />

      <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <Image
          src="/icons/icon-pooey.svg"
          alt=""
          width={64}
          height={76}
          className="motion-safe:animate-bob"
        />
        <p className="font-heading text-lg font-bold text-(--brand-primary-blue)">
          Finding bathrooms near you…
        </p>
      </div>

      {/* Faded stand-ins for the map controls, in the same spots as the real ones
          (see SidePanel), so nothing jumps when the map arrives. */}
      <div aria-hidden="true" className="absolute top-0 right-0 bottom-0 mr-3 flex flex-col items-end justify-between py-6">
        <span className={styles.control} />
        <div className="flex flex-col items-end gap-2">
          <span className={styles.control} />
          <span className={styles.control} />
          <span className={styles.control} />
        </div>
      </div>
    </div>
  );
}
