/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from "next/dynamic";
import { City } from "country-state-city";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const Select = dynamic(() => import("react-select"), { ssr: false });

export function CitySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [cityOptions, setCityOptions] = useState<any>([]);

  useEffect(() => {
    const cities = City.getCitiesOfCountry("MA") || [];
    setCityOptions(cities.map((c: any) => ({ value: c.name, label: c.name })));
  }, []);

  return (
    <div className="space-y-2">
      <Label>Filtrer par ville</Label>
      <Select
        value={cityOptions.find((o:any) => o.value === value) ?? null}
        options={cityOptions}
        onChange={(opt: any) => onChange(opt?.value ?? "")}
        isClearable
        isSearchable
        placeholder="Choisir une ville..."
      />
    </div>
  );
}
