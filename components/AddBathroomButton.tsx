import Image from "next/image";
type AddBathroomButtonProps = {
    isAdding: boolean;
    onClick: () => void;
}
export default function AddBathroomButton({isAdding, onClick,}:AddBathroomButtonProps) {
    return (
       <button 
        className="add-bathroom bg-gray-200 hover:bg-gray-300 z-[1000] absolute bottom-6 right-6 p-3 border border-black rounded-[32px] cursor-pointer" 
        type="button" 
        aria-label={isAdding ? "Cancel bathroom placement" : "Add Bathroom"}
        onClick={onClick}
       >
        {isAdding ? (
            <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center text-4xl">
             ×
            </span>
        ) : (
            <Image
                src="/icons/toilet-plus.svg"
                alt=""
                width={44}
                height={44}
                draggable={false}
            />
        )}
       </button>
    )
}
