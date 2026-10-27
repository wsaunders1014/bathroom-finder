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
import LogInModal from "./LogInModal";
import SignOutButton from "./SignOutButton";
type BathroomMapProps = {
  bathrooms: Bathroom[];
  isSignedIn: boolean;
}

export default function BathroomMap({bathrooms, isSignedIn}:BathroomMapProps) {
    const [position, setPosition] = useState<[number,number] | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [logInModalOpen, setLogInModalOpen] = useState(false);
    const [draftLocation, setDraftLocation] = useState<[number,number] | null>(null);
    const [addedBathrooms, setAddedBathrooms] = useState<Bathroom[]>([]);
    const mapRef = useRef<LeafletMap | null>(null);
    const router = useRouter();
    function handleSignIn(){
        setLogInModalOpen(false);
        setIsAdding(true)
        router.refresh();
    }
    function handleSignOut(){
        // Leave add mode so a signed-out user isn't left placing a bathroom.
        setIsAdding(false);
        setDraftLocation(null);
    }
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
        if(!position) {

            // Try to get position, if timeout, display error message.
            
            return;
        }
        mapRef.current?.setView(position,15);
    }
    function toggleAddMode(){
        if(isSignedIn){
            setIsAdding((current) => !current);
            console.log('AddBathroom Button clicked');
        }else{
            //load sign in modal.
            setLogInModalOpen(true);
        }
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
                center={[34.0211, -118.3965]}
                zoom={15}
                className="h-full w-full"
                ref={mapRef}    
            >
                    <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/attribution/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}`}
            maxZoom={20}
            
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
        {isSignedIn && <SignOutButton onSignedOut={handleSignOut} /> }
        <CenterLocationButton
            onClick={centerOnUser}
            disabled={position === null}
        />
        <AddBathroomButton
            isAdding={isAdding}
            onClick={toggleAddMode}
        />
        {draftLocation && (
            <BathroomForm
                location={draftLocation}
                onCancel={() => setDraftLocation(null)}
                onSaved={handleBathroomSaved}
            />
        )}
        {logInModalOpen &&(
            <LogInModal open={logInModalOpen} onOpenChange={()=> setLogInModalOpen(false)} onSignedIn={handleSignIn} />
        )}
        
    </div>
    )
}

