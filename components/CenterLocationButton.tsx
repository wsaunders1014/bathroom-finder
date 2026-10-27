import Image from "next/image";

type CenterLocationButtonProps = {
  onClick: () => void;
};

export default function CenterLocationButton({
  onClick,
}: CenterLocationButtonProps) {
  return (
    <button
      className="absolute bottom-28 right-6 z-[1000] cursor-pointer rounded-[32px] border border-black bg-gray-200 p-3 hover:bg-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
      type="button"
      aria-label="Center on my location"
      onClick={onClick}
      
    >
      <Image
        src="/icons/center-location.svg"
        alt=""
        width={44}
        height={44}
        draggable={false}
      />
    </button>
  );
}
