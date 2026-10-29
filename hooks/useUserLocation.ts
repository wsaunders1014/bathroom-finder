import { useState, useEffect } from "react";
import { installFakeWalk } from "@/lib/fakeWalk";

type LocationState = "locating" | "located" | "denied" | "unavailable";
export function useUserLocation() {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [locationStatus, setLocationStatus] = useState<LocationState>("locating")
    const [retryCount, setRetryCount] = useState(0);

    const isSupported = typeof navigator !== "undefined" && !!navigator.geolocation;
    useEffect(() => {
        if (!navigator.geolocation) {
            return;
        }
        if (process.env.NODE_ENV === "development") installFakeWalk();

        const watchId = navigator.geolocation.watchPosition(
            ({ coords }) => {
                setLocationStatus("located");
                setPosition([coords.latitude, coords.longitude])
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED)
                    setLocationStatus('denied')
                else if (error.code === error.POSITION_UNAVAILABLE)
                    setLocationStatus('unavailable')
                else {
                    console.error(error);
                    setLocationStatus('unavailable')
                }
            },
            {
                enableHighAccuracy: true,
                maximumAge: 60_000
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [retryCount]);

    function retry() {
        setLocationStatus('locating');
        setRetryCount((count) => count + 1)
    }

    return {
        position, status: isSupported ? locationStatus : "unavailable", retry
    }
}