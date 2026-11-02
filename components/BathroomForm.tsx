import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import {
  saveBathroom,
  type SaveBathroomState,
} from "@/app/actions/bathrooms";
import type { AccessPolicy, Bathroom, EntryMethod } from "@/types/bathroom";
import { entryIconUrls } from "@/components/map/MapMarker";
import markerStyles from "@/components/map/MapMarker.module.css";
const initialState: SaveBathroomState = {
  status: "idle",
  message: "",
};
type BathroomFormProps = {
    location: [number,number];
    // Controlled by BathroomMap, which also shows them on the draft marker.
    accessPolicy: AccessPolicy;
    entryMethod: EntryMethod;
    onAccessPolicyChange: (accessPolicy: AccessPolicy) => void;
    onEntryMethodChange: (entryMethod: EntryMethod) => void;
    onCancel: () => void;
    onSaved: (bathroom: Bathroom) => void;
}

// Shared by every field label and text box, so the fields stay consistent.
const labelClass = "text-[13px] leading-normal font-semibold text-ink";
const inputClass = "h-12 rounded-[10px] border-line bg-white px-3 text-sm leading-[1.5] text-ink placeholder:text-ink-muted md:text-sm";
const hintClass = "text-xs leading-[1.5] text-ink-muted";

// Each tile is a hidden radio inside its label; has-checked: styles the tile whose radio is selected,
// and has-focus-visible: shows keyboard focus, since the radio itself isn't visible.
const tileClass = "flex cursor-pointer flex-col items-center justify-center rounded-[10px] border border-line px-1.5 py-2 text-center text-xs leading-[15px] font-semibold has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--brand-primary-blue)";

// Fill colors match the map markers.
const accessPolicyOptions: { value: AccessPolicy; label: string; fill: string }[] = [
  { value: "public", label: "Public", fill: "bg-(--public-fill-color)" },
  { value: "customers_only", label: "Customers only", fill: "bg-(--customers-only-fill)" },
  { value: "permission_required", label: "Permission required", fill: "bg-(--permission-fill)" },
  { value: "unknown", label: "Unknown", fill: "bg-(--unknown-fill)" },
];

// Icons come from the map markers (entryIconUrls), so the form and markers stay in sync.
const entryMethodOptions: { value: EntryMethod; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "code", label: "Code" },
  { value: "key", label: "Key" },
  { value: "ask_staff", label: "Ask staff" },
  { value: "unknown", label: "Unknown" },
];

export default function BathroomForm({
  location,
  accessPolicy,
  entryMethod,
  onAccessPolicyChange,
  onEntryMethodChange,
  onCancel,
  onSaved,
}: BathroomFormProps) {
    const [state, formAction, isPending] = useActionState(
        saveBathroom,
        initialState,
    );
    useEffect(() => {
        if (state.status === "success") {
            onSaved(state.bathroom);
        }
    }, [state, onSaved]);
  return (
    <form className="flex flex-col gap-3 text-ink" action={formAction}>
      <div className="flex flex-col items-start gap-[4px]">
        {/* <p className="rounded-md bg-mint px-2 py-[5px] text-[11px] font-semibold text-teal">
          Step 2 of 2 · Add details
        </p> */}
        <h2 className="text-[22px] leading-[1.25] font-semibold">Add a bathroom</h2>
        <p className="text-[11px] leading-[1.5] text-ink-muted">
          Help someone find a place to go. Share only what you know.
        </p>
      </div>

      {/* <div className="flex items-start gap-2.5 rounded-[10px] bg-mint p-3.5">
        <Image src="/icons/form/map-pin.svg" alt="" width={18} height={18} className="shrink-0" />
        <div className="flex flex-col gap-1 leading-[1.5]">
          <p className="text-[13px] font-semibold">Pin selected on the map</p>
          <p className="text-[11px] text-ink-muted">
            Drag the pin to move it · {location[0].toFixed(5)}, {location[1].toFixed(5)}
          </p>
        </div>
      </div> */}

      <div className="flex flex-col gap-[7px]">
        <Label htmlFor="bathroom-name" className={labelClass}>Name *</Label>
        <Input
          id="bathroom-name"
          name="name"
          placeholder="For example, Market Street Café"
          required
          maxLength={200}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-[7px]">
        <Label htmlFor="bathroom-address" className={labelClass}>Address (optional)</Label>
        <Input
          id="bathroom-address"
          name="address"
          maxLength={500}
          placeholder="Street address, if known"
          aria-describedby="bathroom-address-hint"
          className={inputClass}
        />
        <p id="bathroom-address-hint" className={hintClass}>No street address? The map pin is enough.</p>
      </div>

      <fieldset>
        <legend className={labelClass}>Access policy</legend>
        <div className="mt-[7px] grid grid-cols-4 gap-2">
          {accessPolicyOptions.map((option) => (
            <label
              key={option.value}
              className={`${tileClass} ${option.fill} aspect-square text-white text-xs shadow-[0_1px_1px_rgba(0,0,0,0.05),0_2px_3px_rgba(0,0,0,0.07)] border-2 has-checked:border-(--brand-primary-blue) relative transition-all duration-150 motion-safe:hover:-translate-y-1`}
            >
              <input
                type="radio"
                name="accessPolicy"
                value={option.value}
                checked={accessPolicy === option.value}
                onChange={() => onAccessPolicyChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Entry method</legend>
        <div className="mt-[7px] grid grid-cols-5 gap-2.5">
          {entryMethodOptions.map((option) => {
            const iconUrl = entryIconUrls[option.value];
            return (
            <label
              key={option.value}
              // Not aspect-square like the policy tiles: a fixed aspect ratio stops the grid stretching
              // every tile to the tallest one's height (e.g. when "Door code" wraps onto two lines).
              className={`${tileClass} gap-[7px] bg-white has-checked:border-[1.5px] has-checked:border-(--brand-primary-blue) has-checked:bg-(--brand-secondary-blue)/43 transition-all duration-150 motion-safe:hover:-translate-y-1`}
            >
              <input
                type="radio"
                name="entryMethod"
                value={option.value}
                checked={entryMethod === option.value}
                onChange={() => onEntryMethodChange(option.value)}
                className="sr-only"
              />
              {/* The marker icons are white, so they're used as a mask and painted with the text color. */}
              <span
                aria-hidden="true"
                className={`${markerStyles.icon} text-[#255366]`}
                style={{ "--icon-url": `url('${iconUrl}')`, width: 24, height: 24 } as React.CSSProperties}
              />
              {option.label}
            </label>
            );
          })}
        </div>
      </fieldset>

      {entryMethod === "code" && (
        <div className="flex flex-col gap-[7px]">
          <Label htmlFor="bathroom-door-code" className={labelClass}>Door code *</Label>
          <Input
            id="bathroom-door-code"
            name="code"
            type="text"
            required
            maxLength={100}
            autoComplete="off"
            spellCheck={false}
            placeholder="For example, 0123#"
            aria-describedby="bathroom-door-code-hint"
            className={inputClass}
          />
          <p id="bathroom-door-code-hint" className={hintClass}>Required for Door code. Added as New · Unverified.</p>
        </div>
      )}

      <div className="flex flex-col gap-[7px]">
        <Label htmlFor="bathroom-access-notes" className={labelClass}>Access notes (optional)</Label>
        <textarea
          id="bathroom-access-notes"
          name="accessNotes"
          rows={2}
          maxLength={2000}
          placeholder="For example, upstairs at the back."
          className="min-h-19 w-full rounded-[10px] border border-line bg-white p-3 text-sm leading-[1.5] text-ink outline-none placeholder:text-ink-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <p className="text-[11px] leading-[1.5] text-ink-muted">
        Only name is required unless Door code is selected. Unknown is always a valid answer.
      </p>

      <input type="hidden" name="latitude" value={location[0]} />
      <input type="hidden" name="longitude" value={location[1]} />
      {state.message && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={`text-[13px] ${state.status === "error" ? "text-destructive" : "text-teal"}`}
          >
              {state.message}
          </p>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-12 w-26 rounded-[10px] border-line bg-white text-sm font-semibold text-ink"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || state.status === "success"}
          className="h-12 w-45 min-w-0 gap-2 rounded-[10px] border-(--brand-primary-blue) px-0 py-0 text-sm hover:border-(--brand-darker-blue) hover:bg-(--brand-darker-blue) hover:text-white"
        >
          <Image src="/icons/form/check.svg" alt="" width={18} height={18} />
          {isPending ? "Saving…" : "Save bathroom"}
        </Button>
      </div>
    </form>
  );
}
