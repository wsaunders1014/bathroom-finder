"use client";
import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useUserLocation } from "@/hooks/useUserLocation";
import UserLocationMarker from "./UserLocationMarker"
import { Map as LeafletMap, type LatLngExpression } from "leaflet";
import CenterLocationButton from "./CenterLocationButton";
import AddBathroomButton from "./AddBathroomButton";
import LocationPicker from "./LocationPicker";
import BathroomForm from "../BathroomForm";
import type { AccessPolicy, Bathroom, EntryMethod } from "@/types/bathroom";
import BathroomMarkers from "./BathroomMarkers";
import MapLegend from "./MapLegend";
import { useRouter } from "next/navigation";
import LogInModal from "../auth/LogInModal";
import SignInButton from "../auth/SignInButton";
import SignOutButton from "../auth/SignOutButton";
import { Suspense } from "react";
import MarkerScaler from "./MarkerScaler";
import SidePanel from "../layout/SidePanel";
import BathroomInfo from "./BathroomInfo";
import CloseOnMapInteraction from "./CloseOnMapInteraction";
import DraftMarker from "./DraftMarker";
import MarkersLoading from "./MarkersLoading";
import markerStyles from "./MapMarker.module.css";
type BathroomMapProps = {
    bathroomsPromise: Promise<Bathroom[]>;
    isSignedIn: boolean;
}
type Panel =
    // accessPolicy and entryMethod live here, not in the form, so the draft marker can show them too.
    | { type: "add"; location: [number, number]; accessPolicy: AccessPolicy; entryMethod: EntryMethod }
    | { type: "info"; bathroom: Bathroom }
    | null;

// How far to zoom in when a draft location is picked. Markers are full size from 18 up (see MarkerScaler).
const DRAFT_ZOOM = 19;

// Pans so latlng sits in the middle of the part of the map not covered by the side panel.
// coveredRight is how many pixels the panel covers on the right (0 when it's closed).
// With minZoom, also zooms in to at least that level, but never zooms out.
function panToVisibleCenter(map: LeafletMap | null, latlng: LatLngExpression, coveredRight: number, minZoom?: number) {
    if (!map) return;
    const zoom = Math.max(map.getZoom(), minZoom ?? 0);
    // Work in pixels at the zoom we're going to: the map's center has to be half the panel's
    // width to the right of latlng, so latlng ends up centered in the uncovered part.
    const center = map.project(latlng, zoom).add([coveredRight / 2, 0]);
    map.setView(map.unproject(center, zoom), zoom);
}

export default function BathroomMap({ bathroomsPromise, isSignedIn }: BathroomMapProps) {
    const { position, status, retry } = useUserLocation();
    const [isAdding, setIsAdding] = useState(false);
    const [isFollowing, setIsFollowing] = useState(true);
    // Why the log in modal is open, so signing in from the Add button can go straight into add mode.
    // null = closed.
    const [logInReason, setLogInReason] = useState<"signIn" | "add" | null>(null);

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
        if (logInReason === "add") setIsAdding(true);
        setLogInReason(null);
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
            setLogInReason("add");
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
        setPanel({ type: 'add', location, accessPolicy: "unknown", entryMethod: "unknown" })
        // The panel is opening now, so count its width even though `panel` hasn't updated yet.
        panToVisibleCenter(mapRef.current, location, asideRef.current?.offsetWidth ?? 0, DRAFT_ZOOM);
    }

    // Changes the draft's location or form choices without touching anything else in the panel.
    function updateDraft(changes: { location?: [number, number]; accessPolicy?: AccessPolicy; entryMethod?: EntryMethod }) {
        setPanel((current) => current?.type === "add" ? { ...current, ...changes } : current);
    }

    function selectBathroom(bathroom: Bathroom){
        // The map stays interactive while the add form is open (so the draft can be dragged),
        // so ignore other markers then, or clicking one would replace the form.
        if (panel?.type === "add") return;
        setIsFollowing(false);
        setPanel({type:"info", bathroom});
         panToVisibleCenter(mapRef.current, [bathroom.location.latitude, bathroom.location.longitude], asideRef.current?.offsetWidth ?? 0);
    }

    return (
        <div className={`relative isolate h-full w-full ${isAdding ? "bathroom-add-mode" : ""} ${panel?.type === "add" ? markerStyles.dimOtherMarkers : ""}`}>
            {isAddFlowActive && (
                <div
                    // Once the form is open, center in the map area left of the panel rather than the
                    // whole map, or the panel covers it (220px is half the panel's w-110 = 440px), and sit
                    // below the logo and Sign Out button, which that narrower area squeezes it between.
                    className={`absolute z-[1000] flex -translate-x-1/2 items-center gap-3 rounded-lg bg-white px-4 py-3 text-black shadow-md ${isAdding ? "top-4 left-1/2" : "top-20 left-[calc(50%_-_220px)]"}`}
                >
                    <p role="status">
                        {isAdding ? "Tap the map to place a bathroom" : "Drag marker to adjust location or"}
                    </p>
                    <button
                        type="button"
                        className="cursor-pointer underline"
                        // Cancels whichever step we're in: placing the pin, or the form.
                        onClick={() => isAdding ? setIsAdding(false) : setPanel(null)}
                    >
                        Cancel
                    </button>
                </div>
            )}
            <div className="h-full w-full">
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
                        <DraftMarker
                            position={panel.location}
                            accessPolicy={panel.accessPolicy}
                            entryMethod={panel.entryMethod}
                            onMove={(location) => updateDraft({ location })}
                        />
                    )}
                    {/* Updater form so it reads the latest panel: in add mode, LocationPicker may have
                        just switched the panel to "add" during this same click, and that should stay open. */}
                    <CloseOnMapInteraction
                        onClose={() => setPanel((current) => current?.type === "info" ? null : current)}
                    />
                    <UserLocationMarker
                        position={position}
                        onUserPan={() => setIsFollowing(false)}
                    />
                    <Suspense fallback={<MarkersLoading />}>
                        <BathroomMarkers bathroomsPromise={bathroomsPromise} addedBathrooms={addedBathrooms} onSelect={selectBathroom} />
                    </Suspense>
                </MapContainer>
            </div>
            <SidePanel
                ref={asideRef}
                isOpen={panel !== null}
                controls={
                    <>
                        <div className="pointer-events-auto">
                            {isSignedIn
                                ? <SignOutButton />
                                : <SignInButton onClick={() => setLogInReason("signIn")} />}
                        </div>
                        <div className="pointer-events-auto flex flex-col items-end gap-2">
                            <MapLegend />
                            <CenterLocationButton
                                onClick={centerOnUser}
                            />
                            <AddBathroomButton
                                isAdding={isAddFlowActive}
                                onClick={toggleAddMode}
                            />
                        </div>
                    </>
                }
            >
                {panel?.type === "add" && <BathroomForm location={panel.location}
                    accessPolicy={panel.accessPolicy}
                    entryMethod={panel.entryMethod}
                    onAccessPolicyChange={(accessPolicy) => updateDraft({ accessPolicy })}
                    onEntryMethodChange={(entryMethod) => updateDraft({ entryMethod })}
                    onCancel={() => setPanel(null)}
                    onSaved={handleBathroomSaved} />
                }
                {panel?.type === "info" && <BathroomInfo bathroom={panel.bathroom}
                    onClose={() => setPanel(null)} />
                }
            </SidePanel>

            {logInReason !== null && (
                <LogInModal open={logInReason !== null} onOpenChange={() => setLogInReason(null)} onSignedIn={handleSignIn} />
            )}

        </div>
    )
}

