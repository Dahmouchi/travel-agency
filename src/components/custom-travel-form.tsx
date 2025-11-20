"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FormData {
  destination: string
  departureDate: string
  returnDate: string
  flexible: string
  departureCity: string
  transport: string
  flight: string
  adults: string
  children: string
  bedrooms: string
  accommodationType: string
  budget: string
  title: string
  firstName: string
  lastName: string
  email: string
  countryCode: string
  phone: string
  message: string
}

interface CustomTravelFormProps {
  onSubmitSuccess: () => void
}

export function CustomTravelForm({ onSubmitSuccess }: CustomTravelFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    destination: "",
    departureDate: "",
    returnDate: "",
    flexible: "",
    departureCity: "",
    transport: "",
    flight: "",
    adults: "",
    children: "",
    bedrooms: "",
    accommodationType: "",
    budget: "",
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phone: "",
    message: "",
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Partial<FormData> = {}

    if (currentStep === 1) {
      if (!formData.destination) newErrors.destination = "Destination est requis"
      if (!formData.departureDate) newErrors.departureDate = "Date de départ est requise"
      if (!formData.returnDate) newErrors.returnDate = "Date de retour est requise"
      if (!formData.flexible) newErrors.flexible = "Sélectionnez votre flexibilité"
    }

    if (currentStep === 2) {
      if (!formData.departureCity) newErrors.departureCity = "Ville de départ est requise"
      if (!formData.transport) newErrors.transport = "Sélectionnez transport"
      if (!formData.flight) newErrors.flight = "Sélectionnez vol"
      if (!formData.adults) newErrors.adults = "Nombre d'adultes est requis"
      if (!formData.bedrooms) newErrors.bedrooms = "Nombre de chambres est requis"
      if (!formData.accommodationType) newErrors.accommodationType = "Type d'hébergement est requis"
      if (!formData.budget) newErrors.budget = "Budget est requis"
    }

    if (currentStep === 3) {
      if (!formData.title) newErrors.title = "Titre est requis"
      if (!formData.firstName) newErrors.firstName = "Prénom est requis"
      if (!formData.lastName) newErrors.lastName = "Nom est requis"
      if (!formData.email) newErrors.email = "Email est requis"
      if (!formData.countryCode) newErrors.countryCode = "Indicatif est requis"
      if (!formData.phone) newErrors.phone = "Téléphone est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(3)) {
      // Here you would typically send the form data to your backend
      console.log("Form submitted:", formData)
      onSubmitSuccess()
    }
  }

  const renderError = (fieldName: keyof FormData) => {
    return errors[fieldName] ? <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p> : null
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Step 1: Destination & Dates */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-6">Étape 1 : Votre destination</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
            <Input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Ex: Maroc, Égypte, Thaïlande..."
              className={errors.destination ? "border-red-500" : ""}
            />
            {renderError("destination")}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de départ *</label>
              <Input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                className={errors.departureDate ? "border-red-500" : ""}
              />
              {renderError("departureDate")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de retour *</label>
              <Input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className={errors.returnDate ? "border-red-500" : ""}
              />
              {renderError("returnDate")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Je suis flexible *</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="flexible"
                  value="yes"
                  checked={formData.flexible === "yes"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Oui
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="flexible"
                  value="no"
                  checked={formData.flexible === "no"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Non
              </label>
            </div>
            {renderError("flexible")}
          </div>
        </div>
      )}

      {/* Step 2: Transport & Accommodation */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-6">Étape 2 : Transport & Hébergement</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ville de départ *</label>
            <Input
              type="text"
              name="departureCity"
              value={formData.departureCity}
              onChange={handleChange}
              placeholder="Ex: Paris, Lyon, Marseille..."
              className={errors.departureCity ? "border-red-500" : ""}
            />
            {renderError("departureCity")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">J&apos;aurai besoin de transport *</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transport"
                  value="yes"
                  checked={formData.transport === "yes"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Oui
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transport"
                  value="no"
                  checked={formData.transport === "no"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Non
              </label>
            </div>
            {renderError("transport")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              J&apos;aurai besoin de vol (international) *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="flight"
                  value="yes"
                  checked={formData.flight === "yes"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Oui
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="flight"
                  value="no"
                  checked={formData.flight === "no"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Non
              </label>
            </div>
            {renderError("flight")}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adultes (+12) *</label>
              <Input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleChange}
                placeholder="0"
                min="1"
                className={errors.adults ? "border-red-500" : ""}
              />
              {renderError("adults")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enfants (-12) *</label>
              <Input
                type="number"
                name="children"
                value={formData.children}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={errors.children ? "border-red-500" : ""}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de chambres *</label>
              <Input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="0"
                min="1"
                className={errors.bedrooms ? "border-red-500" : ""}
              />
              {renderError("bedrooms")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie d&apos;hébergement *</label>
              <select
                name="accommodationType"
                value={formData.accommodationType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 ${
                  errors.accommodationType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Sélectionnez...</option>
                <option value="bivouac">Bivouac</option>
                <option value="standard">Standard</option>
                <option value="confort">Confort</option>
                <option value="luxe">Luxe</option>
              </select>
              {renderError("accommodationType")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget (par personne) *</label>
            <Input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Ex: 2000 EUR"
              className={errors.budget ? "border-red-500" : ""}
            />
            {renderError("budget")}
          </div>
        </div>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-6">Étape 3 : Vos coordonnées</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="title"
                  value="mr"
                  checked={formData.title === "mr"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Mr
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="title"
                  value="mme"
                  checked={formData.title === "mme"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Mme
              </label>
            </div>
            {renderError("title")}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
                className={errors.firstName ? "border-red-500" : ""}
              />
              {renderError("firstName")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
                className={errors.lastName ? "border-red-500" : ""}
              />
              {renderError("lastName")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {renderError("email")}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Indicatif *</label>
              <Input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                placeholder="+33"
                className={errors.countryCode ? "border-red-500" : ""}
              />
              {renderError("countryCode")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="6 XX XX XX XX"
                className={errors.phone ? "border-red-500" : ""}
              />
              {renderError("phone")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message (optionnel)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Dites-nous ce qui vous intéresse particulièrement..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button
          type="button"
          onClick={handlePrevious}
          variant="outline"
          disabled={step === 1}
          className="disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
        >
          Précédent
        </Button>

        <div className="text-sm text-gray-600">Étape {step} / 3</div>

        {step === 3 ? (
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Envoyer la demande
          </Button>
        ) : (
          <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
            Suivant
          </Button>
        )}
      </div>
    </form>
  )
}
