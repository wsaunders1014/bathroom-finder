import { useMapEvents } from "react-leaflet";

type CloseOnMapInteractionProps = {
    onClose: () => void;
}

// Calls onClose when the user clicks empty map or starts dragging it.
// Marker clicks don't reach the map, so selecting another bathroom doesn't trigger this.
// dragstart (not movestart) so our own panToVisibleCenter calls don't count.
export default function CloseOnMapInteraction({
    onClose,
}:CloseOnMapInteractionProps) {
    useMapEvents({
        click: () => onClose(),
        dragstart: () => onClose(),
    });
    return null;
}
