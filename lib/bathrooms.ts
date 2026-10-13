import type { Bathroom } from "@/types/bathroom";
import type { Database } from "@/types/database";

type BathroomRow = Database["public"]["Tables"]["bathrooms"]["Row"];

export function toBathroom(row: BathroomRow): Bathroom {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
    venueCategory: parseVenueCategory(row.venue_category),
    accessPolicy: parseAccessPolicy(row.access_policy),
    entryMethod: parseEntryMethod(row.entry_method),
    accessNotes: row.access_notes ?? undefined,
    updatedAt: row.updated_at,
  };
}
function parseVenueCategory(value: string): Bathroom["venueCategory"] {
  switch (value) {
    case "cafe":
    case "restaurant":
    case "store":
    case "park":
    case "transit_station":
    case "other":
      return value;
    default:
      return "unknown";
  }
}

function parseAccessPolicy(value: string): Bathroom["accessPolicy"] {
  switch (value) {
    case "public":
    case "customers_only":
    case "permission_required":
      return value;
    default:
      return "unknown";
  }
}

function parseEntryMethod(value: string): Bathroom["entryMethod"] {
  switch (value) {
    case "open":
    case "code":
    case "key":
    case "ask_staff":
      return value;
    default:
      return "unknown";
  }
}