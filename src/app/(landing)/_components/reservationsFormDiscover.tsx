/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {CreateReservationsDiscoverr } from "@/actions/reservationsActions";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});
import success from "../../../../public/success.json";
export default function ReservationsFormDiscover({
  fields,
  tourId,
  travelDates = [],
  basePrice,
}: any) {
  // Filter dates to only include future dates (including today)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const filteredTravelDates = travelDates.filter((date: any) => {
    const start = new Date(date.startDate);
    start.setHours(0, 0, 0, 0);
    return start >= now;
  });

  const [formData, setFormData] = useState<any>({
    nom: "",
    prenom: "",
    phone: "",
    email: "",
    travelDateId: filteredTravelDates[0]?.id || "",
    numberOfAdults: 1,
    customFields: {},
  });

  // Change basePrice to be stateful
  const [currentBasePrice, setCurrentBasePrice] = useState(basePrice);
  const [finalPrice, setFinalPrice] = useState<any>(basePrice);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [conditions, setCondition] = useState(false);

  // Update base price when travelDateId changes
  useEffect(() => {
    const selectedDate = filteredTravelDates.find(
      (d: any) => d.id === formData.travelDateId
    );
    if (selectedDate && selectedDate.price) {
      setCurrentBasePrice(selectedDate.price);
    } else {
      setCurrentBasePrice(basePrice);
    }
  }, [formData.travelDateId, filteredTravelDates, basePrice]);

  // Recalculate final price when form data or base price changes
  useEffect(() => {
    const newPrice = calculateFinalPrice();
    setFinalPrice(newPrice);
  }, [formData, currentBasePrice, fields]);

  const calculateFinalPrice = () => {
    let total = currentBasePrice * formData.numberOfAdults;

    for (const field of fields) {
      if (field.type === "checkbox" && formData.customFields[field.name]) {
        const count = Number(formData.customFields[`${field.name}_count`] || 1);
        total += count * Number(field.price || 0);
      }

      if (field.type === "select") {
        const selectedOption = field.options.find(
          (opt: any) => opt.value === formData.customFields[field.name]
        );
        if (selectedOption) {
          total += Number(selectedOption?.price || 0);
        }
      }
    }
    return total;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (
      [
        "nom",
        "prenom",
        "phone",
        "email",
        "travelDateId",
        "numberOfAdults",
      ].includes(name)
    ) {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        customFields: { ...prev.customFields, [name]: value },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await CreateReservationsDiscoverr({
        tourId,
        travelDateId: formData.travelDateId,
        nom: formData.nom,
        prenom: formData.prenom,
        phone: formData.phone,
        email: formData.email,
        data: {
          ...formData.customFields,
          numberOfAdults: formData.numberOfAdults,
        },
        basePrice: currentBasePrice,
        finalPrice: finalPrice,
      });

      toast.success("Demande de réservation envoyée !");
      setFormData({
        nom: "",
        prenom: "",
        phone: "",
        email: "",
        travelDateId: filteredTravelDates[0]?.id || "",
        numberOfAdults: 1,
        customFields: {},
      });
      setFinalPrice(basePrice);
      setIsSubmitted(true);

      setTimeout(() => setIsSubmitted(false), 10000);
    } catch (error) {
      console.error("Failed to submit reservation:", error);
      toast.error("Erreur lors de l'envoi de la réservation.");
    }
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto p-4 md:p-8 font-sans"
      id="reservation-form"
    >
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 md:gap-12 items-start">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100">
          {/* Form Header */}
          <div
            className="mb-6 pb-4 border-b border-gray-200"
            style={{
              backgroundColor: "#8ebd21",
              color: "white",
              padding: "1rem",
              borderRadius: "8px 8px 0 0",
              marginTop: "-1.5rem",
              marginLeft: "-2rem",
              marginRight: "-2rem",
            }}
          >
            <h2 className="text-2xl font-bold text-center">RÉSERVATION</h2>
            <div className="flex justify-center mt-1">
              <span className="w-3 h-1 bg-yellow-400 rounded-full mr-1"></span>
              <span className="w-8 h-1 bg-yellow-500 rounded-full"></span>
            </div>
          </div>

          {isSubmitted ? (
            <div className="w-full justify-center flex ">
              <div
                className=" text-green-700 px-4 py-3 rounded relative w-full flex flex-col items-center justify-center"
                role="alert"
              >
                <LottiePlayer
                  loop={false}
                  animationData={success}
                  play
                  className="w-1/3"
                />

                <span className="block sm:inline">
                  {" "}
                  Nous vous contacterons très bientôt pour confirmer les
                  disponibilités des places et finaliser votre réservation.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Default fields */}
                <input
                name="nom"
                placeholder="Nom *"
                onChange={handleChange}
                required
                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none"
              />
              <input
                name="prenom"
                placeholder="Prénom *"
                onChange={handleChange}
                required
                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none"
              />
              <input
                name="phone"
                placeholder="Téléphone *"
                onChange={handleChange}
                required
                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none"
              />
              <input
                name="email"
                type="email"
                placeholder="Email *"
                onChange={handleChange}
                required
                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Nombre de personnes *
              </label>
              <input
                type="number"
                name="numberOfAdults"
                min="1"
                value={formData.numberOfAdults}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

             

                {/* Dynamic custom fields */}
                {fields.map((field: any, index: number) => {
                  if (field.type === "text") {
                    return (
                      <div className="space-y-1" key={index}>
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          placeholder={field.placeholder || field.label}
                          onChange={handleChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                          required={field.required}
                        />
                      </div>
                    );
                  }

                  if (field.type === "checkbox") {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between lg:flex-row flex-col gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-white shadow-sm"
                      >
                        <div className="flex items-center  gap-3 flex-1">
                          <div className="flex items-center ">
                            <input
                              type="checkbox"
                              id={`checkbox-${field.name}`}
                              name={field.name}
                              checked={formData.customFields[field.name]}
                              onChange={(e) =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  customFields: {
                                    ...prev.customFields,
                                    [field.name]: e.target.checked,
                                    [`${field.name}_count`]: e.target.checked
                                      ? prev.customFields[
                                          `${field.name}_count`
                                        ] || 1
                                      : 1,
                                  },
                                }))
                              }
                              className="h-5 w-5 rounded accent-green-500 border-gray-300  cursor-pointer"
                            />
                          </div>
                          <label
                            htmlFor={`checkbox-${field.name}`}
                            className="block text-sm font-medium text-gray-700 cursor-pointer flex-1"
                          >
                            {field.label}{" "}
                            {field.price > 0 && (
                              <span className="text-red-500 ml-1">
                                +{field.price} MAD
                              </span>
                            )}
                          </label>
                        </div>

                        {formData.customFields[field.name] && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  customFields: {
                                    ...prev.customFields,
                                    [`${field.name}_count`]: Math.max(
                                      1,
                                      (prev.customFields[
                                        `${field.name}_count`
                                      ] || 1) - 1
                                    ),
                                  },
                                }))
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={
                                formData.customFields[`${field.name}_count`] <=
                                1
                              }
                            >
                              <span className="sr-only">Diminuer</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>

                            <input
                              type="number"
                              name={`${field.name}_count`}
                              min="1"
                              value={
                                formData.customFields[`${field.name}_count`]
                              }
                              onChange={(e) =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  customFields: {
                                    ...prev.customFields,
                                    [`${field.name}_count`]: Math.max(
                                      1,
                                      Number(e.target.value) || 1
                                    ),
                                  },
                                }))
                              }
                              className="w-12 text-center border-0 p-0 bg-transparent text-gray-900 focus:ring-0 font-medium text-sm"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  customFields: {
                                    ...prev.customFields,
                                    [`${field.name}_count`]:
                                      (prev.customFields[
                                        `${field.name}_count`
                                      ] || 1) + 1,
                                  },
                                }))
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <span className="sr-only">Augmenter</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (field.type === "select") {
                    return (
                      <div className="space-y-1" key={index}>
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          onChange={handleChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white"
                          required={field.required}
                        >
                          <option value="">
                            -- Sélectionnez {field.label} --
                          </option>
                          {field.options.map((opt: any, i: number) => (
                            <option key={i} value={opt.value}>
                              {opt.label}{" "}
                              {opt.price > 0 ? `(+${opt.price} MAD)` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (field.type === "date") {
                    return (
                      <div className="space-y-1" key={index}>
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        <input
                          id={field.name}
                          type="date"
                          name={field.name}
                          onChange={handleChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                          required={field.required}
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    );
                  }

                  return null;
                })}

              {/* Booking summary */}
              <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  🧾 Résumé de la réservation
                </h3>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>
                      Prix de base ({formData.numberOfAdults} adultes)
                    </span>
                    <span className="font-medium">
                      {currentBasePrice} MAD × {formData.numberOfAdults} ={" "}
                      {currentBasePrice * formData.numberOfAdults} MAD
                    </span>
                  </div>

                  {fields
                    .filter((field: any) => {
                      if (field.type === "checkbox") {
                        return formData.customFields[field.name];
                      }
                      if (field.type === "select") {
                        return formData.customFields[field.name];
                      }
                      return false;
                    })
                    .map((field: any, index: number) => {
                      if (field.type === "checkbox") {
                        return (
                          <div
                            className="flex justify-between py-2 border-b border-gray-100"
                            key={index}
                          >
                            <span>{field.label} </span>
                            <span className="font-medium">
                              <span>{field.price} </span> ×{" "}
                              {formData.customFields[`${field.name}_count`]}=
                              {field.price *
                                formData.customFields[
                                  `${field.name}_count`
                                ]}{" "}
                              MAD
                            </span>
                          </div>
                        );
                      }
                      if (field.type === "select") {
                        const selected = field.options.find(
                          (opt: any) =>
                            opt.value === formData.customFields[field.name]
                        );

                        return selected?.price > 0 ? (
                          <div
                            className="flex justify-between py-2 border-b border-gray-100"
                            key={index}
                          >
                            <span>
                              {field.label}: {selected.label}
                            </span>
                            <span className="font-medium">
                              +{selected.price} MAD
                            </span>
                          </div>
                        ) : null;
                      }

                      return null;
                    })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-green-500">
                      {finalPrice} MAD
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={conditions}
                  onChange={(e) => setCondition(e.target.checked)}
                  className="mt-1"
                  required
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  J&apos;accepte les{" "}
                  <a
                    href="/conditions-generales"
                    target="_blank"
                    className="text-green-600 underline"
                  >
                    conditions générales de vente
                  </a>
                </label>
              </div>
              <button
                type="submit"
                disabled={!conditions}
                className="w-full mt-4 cursor-pointer text-lg font-semibold rounded-md py-2"
                style={{ backgroundColor: "#8ebd21", color: "white" }}
              >
                Réserver
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
