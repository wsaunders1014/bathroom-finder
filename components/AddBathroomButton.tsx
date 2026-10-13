import Image from "next/image";
type AddBathroomButtonProps = {
    onClick: () => void;
}
export default function AddBathroomButton({onClick,}:AddBathroomButtonProps) {
    return (
       <button 
        className="add-bathroom bg-gray-200 hover:bg-gray-300 z-[1000] absolute bottom-6 right-6 p-3 border border-black rounded-[32px] cursor-pointer" type="button" aria-label="Add Bathroom"
        onClick={onClick}
       >
            <Image
                src="/icons/toilet-plus.svg"
                alt=""
                width={44}
                height={44}
                draggable={false}
            />
       </button>
    )
}
