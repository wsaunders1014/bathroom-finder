"use client";

import dynamic from "next/dynamic";
import type { Bathroom } from "@/types/bathroom";
type BathroomMapLoaderProps = {
  bathrooms: Bathroom[];
  isSignedIn: boolean;
}
const BathroomMap = dynamic(() => import("./BathroomMap"), {
  ssr: false,
  loading: () => <p>Loading map…</p>,
});

export default function BathroomMapLoader({bathrooms,isSignedIn}:BathroomMapLoaderProps) {
  return <BathroomMap bathrooms={bathrooms} isSignedIn={isSignedIn}/>;
}