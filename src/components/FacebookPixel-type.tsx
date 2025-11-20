// components/PixelTracker.ts
"use client";
import { useEffect } from "react";
import ReactPixel from "react-facebook-pixel";
const PixelTracker = () => {
  useEffect(() => {
    const pixelId = "278574490489711";
    ReactPixel.init(pixelId);
    ReactPixel.pageView();
  }, []);
  return null;
};
export default PixelTracker;