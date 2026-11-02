import type { AccessPolicy, EntryMethod } from "@/types/bathroom";
import { DivIcon } from "leaflet";
import { Marker } from "react-leaflet";
import styles from "./MapMarker.module.css";

// The icon shows how to get in.
// Exported, along with the classes and labels below, so MapLegend stays in sync with the markers.
export const entryIconUrls: Record<EntryMethod, string> = {
    open: '/icons/icon-lock.svg',
    code: "/icons/icon-code.svg",
    key: "/icons/icon-key.svg",
    ask_staff: '/icons/icon-ask.svg',
    unknown: "/icons/icon-unknown.svg",
}
const entryIconHtml = Object.fromEntries(
    Object.entries(entryIconUrls).map(([entryMethod, url]) => [entryMethod, maskIconHtml(url)])
) as Record<EntryMethod,string>;
// The fill color shows who's allowed to use it.
export const policyClasses: Record<AccessPolicy,string> = {
    public: styles.public,
    customers_only: styles.customersOnly,
    permission_required: styles.permissionRequired,
    unknown: styles.policyUnknown,
}
// Spoken by screen readers (and shown as a tooltip), since the color and icon are visual only.
export const policyLabels: Record<AccessPolicy,string> = {
    public: "public",
    customers_only: "customers only",
    permission_required: "permission required",
    unknown: "access unknown",
}
export const entryLabels: Record<EntryMethod,string> = {
    open: "open entry",
    code: "door code",
    key: "key required",
    ask_staff: "ask staff",
    unknown: "entry unknown",
}

// One icon per policy + entry method pair, created the first time it's needed
// and reused after, so re-renders don't make Leaflet redraw the marker.
const markerIcons = new Map<string, DivIcon>();

// isDraft is for the unsaved marker shown while the add form is open (see DraftMarker).
export function getMarkerIcon(accessPolicy: AccessPolicy, entryMethod: EntryMethod, isDraft = false) {
    const key = `${accessPolicy}:${entryMethod}:${isDraft}`;
    let icon = markerIcons.get(key);
    if (!icon) {
        const classes = isDraft ? `${policyClasses[accessPolicy]} ${styles.draft}` : policyClasses[accessPolicy];
        icon = makeMarkerIcon(entryIconHtml[entryMethod], classes);
        markerIcons.set(key, icon);
    }
    return icon;
}
function makeMarkerIcon(innerHtml: string, extraClasses: string) {
  return new DivIcon({
    className: styles.markerWrapper,
    // aria-hidden so the icon is skipped and the marker's title stays its accessible name.
    html: `<div class="${styles.marker} ${extraClasses}" aria-hidden="true">${innerHtml}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}
function maskIconHtml(iconUrl:string){
    return `<span class="${styles.icon}" style="--icon-url: url('${iconUrl}')"></span>`;
}
type MapMarkerProps = {
    position:[number,number];
    name: string;
    accessPolicy: AccessPolicy;
    entryMethod: EntryMethod;
    children?: React.ReactNode;
    onSelect: ()=> void;
}
export default function MapMarker({position, name, accessPolicy, entryMethod, children, onSelect}:MapMarkerProps) {
    const title = `${name}, ${policyLabels[accessPolicy]}, ${entryLabels[entryMethod]}`;
    return <Marker position={position} icon={getMarkerIcon(accessPolicy, entryMethod)} title={title} eventHandlers={{click: onSelect}}>
        {children}
    </Marker>
}
