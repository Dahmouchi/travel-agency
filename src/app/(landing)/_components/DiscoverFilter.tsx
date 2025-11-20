/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import FlightCard from "@/components/discover/FlightCard";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function TourList({ tourNational }: { tourNational: any[] }) {
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Extract unique cities from tours
  const cityOptions = useMemo(() => {
    const uniqueCities = Array.from(
      new Set(
        tourNational
          .map((tour) => tour.ville)
          .filter((ville) => typeof ville === "string" && ville.trim() !== "")
      )
    );
    return uniqueCities.map((city) => ({
      value: city,
      label: city,
    }));
  }, [tourNational]);

  // Filter tours by selected city
  const filteredTours = selectedCity
    ? tourNational.filter(
        (tour) =>
          tour.ville?.toLowerCase().trim() === selectedCity.toLowerCase().trim()
      )
    : tourNational;

  return (
    <div className="w-full min-h-[90vh] px-4 py-3 space-y-6">
      {/* Filter section */}
      <div className="max-w-md space-y-2">
        <Label>Filtrer par ville</Label>
        <Select
          options={cityOptions}
          value={cityOptions.find((o) => o.value === selectedCity) ?? null}
          onChange={(opt: any) => setSelectedCity(opt?.value ?? "")}
          isClearable
          isSearchable
          placeholder="Choisir une ville..."
          noOptionsMessage={() => "Aucune ville trouvée"}
        />
      </div>

      {/* Tours grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full h-full">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
            <div className="w-full h-full" key={tour.id}>
              <FlightCard
                img={tour.imageUrl}
                departure={tour.villeDepart}
                name={tour.description}
                oneway={tour.durationDays}
                destination={tour.title}
                ville={tour.ville}
                tourid={tour.id}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3 mt-6">
            Aucun tour trouvé pour cette ville.
          </p>
        )}
      </div>
    </div>
  );
}
