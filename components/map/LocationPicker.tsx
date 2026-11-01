import { useMapEvents } from "react-leaflet";

type LocationPickerProps = {
    isAdding: boolean;
    onSelect: (location: [number, number]) => void;
}

export default function LocationPicker({
    isAdding,
    onSelect,
}:LocationPickerProps) {
    useMapEvents({
        click(event) {
            if(!isAdding) return;
            onSelect([event.latlng.lat, event.latlng.lng])
        },
    });
    return null;
}