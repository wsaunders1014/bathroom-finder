import { Popup } from "react-leaflet";
import type { Bathroom } from "@/types/bathroom";
import MapMarker from "./MapMarker";
type BathroomMarkersProps = {
    bathrooms: Bathroom[];
};

export default function BathroomMarkers({
    bathrooms,
}: BathroomMarkersProps) {
 return (
    <>
        {bathrooms.map((bathroom)=>(
            <MapMarker key={bathroom.id} position={[bathroom.location.latitude, bathroom.location.longitude]} name={bathroom.name} accessPolicy={bathroom.accessPolicy} entryMethod={bathroom.entryMethod}>
                <Popup>
                    <strong>{bathroom.name}</strong>
                    <br />
                    {bathroom.address || "Address not provided"}
                    <br />
                    Access: {bathroom.accessPolicy}
                    <br />
                
                    Entry: {bathroom.entryMethod}
                    <div className="code-display">
                        {bathroom.codes.map((code) => (
                            <div key={code.id}>
                                <div  className="code">Code: {code.code} — Unverified</div>
                                <button type="button" aria-label="upvote" className="code-vote upvote cursor" >&lt;</button>
                                <button type="button" aria-label="downvote" className="code-vote downvote cursor" >&gt;</button>
                            </div>
                        ))}
                        <div>
                            <button type="button">Submit New Code</button>
                        </div>
                    </div>
                </Popup>
            </MapMarker>
        ))}
    </>
 )
}
