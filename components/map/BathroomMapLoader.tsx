"use client";

import dynamic from "next/dynamic";
import type { Bathroom } from "@/types/bathroom";
import MapSkeleton from "./MapSkeleton";
type BathroomMapLoaderProps = {
  bathroomsPromise: Promise<Bathroom[]>;
  isSignedIn: boolean;
}
const BathroomMap = dynamic(() => import("./BathroomMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export default function BathroomMapLoader({bathroomsPromise,isSignedIn}:BathroomMapLoaderProps) {
  return <BathroomMap bathroomsPromise={bathroomsPromise} isSignedIn={isSignedIn}/>;
}