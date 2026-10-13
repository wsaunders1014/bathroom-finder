"use client";

import dynamic from "next/dynamic";

const BathroomMap = dynamic(() => import("./BathroomMap"), {
  ssr: false,
  loading: () => <p>Loading map…</p>,
});

export default function BathroomMapLoader() {
  return <BathroomMap />;
}