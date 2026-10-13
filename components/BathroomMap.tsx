"use client";
import { useState, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import  LocateUser from "./LocateUser"
import { Map as LeafletMap } from "leaflet";
import CenterLocationButton from "@/components/CenterLocationButton";
import AddBathroomButton from "./AddBathroomButton";
import LocationPicker from "./LocationPicker";
import BathroomForm from "./BathroomForm";
export default function BathroomMap() {
    const [position, setPosition] = useState<[number,number] | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [draftLocation, setDraftLocation] = useState<[number,number] | null>(null);
    const mapRef = useRef<LeafletMap | null>(null);

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
        <div className="relative isolate h-full w-full">
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
            </MapContainer>
            <CenterLocationButton
                onClick={centerOnUser}
                disabled={position === null}
            />
            <AddBathroomButton
                onClick={addBathroom}
            />
            {draftLocation && (
                <BathroomForm
                    location={draftLocation}
                    onCancel={() => setDraftLocation(null)}
                />
            )}
        </div>
    )
}

