import { Popup } from "react-leaflet";
import type { Bathroom } from "@/types/bathroom";
import MapMarker from "./MapMarker";
type BathroomMarkersProps = {
    bathrooms: Bathroom[];
    onSelect: (bathroom:Bathroom)=> void;
};

export default function BathroomMarkers({
    bathrooms,
    onSelect
}: BathroomMarkersProps) {
 return (
    <>
        {bathrooms.map((bathroom)=>(
            <MapMarker 
                key={bathroom.id} 
                position={[bathroom.location.latitude, bathroom.location.longitude]} 
                name={bathroom.name} 
                accessPolicy={bathroom.accessPolicy} 
                entryMethod={bathroom.entryMethod} 
                onSelect={()=> onSelect(bathroom)}>
               
            </MapMarker>
        ))}
    </>
 )
}
