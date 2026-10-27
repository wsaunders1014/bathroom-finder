export type Bathroom = {
    id: string;
    name: string;
    address?: string;
    location: {
        latitude: number;
        longitude: number;
    };
    venueCategory: VenueCategory;
    accessPolicy: AccessPolicy;
    entryMethod: EntryMethod;
    accessNotes?: string;
    // ISO 8601 timestamp, such as "2026-10-09T18:00:00Z".
    updatedAt: string;
    codes: BathroomAccessCode[];
};

type AccessPolicy = "public" | "customers_only" | "permission_required" | "unknown";

type EntryMethod = "open" | "code" | "key" | "ask_staff" | "unknown";

type VenueCategory = "cafe" | "restaurant" | "store" | "park" | "transit_station" | "other" | "unknown";

export type BathroomAccessCode = {
    id: string;
    code: string;
    createdAt: string;
}