/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { components } from "react-select";
import ReactCountryFlag from "react-country-flag";
import { Label } from "@/components/ui/label";
import { City } from "country-state-city";
import { Controller } from "react-hook-form";

// Dynamically import react-select to avoid SSR errors
const Select = dynamic(() => import("react-select"), { ssr: false });

type Option = { value: string; label: string };

interface CityPickerProps {
  control: any; // from useForm()
  name?: string; // field name in the form, defaults to "ville"
}

export default function CityPicker({ control, name = "ville" }: CityPickerProps) {
  const [cityOptions, setCityOptions] = useState<Option[]>([]);

  useEffect(() => {
    // Load only Moroccan cities
    const moroccanCities = City.getCitiesOfCountry("MA") || [];
    const options = moroccanCities.map((city: any) => ({
      value: city.name,
      label: city.name,
    }));
    setCityOptions(options);
  }, []);

  // Custom rendering for options (with flag)
  const CityOption = (props: any) => (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode="MA"
          svg
          style={{ width: "1.2em", height: "1.2em" }}
        />
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode="MA"
          svg
          style={{ width: "1.1em", height: "1.1em" }}
        />
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>Ville Pour le filtre*</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            inputId={name}
            options={cityOptions}
            value={cityOptions.find((o) => o.value === field.value) ?? null}
            onChange={(opt: any) => field.onChange(opt?.value ?? "")}
            components={{ Option: CityOption, SingleValue }}
            isClearable
            isSearchable
            placeholder="Choisir ou rechercher une ville..."
            noOptionsMessage={() => "Aucune ville trouvée"}
          />
        )}
      />
    </div>
  );
}
