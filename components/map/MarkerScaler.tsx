import { useMapEvents } from "react-leaflet";
import { useEffect } from "react";
export default function MarkerScaler() {


    const map = useMapEvents({
        zoomanim: (e) => {
            // 1 at zoom 18+, shrinking 0.1 per level, never below 0.5
            const scale = Math.min(1, Math.max(0.5, 1 - (18 - e.zoom) * 0.1));

            map.getContainer().style.setProperty("--marker-scale", String(scale));
        },
    });
    useEffect(() => {
        map.getZoom();
    }, [map]);
    return null;
}