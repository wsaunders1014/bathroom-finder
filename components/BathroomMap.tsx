"use client";
import { useState, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import  LocateUser from "./LocateUser"
import { Map as LeafletMap } from "leaflet";
import CenterLocationButton from "@/components/CenterLocationButton";
import AddBathroomButton from "./AddBathroomButton";
import LocationPicker from "./LocationPicker";
import BathroomForm from "./BathroomForm";
import type { Bathroom } from "@/types/bathroom";
import BathroomMarkers from "./BathroomMarkers";
import { useRouter } from "next/navigation";
type BathroomMapProps = {
  bathrooms: Bathroom[];
}

export default function BathroomMap({bathrooms,}:BathroomMapProps) {
    const [position, setPosition] = useState<[number,number] | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [draftLocation, setDraftLocation] = useState<[number,number] | null>(null);
    const [addedBathrooms, setAddedBathrooms] = useState<Bathroom[]>([]);
    const mapRef = useRef<LeafletMap | null>(null);
    //const router = useRouter();
    
    function handleBathroomSaved(bathroom: Bathroom) {
        setAddedBathrooms((current) =>
            current.some((item) => item.id === bathroom.id) 
            ? current
            : [...current, bathroom],
        );
        setDraftLocation(null);
        //router.refresh();
    }
    const displayedBathrooms = [
  ...bathrooms,
  ...addedBathrooms.filter(
    (added) => !bathrooms.some((item) => item.id === added.id),
  ),
];
    function centerOnUser(){
        if(!position) return;
        mapRef.current?.setView(position,15);
    }
    function addBathroom(){
        setIsAdding(true);
        console.log('AddBathroom Button clicked');
    }
    function selectNewBathroomLocation(location: [number, number]) {
        setDraftLocation(location);
        setIsAdding(false);
    }
    return (
        <div className={`relative isolate h-full w-full ${isAdding ? "bathroom-add-mode":""}`}>
            {isAdding && (
  <div
    className="absolute top-4 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-3 rounded-lg bg-white px-4 py-3 text-black shadow-md"
  >
    <p role="status">Tap the map to place a bathroom</p>
    <button
      type="button"
      className="cursor-pointer underline"
      onClick={() => setIsAdding(false)}
    >
      Cancel
    </button>
  </div>
)}
            <MapContainer  
                center={[37.7749, -122.4194]}
                zoom={13}
                className="h-full w-full"
                ref={mapRef}    
            >
                    <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            
        />
            <LocationPicker
                isAdding={isAdding}
                onSelect={selectNewBathroomLocation}
            />
            {draftLocation && (
                <CircleMarker
                    center={draftLocation}
                    radius={10}
                    pathOptions={{
                    color: "#15803d",
                    fillColor: "#22c55e",
                    fillOpacity: 0.8,
                    }}
                />
            )}
            <LocateUser
                position={position}
                onPositionChange={setPosition}
            />
            <BathroomMarkers bathrooms={displayedBathrooms} />
            </MapContainer>
            <CenterLocationButton
                onClick={centerOnUser}
                disabled={position === null}
            />
            <AddBathroomButton
                isAdding={isAdding}
                onClick={addBathroom}
            />
            {draftLocation && (
                <BathroomForm
                    location={draftLocation}
                    onCancel={() => setDraftLocation(null)}
                    onSaved={handleBathroomSaved}
                />
            )}
        </div>
    )
}

