import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useActionState, useEffect, useState } from "react";
import {
  saveBathroom,
  type SaveBathroomState,
} from "@/app/actions/bathrooms";
import type { Bathroom } from "@/types/bathroom";
const initialState: SaveBathroomState = {
  status: "idle",
  message: "",
};
type BathroomFormProps = {
    location: [number,number];
    onCancel: () => void;
    onSaved: (bathroom: Bathroom) => void;
}

export default function BathroomForm({
  location,
  onCancel,
  onSaved,
}: BathroomFormProps) {
    const [entryMethod, setEntryMethod] = useState("unknown");
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
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add bathroom</DialogTitle>
          <DialogDescription>
            Add details for the selected location.
          </DialogDescription>
        </DialogHeader>
      
        <p className="text-sm text-muted-foreground">
          Location: {location[0].toFixed(5)}, {location[1].toFixed(5)}
        </p>
        <form className="grid gap-4"  action={formAction}>
        <div className="grid gap-2">
          <Label htmlFor="bathroom-name">Name</Label>
          <Input
            id="bathroom-name"
            name="name"
            placeholder="For example, Market Street Café"
            required
            maxLength={200}
          />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="bathroom-address">Address(optional)</Label>
            <Input
                id="bathroom-address"
                name="address"
                
                maxLength={500}
                placeholder="Street address if known"
            />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bathroom-access-policy">Access policy</Label>
          <select
            id="bathroom-access-policy"
            name="accessPolicy"
            defaultValue="unknown"
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="unknown">Unknown</option>
            <option value="public">Public</option>
            <option value="customers_only">Customers only</option>
            <option value="permission_required">Permission required</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bathroom-entry-method">Entry method</Label>
          <select
            id="bathroom-entry-method"
            name="entryMethod"
            value={entryMethod}
            onChange={(event) => setEntryMethod(event.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="unknown">Unknown</option>
            <option value="open">Open</option>
            <option value="code">Code</option>
            <option value="key">Key</option>
            <option value="ask_staff">Ask staff</option>
          </select>
        </div>
        {entryMethod === "code" && (
          <div className="grid gap-2">
            <Label htmlFor="bathroom-door-code">Door code</Label>
            <Input
              id="bathroom-door-code"
              name="code"
              type="text"
              required
              maxLength={100}
              autoComplete="off"
              spellCheck={false}
              placeholder="For example, 0123#"
            />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="bathroom-access-notes">Access notes (optional)</Label>
          <textarea
            id="bathroom-access-notes"
            name="accessNotes"
            rows={3}
            maxLength={2000}
            placeholder="For example, upstairs at the back."
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring"
          />
        </div>
        <input type="hidden" name="latitude" value={location[0]} />
        <input type="hidden" name="longitude" value={location[1]} />
        {state.message && (
            <p role={state.status === "error" ? "alert" : "status"}>
                {state.message}
            </p>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit"  disabled={isPending || state.status === "success"}>{isPending ? "Saving…" : "Save bathroom"}</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
