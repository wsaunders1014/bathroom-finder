import { use } from "react";
import type { Bathroom } from "@/types/bathroom";
import MapMarker from "./MapMarker";
type BathroomMarkersProps = {
    bathroomsPromise: Promise<Bathroom[]>;
    addedBathrooms: Bathroom[];
    onSelect: (bathroom:Bathroom)=> void;
};

export default function BathroomMarkers({
    bathroomsPromise,
    addedBathrooms,
    onSelect
}: BathroomMarkersProps) {
    const bathrooms = use(bathroomsPromise);
     const displayedBathrooms = [
        ...bathrooms,
        ...addedBathrooms.filter(
            (added) => !bathrooms.some((item) => item.id === added.id),
        ),
    ];
 return (
    <>
        {displayedBathrooms.map((bathroom)=>(
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
