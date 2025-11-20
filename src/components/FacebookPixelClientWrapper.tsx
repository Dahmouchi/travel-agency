// components/FacebookPixelClientWrapper.tsx
"use client";
import { Suspense } from "react";
import FacebookPixel from "./FacebookPixel";

export default function FacebookPixelWrapper() {
  return (
    <Suspense fallback={null}>
      <FacebookPixel />
    </Suspense>
  );
}

