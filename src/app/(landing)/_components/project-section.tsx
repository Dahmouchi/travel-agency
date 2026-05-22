/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface ProjectSectionProps {
  formData: any;
  errors: any;
  onChange: (field: string, value: any) => void;
}

export default function ProjectSection({
  formData,
  errors,
  onChange,
}: ProjectSectionProps) {
  return (
    <div className="space-y-6">
      {/* Destination */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Destination <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => onChange("destination", e.target.value)}
              placeholder="Votre destination"
              className={`w-full px-0 py-2 border-b-2 ${
                errors.destination
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              } text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors`}
            />
            {errors.destination && (
              <div className="mt-2 inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">
                Destination non renseignée
              </div>
            )}
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Date de départ <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => onChange("departureDate", e.target.value)}
                className="flex-1 px-0 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Date de retour <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => onChange("returnDate", e.target.value)}
                className="flex-1 px-0 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Flexible Travel */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Je suis flexible <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="flexible"
                  value="oui"
                  checked={formData.isFlexible === "oui"}
                  onChange={(e) => onChange("isFlexible", e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-900">Oui</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="flexible"
                  value="non"
                  checked={formData.isFlexible === "non"}
                  onChange={(e) => onChange("isFlexible", e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-900">Non</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Ville de départ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.departureCity}
              onChange={(e) => onChange("departureCity", e.target.value)}
              placeholder="votre ville de départ"
              className="w-full px-0 py-2 border-b-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Needs Transport */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              J&apos;aurai besoin de transport{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="transport"
                  value="oui"
                  checked={formData.needsTransport === "oui"}
                  onChange={(e) => onChange("needsTransport", e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-900">Oui</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="transport"
                  value="non"
                  checked={formData.needsTransport === "non"}
                  onChange={(e) => onChange("needsTransport", e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-900">Non</span>
              </label>
            </div>
          </div>
        </div>
        {/* ------------------------------------------- */}
        <div className="space-y-6">
          {/* Needs Flight */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              J&apos;aurai besoin de vol (Si le voyage est international){" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="flight"
                  value="oui"
                  checked={formData.needsFlight === "oui"}
                  onChange={(e) => onChange("needsFlight", e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-900">Oui</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="flight"
                  value="non"
                  checked={formData.needsFlight === "non"}
                  onChange={(e) => onChange("needsFlight", e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-900">Non</span>
              </label>
            </div>
          </div>

          {/* Adults and Children */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Adults */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Adultes (+12) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange("adults", Math.max(0, formData.adults - 1))
                  }
                  className="w-8 h-8 flex items-center justify-center bg-[#8ebd21] text-white rounded"
                >
                  −
                </button>
                <input
                  type="number"
                  value={formData.adults}
                  onChange={(e) => onChange("adults", Number(e.target.value))}
                  className="flex-1 text-center px-2 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onChange("adults", formData.adults + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-[#8ebd21] text-white rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Enfants (-12) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange("children", Math.max(0, formData.children - 1))
                  }
                  className="w-8 h-8 flex items-center justify-center bg-[#8ebd21] text-white rounded"
                >
                  −
                </button>
                <input
                  type="number"
                  value={formData.children}
                  onChange={(e) => onChange("children", Number(e.target.value))}
                  className="flex-1 text-center px-2 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onChange("children", formData.children + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-[#8ebd21] text-white rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Accommodation Wishes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Détaillez vos souhaits d&apos;hébergement sur place
            </label>
            <textarea
              value={formData.accommodationWishes}
              onChange={(e) => onChange("accommodationWishes", e.target.value)}
              placeholder="Décrivez vos préférences d'hébergement..."
              className="w-full h-24 p-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Number of Rooms and Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nombre de chambres
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      "numberOfRooms",
                      Math.max(1, formData.numberOfRooms - 1),
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center bg-[#8ebd21] text-white rounded"
                >
                  −
                </button>
                <input
                  type="number"
                  value={formData.numberOfRooms}
                  onChange={(e) =>
                    onChange("numberOfRooms", Number(e.target.value))
                  }
                  className="flex-1 text-center px-2 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange("numberOfRooms", formData.numberOfRooms + 1)
                  }
                  className="w-8 h-8 flex items-center justify-center bg-[#8ebd21] text-white rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Catégorie
              </label>
              <select
                value={formData.accommodationCategory}
                onChange={(e) =>
                  onChange("accommodationCategory", e.target.value)
                }
                className="w-full px-3 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 bg-white"
              >
                <option value="Bivouac">Bivouac</option>
                <option value="Standard">Standard</option>
                <option value="Confort">Confort</option>
                <option value="Luxe">Luxe</option>
              </select>
            </div>
          </div>

          {/* Budget Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Budget (par personne): {formData.budget} MAD{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="range"
              min="2800"
              max="100000"
              value={formData.budget}
              onChange={(e) => onChange("budget", Number(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-xl appearance-none cursor-pointer accent-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
