import Image from "next/image"
export default function Brand() {
  return (
    <div className="branding absolute top-0 left-0 z-50 flex flex-row items-center gap-4 px-3 py-2">
      <Image
        alt="Pooey the PooPal Mascot - a loveable roll of toilet paper with a face."
        src="/icons/icon-pooey.svg"
        preload={true}
        width={32}
        height={38}
      />
      <h1 className="font-bold text-4xl text-(--brand-primary-blue)">PooPal</h1>
    </div>
  )
}
