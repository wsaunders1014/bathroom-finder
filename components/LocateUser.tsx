import { useEffect } from "react";
import { CircleMarker, useMap } from "react-leaflet";
type LocateUserProps = {
    position: [number, number] | null;
    onPositionChange: (position: [number,number]) => void;
}
export default function LocateUser({
  position,
  onPositionChange,
}: LocateUserProps) {
  const map = useMap();


  useEffect(() => {
    if (!navigator.geolocation) return;

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (cancelled) return;
        onPositionChange([coords.latitude,coords.longitude]);
        map.setView([coords.latitude, coords.longitude], 15);
      },
      (error) => {
        if (cancelled) return;

        console.warn("Could not get your location:", error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30_000,
        maximumAge: 60_000,
      },
    );

    return () => {
      cancelled = true;
    };
  }, [map, onPositionChange]);
  if (!position)   return null;
  return (
    <CircleMarker
        center={position}
        radius={8}
        pathOptions={{
            color: "white",
            weight: 2,
            fillColor: "#246",
            fillOpacity:1,
        }}
    />
  );
}