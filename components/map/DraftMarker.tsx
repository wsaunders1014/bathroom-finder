import { useEffect, useRef } from "react";
import { Marker, useMap } from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import type { AccessPolicy, EntryMethod } from "@/types/bathroom";
import { getMarkerIcon } from "./MapMarker";

type DraftMarkerProps = {
    position: [number, number];
    accessPolicy: AccessPolicy;
    entryMethod: EntryMethod;
    onMove: (location: [number, number]) => void;
}

// Screen pixels moved per arrow key press, and with Shift held.
const NUDGE = 5;
const BIG_NUDGE = 20;

// Previews the bathroom being added. It updates as the form's access policy and entry method change,
// and can be dragged, or focused and nudged with the arrow keys, to fine-tune the location.
export default function DraftMarker({ position, accessPolicy, entryMethod, onMove }: DraftMarkerProps) {
    const map = useMap();
    const markerRef = useRef<LeafletMarker>(null);

    // Leaflet markers only report clicks and Enter, so listen for arrow keys on the marker's element directly.
    // accessPolicy and entryMethod are dependencies because changing them swaps in a new icon element.
    useEffect(() => {
        const element = markerRef.current?.getElement();
        if (!element) return;
        function handleKeyDown(event: KeyboardEvent) {
            const step = event.shiftKey ? BIG_NUDGE : NUDGE;
            const offsets: Record<string, [number, number]> = {
                ArrowUp: [0, -step],
                ArrowDown: [0, step],
                ArrowLeft: [-step, 0],
                ArrowRight: [step, 0],
            };
            const offset = offsets[event.key];
            if (!offset) return;
            // Stop the page or map from scrolling with the same key.
            event.preventDefault();
            event.stopPropagation();
            // Move in screen pixels, so a press feels the same at every zoom level.
            const moved = map.latLngToContainerPoint(position).add(offset);
            const { lat, lng } = map.containerPointToLatLng(moved);
            onMove([lat, lng]);
        }
        element.addEventListener("keydown", handleKeyDown);
        return () => element.removeEventListener("keydown", handleKeyDown);
    }, [map, position, onMove, accessPolicy, entryMethod]);

    return (
        <Marker
            ref={markerRef}
            position={position}
            icon={getMarkerIcon(accessPolicy, entryMethod, true)}
            draggable
            title="New bathroom location. Drag, or use the arrow keys, to move it."
            eventHandlers={{
                // Only report where it was dropped, not every pixel along the way.
                dragend: (event) => {
                    const { lat, lng } = event.target.getLatLng();
                    onMove([lat, lng]);
                },
            }}
            // Keep it above any saved marker it overlaps.
            zIndexOffset={1000}
        />
    );
}
