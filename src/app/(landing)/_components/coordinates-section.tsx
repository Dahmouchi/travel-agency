/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

interface CoordinatesSectionProps {
  formData: any
  onChange: (field: string, value: string) => void
}

export default function CoordinatesSection({ formData, onChange }: CoordinatesSectionProps) {
  return (
       <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Titre <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="title"
              value="Mr"
              checked={formData.title === "Mr"}
              onChange={(e) => onChange("title", e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-gray-900">Mr</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="title"
              value="Mme"
              checked={formData.title === "Mme"}
              onChange={(e) => onChange("title", e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-gray-900">Mme</span>
          </label>
        </div>
      </div>

      {/* First and Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Votre prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Votre prénom"
            className="w-full px-0 py-2 border-b-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Votre nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Votre nom"
            className="w-full px-0 py-2 border-b-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Votre email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="votre email"
          className="w-full px-0 py-2 border-b-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-400"
        />
      </div>

      {/* Phone */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Indicatif <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={formData.countryCode}
              onChange={(e) => onChange("countryCode", e.target.value)}
              className="flex-1 px-0 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400"
            />
            <span className="text-yellow-400">×</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="ex : 06 12 34 56 78"
            className="w-full px-0 py-2 border-b-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>
    </div>
  )
}
