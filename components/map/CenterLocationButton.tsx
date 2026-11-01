
import { Button } from "../ui/button";
type CenterLocationButtonProps = {
  onClick: () => void;
};

export default function CenterLocationButton({
  onClick,
}: CenterLocationButtonProps) {
  return (
    <Button
     
     
      aria-label="Center on my location"
      onClick={onClick}
      
    >
      Center Map
    </Button>
  );
}
