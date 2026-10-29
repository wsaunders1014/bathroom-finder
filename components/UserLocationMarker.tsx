
import { CircleMarker, useMapEvents } from "react-leaflet";
type UserLocationProps = {
    position: [number, number] | null;
    onUserPan: ()=> void;
}
export default function UserLocation({
  position,
  onUserPan
}: UserLocationProps) {
  useMapEvents({
    dragstart: () => onUserPan(),
  })
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