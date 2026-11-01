"use client";
import { useEffect, useRef, useState } from "react";
import type { AccessPolicy, EntryMethod } from "@/types/bathroom";
import { entryIconUrls, entryLabels, policyClasses, policyLabels } from "./MapMarker";
import styles from "./MapMarker.module.css";
import { Button } from "../ui/button";

const policies = Object.keys(policyLabels) as AccessPolicy[];
const entryMethods = Object.keys(entryLabels) as EntryMethod[];

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function MapLegend() {
  // Hover shows the legend on desktop (CSS); this state handles taps, for touch screens.
  const [isOpen, setIsOpen] = useState(false);
  const legendRef = useRef<HTMLDivElement>(null);

  // A tapped-open legend stays open, so close it on a tap outside or Escape.
  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (!legendRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={legendRef} className="group">
      {/* pb-2 (not a margin) keeps the gap above the button hoverable,
          so the legend stays open while the mouse moves up into it. */}
      <div
        id="map-legend"
        className={`absolute bottom-full right-0 pb-2 group-hover:block ${isOpen ? "block" : "hidden"}`}
      >
        <div className="w-56 rounded-lg bg-white p-4 text-sm shadow-lg ring-1 ring-black/10">
          <h2 className="font-heading font-bold text-(--brand-primary-blue)">Who can use it</h2>
          <ul className="mt-2 space-y-1.5">
            {policies.map((policy) => (
              <li key={policy} className="flex items-center gap-2">
                <span aria-hidden="true" className={`size-4 shrink-0 rounded-full bg-(--policy-color) ${policyClasses[policy]}`} />
                {capitalize(policyLabels[policy])}
              </li>
            ))}
          </ul>

          <h2 className="mt-4 font-heading font-bold text-(--brand-primary-blue)">How to get in</h2>
          <ul className="mt-2 space-y-1.5">
            {entryMethods.map((entryMethod) => {
              const iconUrl = entryIconUrls[entryMethod];
              return (
                <li key={entryMethod} className="flex items-center gap-2">
                  <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center text-(--brand-primary-blue)">
                    {iconUrl ? (
                      <span
                        className={styles.icon}
                        style={{ "--icon-url": `url('${iconUrl}')` } as React.CSSProperties}
                      />
                    ) : (
                      <span className={styles.unknown}>?</span>
                    )}
                  </span>
                  {capitalize(entryLabels[entryMethod])}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <Button
       
        aria-expanded={isOpen}
        aria-controls="map-legend"
        onClick={() => setIsOpen((current) => !current)}
      >
        Legend
      </Button>
    </div>
  );
}
