import Image from "next/image"
import { Suspense } from "react"
import TopBarAuth from "../auth/TopBarAuth"
export default function TopBar() {
  
  return (
    <header className="top-bar w-full absolute top-0 left-0 z-50 flex flex-row px-3 py-2 items-center justify-between">
      <div className="branding flex flex-row items-center gap-4">
        <Image
          alt="Pooey the PooPal Mascot - a loveable roll of toilet paper with a face."
          src="/icons/icon-pooey.svg"
          preload={true}
          width={32}
          height={38}
        />
        <h1 className="font-bold text-4xl text-(--brand-primary-blue)">PooPal</h1>
      </div>
      <div>
        <Suspense fallback={null}><TopBarAuth /></Suspense>
      </div>
    </header>
  )
}