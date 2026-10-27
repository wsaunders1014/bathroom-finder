"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Bathroom } from "@/types/bathroom";
import { toBathroom, type BathroomWithCodesRow } from "@/lib/bathrooms";

export type SaveBathroomState = 
| {
  status: "idle" | "error";
  message: string;
}
| {
    status: "success";
    message: string;
    bathroom: Bathroom;
}

export async function saveBathroom(
  _previousState: SaveBathroomState,
  formData: FormData,
): Promise<SaveBathroomState> {
  // Keep submissions local until contribution limits are implemented.
  if (process.env.NODE_ENV !== "development") {
    return {
      status: "error",
      message: "Submissions are not enabled yet.",
    };
  }
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getClaims();
  if (!authData?.claims) {
    return { status: "error", message: "Please sign in to add a bathroom." };
  }
  const nameValue = formData.get("name");
  const addressValue = formData.get("address");
  const latitudeValue = formData.get("latitude");
  const longitudeValue = formData.get("longitude");
  const accessPolicy = formData.get("accessPolicy");
  const entryMethod = formData.get("entryMethod");
  const accessNotesValue = formData.get("accessNotes");
  const codeValue = entryMethod === "code" ? formData.get("code"): null;
  let code: string | null = null;
  if( entryMethod === "code"){ 
    if (typeof codeValue !== "string") {
        return { status:"error", message:"Please enter a door code."}
    }
     const trimmedCode = codeValue.trim();
     if (trimmedCode === "") {
         return { status:"error", message:"Please enter a door code."}
     }
     if (trimmedCode.length > 100) {
        return { status:"error", message:"Code is too long."}
     }
     code = trimmedCode;
  }
  if (
    typeof accessPolicy !== "string" ||
    !["public", "customers_only", "permission_required", "unknown"].includes(accessPolicy) ||
    typeof entryMethod !== "string" ||
    !["open", "code", "key", "ask_staff", "unknown"].includes(entryMethod) ||
    (accessNotesValue !== null && typeof accessNotesValue !== "string")
  ) {
    return { status: "error", message: "Select valid access and entry options." };
  }

  const accessNotes = accessNotesValue?.trim() || null;
  if (accessNotes && accessNotes.length > 2000) {
    return { status: "error", message: "Access notes must be 2,000 characters or fewer." };
  }

  if (
    typeof nameValue !== "string" ||
    typeof addressValue !== "string" ||
    typeof latitudeValue !== "string" ||
    typeof longitudeValue !== "string"
  ) {
    return { status: "error", message: "Missing bathroom details." };
  }

  const name = nameValue.trim();
  const address = addressValue.trim();
  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);

  if (
    !name ||
    name.length > 200 ||
    address.length > 500
  ) {
    return { status: "error", message: "Enter a valid name and address." };
  }

  if (
    !latitudeValue.trim() ||
    !longitudeValue.trim() ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return { status: "error", message: "Select a valid map location." };
  }

  try {
    

    const { data, error } = await supabase.rpc(
    "create_bathroom_with_code_v2",
    {
      p_name: name,
      p_address: address,
      p_latitude:latitude,
      p_longitude: longitude,
      p_access_policy: accessPolicy,
      p_entry_method: entryMethod,
      p_access_notes: accessNotes ?? undefined,
      p_code: code ?? undefined,
    })
 

    if (error) {
      console.error("Bathroom insert failed:", error.message);
      return { status: "error", message: "Could not save. Please try again." };
    }
  
    return { status: "success", message: "Bathroom saved.", bathroom: toBathroom(data as BathroomWithCodesRow) };
  } catch {
    return { status: "error", message: "Could not save. Please try again." };
  }
}
