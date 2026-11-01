import { DivIcon } from "leaflet";
import { Marker, useMapEvents } from "react-leaflet";
import styles from "./UserLocationMarker.module.css";

type UserLocationProps = {
    position: [number, number] | null;
    onUserPan: ()=> void;
}

// Built once so position updates don't recreate the icon.
const userLocationIcon = new DivIcon({
    className: styles.userDot,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

export default function UserLocation({
  position,
  onUserPan
}: UserLocationProps) {
  useMapEvents({
    dragstart: () => onUserPan(),
  })
  if (!position)   return null;
  return (
    <Marker position={position} icon={userLocationIcon} interactive={false} keyboard={false} title="Your location" zIndexOffset={1000} />
  );
}
