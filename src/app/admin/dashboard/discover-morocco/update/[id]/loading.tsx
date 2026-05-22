/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      {/* Logo image */}
      <img
        src="/horizontal1.png"
        alt="Logo"
        className="w-40 h-40 object-contain"
      />

      {/* Loader spinner */}
      <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

      {/* Loading text */}
      <p className="text-gray-500 text-lg">Chargement en cours...</p>
    </div>
  );
}
