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
type BathroomFormProps = {
    location: [number,number];
    onCancel: () => void;
}

export default function BathroomForm({
  location,
  onCancel,
}: BathroomFormProps) {
  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add bathroom</DialogTitle>
          <DialogDescription>
            Add details for the selected location.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Location: {location[0].toFixed(5)}, {location[1].toFixed(5)}
        </p>

        <div className="grid gap-2">
          <Label htmlFor="bathroom-name">Name</Label>
          <Input
            id="bathroom-name"
            name="name"
            placeholder="For example, Market Street Café"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}