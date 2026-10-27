import { CircleMarker, Popup } from "react-leaflet";
import type { Bathroom } from "@/types/bathroom";

type BathroomMarkersProps = {
    bathrooms: Bathroom[];
};

export default function BathroomMarkers({
    bathrooms,
}: BathroomMarkersProps) {
 return (
    <>
        {bathrooms.map((bathroom)=>(
            <CircleMarker
                key={bathroom.id}
                center={[bathroom.location.latitude,
                    bathroom.location.longitude,
                ]}
                radius={8}
            pathOptions={{
            color: "#7c3aed",
            fillColor: "#7c3aed",
            fillOpacity: 0.8,
          }}
          >
             <Popup>
                <strong>{bathroom.name}</strong>
                <br />
                {bathroom.address || "Address not provided"}
                <br />
                Access: {bathroom.accessPolicy}
                <br />
                Entry: {bathroom.entryMethod}
                {bathroom.codes.map((code) => (
                    <div key={code.id}>Code: {code.code} — Unverified</div>
                ))}
            </Popup>
          </CircleMarker>
        ))}
    </>
 )
}
