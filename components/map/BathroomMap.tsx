"use client";
import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import { useUserLocation } from "@/hooks/useUserLocation";
import UserLocationMarker from "./UserLocationMarker"
import { Map as LeafletMap, point, type LatLngExpression } from "leaflet";
import CenterLocationButton from "./CenterLocationButton";
import AddBathroomButton from "./AddBathroomButton";
import LocationPicker from "./LocationPicker";
import BathroomForm from "../BathroomForm";
import type { Bathroom } from "@/types/bathroom";
import BathroomMarkers from "./BathroomMarkers";
import MapLegend from "./MapLegend";
import { useRouter } from "next/navigation";
import LogInModal from "../auth/LogInModal";

import MarkerScaler from "./MarkerScaler";
import SidePanel from "../layout/SidePanel";
type BathroomMapProps = {
    bathrooms: Bathroom[];
    isSignedIn: boolean;
}
type Panel =
    | { type: "add"; location: [number, number] }
    | { type: "info"; bathroom: Bathroom }
    | null;

// Pans so latlng sits in the middle of the part of the map not covered by the side panel.
// coveredRight is how many pixels the panel covers on the right (0 when it's closed).
function panToVisibleCenter(map: LeafletMap | null, latlng: LatLngExpression, coveredRight: number) {
    if (!map) return;
    const size = map.getSize();
    const current = map.latLngToContainerPoint(latlng);
    const target = point((size.x - coveredRight) / 2, size.y / 2);
    map.panBy(current.subtract(target));
}

export default function BathroomMap({ bathrooms, isSignedIn }: BathroomMapProps) {
    const { position, status, retry } = useUserLocation();
    const [isAdding, setIsAdding] = useState(false);
    const [isFollowing, setIsFollowing] = useState(true);
    const [logInModalOpen, setLogInModalOpen] = useState(false);

    const [addedBathrooms, setAddedBathrooms] = useState<Bathroom[]>([]);
    const mapRef = useRef<LeafletMap | null>(null);
    const asideRef = useRef<HTMLElement>(null);
    const router = useRouter();
    const [wasSignedIn, setWasSignedIn] = useState(isSignedIn);
    const [panel, setPanel] = useState<Panel>(null);
    if (wasSignedIn !== isSignedIn) {
        setWasSignedIn(isSignedIn);
        if (!isSignedIn) {
            setIsAdding(false);
            setPanel(null);
        }
    }
    const wantsCenterRef = useRef(true);   // true = "center me on the next position"
    const isPanelOpen = panel !== null;

    // Also re-runs when the panel opens or closes, so the followed user stays in the visible area.
    useEffect(() => {
        if (position && isFollowing) {
            const covered = isPanelOpen ? (asideRef.current?.offsetWidth ?? 0) : 0;
            panToVisibleCenter(mapRef.current, position, covered);
        }
    }, [position, isFollowing, isPanelOpen]);


    function handleSignIn() {
        setLogInModalOpen(false);
        setIsAdding(true);
        router.refresh();
    }

    function handleBathroomSaved(bathroom: Bathroom) {
        setAddedBathrooms((current) =>
            current.some((item) => item.id === bathroom.id)
                ? current
                : [...current, bathroom],
        );
        setPanel(null);
        //router.refresh();
    }
    const displayedBathrooms = [
        ...bathrooms,
        ...addedBathrooms.filter(
            (added) => !bathrooms.some((item) => item.id === added.id),
        ),
    ];

    function centerOnUser() {
        if (!position) {
            // Try to get position, if timeout, display error message.
            wantsCenterRef.current = true
            if (status === "unavailable") retry();
            if (status === "denied") console.warn('User denied location service')
            return;
        }
        setIsFollowing(true);
        // mapRef.current?.setView(position, 15);
        //TODO: pass isFollowing to CenterLocationButton and change its style when it's true, so the user can see whether the map is following them.
    }
    const isAddFlowActive = isAdding || panel?.type === "add";

    function toggleAddMode() {
        if (!isSignedIn) {
            setLogInModalOpen(true);
            return;
        }
        if (isAddFlowActive) {
            // Cancel whichever step we're in: placing the pin or filling in the form.
            setIsAdding(false);
            setPanel(null);
        } else {
            setIsAdding(true);
        }
    }
    //Fires after save
    function selectNewBathroomLocation(location: [number, number]) {

        setIsAdding(false);
        // Stop following, or the next GPS update would pan the map back to the user.
        setIsFollowing(false);
        setPanel({ type: 'add', location })
        // The panel is opening now, so count its width even though `panel` hasn't updated yet.
        panToVisibleCenter(mapRef.current, location, asideRef.current?.offsetWidth ?? 0);
    }
    return (
        <div className={`relative isolate h-full w-full ${isAdding ? "bathroom-add-mode" : ""}`}>
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
            <div inert={panel?.type === "add"} className="h-full w-full">
                <MapContainer
                    center={[34.0211, -118.3965]}
                    zoom={18}
                    scrollWheelZoom="center"
                    className="h-full w-full"
                    ref={mapRef}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://stadiamaps.com/attribution/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}`}
                        maxZoom={20}

                    />
                    <MarkerScaler />
                    <LocationPicker
                        isAdding={isAdding}
                        onSelect={selectNewBathroomLocation}
                    />
                    {panel?.type === "add" && (
                        <CircleMarker
                            center={panel.location}
                            radius={10}
                            pathOptions={{
                                color: "#15803d",
                                fillColor: "#22c55e",
                                fillOpacity: 0.8,
                            }}
                        />
                    )}
                    <UserLocationMarker
                        position={position}
                        onUserPan={() => setIsFollowing(false)}
                    />
                    <BathroomMarkers bathrooms={displayedBathrooms} />
                </MapContainer>
            </div>
            <SidePanel
                ref={asideRef}
                isOpen={panel !== null}
                controls={
                    <>
                        <MapLegend />
                        <CenterLocationButton
                            onClick={centerOnUser}
                        />
                        <AddBathroomButton
                            isAdding={isAddFlowActive}
                            onClick={toggleAddMode}
                        />
                    </>
                }
            >
                {panel?.type === "add" && <BathroomForm location={panel.location}
                    onCancel={() => setPanel(null)}
                    onSaved={handleBathroomSaved} />
                }
                {/* {panel?.type === "info" && <BathroomInfo bathroom={panel.bathroom} />} */}
            </SidePanel>

            {logInModalOpen && (
                <LogInModal open={logInModalOpen} onOpenChange={() => setLogInModalOpen(false)} onSignedIn={handleSignIn} />
            )}

        </div>
    )
}

