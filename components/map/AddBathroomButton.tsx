import { Button } from "../ui/button";
type AddBathroomButtonProps = {
    isAdding: boolean;
    onClick: () => void;
}
export default function AddBathroomButton({isAdding, onClick,}:AddBathroomButtonProps) {
    return (
       <Button 
        aria-label={isAdding ? "Cancel bathroom placement" : "Add Bathroom"}
        onClick={onClick}
        className={""}
       >
        {isAdding ? (
            <span aria-hidden="true" >
             Cancel
            </span>
        ) : (
            <span>Add Bathroom</span>
        )}
       </Button>
    )
}
