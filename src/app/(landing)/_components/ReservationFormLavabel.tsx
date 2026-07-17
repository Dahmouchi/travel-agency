/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Users,
  Calendar,
  Minus,
  Plus,
  Receipt,
  Sparkles,
  CheckCircle2,
  FileText,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CreateReservations } from "@/actions/reservationsActions";

interface ReservationFormRedesignedProps {
  fields?: any[];
  tourId?: string;
  travelDates?: any[];
  basePrice?: number;
  onSubmit?: (data: any) => Promise<void>;
}

export default function ReservationFormRedesigned({
  fields = [],
  tourId = "",
  travelDates = [],
  basePrice = 0,
  onSubmit,
}: ReservationFormRedesignedProps) {
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

  const [currentBasePrice, setCurrentBasePrice] = useState(basePrice);
  const [finalPrice, setFinalPrice] = useState<any>(basePrice);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [conditions, setCondition] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Split fields: required fields go in main form, non-required go in "Options"
  const requiredFields = fields.filter((f: any) => f.required);
  const optionalFields = fields.filter((f: any) => !f.required);

  // Update base price when travelDateId changes
  useEffect(() => {
    const selectedDate = filteredTravelDates.find(
      (d: any) => d.id === formData.travelDateId,
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
        const selectedOption = field.options?.find(
          (opt: any) => opt.value === formData.customFields[field.name],
        );
        if (selectedOption) {
          total += Number(selectedOption?.price || 0);
        }
      }
    }
    return total;
  };

  const handleChange = (name: string, value: any) => {
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
    setIsSubmitting(true);

    try {
      await CreateReservations({
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
    } finally {
      setIsSubmitting(false);
    }
  };

  function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // Render a dynamic field (text, select, date, checkbox) — reused for both required & optional sections
  const renderField = (field: any, index: number) => {
    if (field.type === "text") {
      return (
        <div className="space-y-1.5" key={index}>
          <Label
            htmlFor={field.name}
            className="text-sm font-medium text-gray-700 flex items-center gap-1"
          >
            {field.label}
            {field.required && <span className="text-red-500 text-xs">*</span>}
          </Label>
          <Input
            id={field.name}
            name={field.name}
            placeholder={field.placeholder || field.label}
            value={formData.customFields[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="h-11 bg-white border-gray-200 focus:border-[#8EBD22] focus:ring-[#8EBD22]/20 rounded-xl transition-all text-sm"
            required={field.required}
          />
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div className="space-y-1.5" key={index}>
          <Label
            htmlFor={field.name}
            className="text-sm font-medium text-gray-700 flex items-center gap-1"
          >
            {field.label}
            {field.required && <span className="text-red-500 text-xs">*</span>}
          </Label>
          <Select
            value={formData.customFields[field.name] || ""}
            onValueChange={(value) => handleChange(field.name, value)}
            required={field.required}
          >
            <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-[#8EBD22] rounded-xl text-sm">
              <SelectValue placeholder={`Sélectionnez ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt: any, i: number) => (
                <SelectItem key={i} value={opt.value}>
                  {opt.label} {opt.price > 0 ? `(+${opt.price} MAD)` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (field.type === "date") {
      return (
        <div className="space-y-1.5" key={index}>
          <Label
            htmlFor={field.name}
            className="text-sm font-medium text-gray-700 flex items-center gap-1"
          >
            {field.label}
            {field.required && <span className="text-red-500 text-xs">*</span>}
          </Label>
          <Input
            id={field.name}
            type="date"
            name={field.name}
            value={formData.customFields[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="h-11 bg-white border-gray-200 focus:border-[#8EBD22] focus:ring-[#8EBD22]/20 rounded-xl transition-all text-sm"
            required={field.required}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <div
          key={index}
          className={cn(
            "col-span-1 md:col-span-2 p-4 rounded-xl border transition-all duration-200",
            formData.customFields[field.name]
              ? "border-[#8EBD22] bg-[#8EBD22]/5"
              : "border-gray-200 bg-white hover:border-gray-300",
          )}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id={`checkbox-${field.name}`}
                checked={formData.customFields[field.name] || false}
                onCheckedChange={(checked) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    customFields: {
                      ...prev.customFields,
                      [field.name]: checked,
                      [`${field.name}_count`]: checked
                        ? prev.customFields[`${field.name}_count`] || 1
                        : 1,
                    },
                  }))
                }
                className="w-5 h-5 rounded-lg border-2"
              />
              <label
                htmlFor={`checkbox-${field.name}`}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {field.label}
                {field.price > 0 && (
                  <span className="ml-2 text-[#8EBD22] font-semibold text-xs">
                    +{field.price} MAD
                  </span>
                )}
              </label>
            </div>

            <AnimatePresence>
              {formData.customFields[field.name] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 rounded-lg border-gray-200"
                    onClick={() =>
                      setFormData((prev: any) => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          [`${field.name}_count`]: Math.max(
                            1,
                            (prev.customFields[`${field.name}_count`] || 1) - 1,
                          ),
                        },
                      }))
                    }
                    disabled={formData.customFields[`${field.name}_count`] <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="w-10 text-center font-semibold text-sm">
                    {formData.customFields[`${field.name}_count`] || 1}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 rounded-lg border-gray-200"
                    onClick={() =>
                      setFormData((prev: any) => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          [`${field.name}_count`]:
                            (prev.customFields[`${field.name}_count`] || 1) + 1,
                        },
                      }))
                    }
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    }

    return null;
  };

  // Section step numbers
  const hasRequiredFields = requiredFields.length > 0;
  const hasOptionalFields = optionalFields.length > 0;
  const travelStep = 2;
  const requiredStep = hasRequiredFields ? 3 : -1;
  const optionalStep = hasOptionalFields ? (hasRequiredFields ? 4 : 3) : -1;

  return (
    <div
      className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-6"
      id="reservation-form"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Form Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Réservez votre voyage
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base max-w-md mx-auto">
            Remplissez le formulaire ci-dessous pour réserver votre place
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-8 md:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Réservation envoyée !
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">
                Nous vous contacterons très bientôt pour confirmer les
                disponibilités et finaliser votre réservation.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* ── Section 1: Personal Information ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                  <div className="w-7 h-7 rounded-lg bg-[#8EBD22] flex items-center justify-center text-white text-xs font-bold">
                    1
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Informations personnelles
                  </h3>
                </div>
                <div className="p-5 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="nom"
                        className="text-sm font-medium text-gray-700"
                      >
                        Nom <span className="text-red-500 text-xs">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="nom"
                          name="nom"
                          placeholder="Votre nom"
                          value={formData.nom}
                          onChange={(e) => handleChange("nom", e.target.value)}
                          className="pl-9 h-11 bg-white border-gray-200 focus:border-[#8EBD22] focus:ring-[#8EBD22]/20 rounded-xl transition-all text-sm"
                          required
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="prenom"
                        className="text-sm font-medium text-gray-700"
                      >
                        Prénom <span className="text-red-500 text-xs">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="prenom"
                          name="prenom"
                          placeholder="Votre prénom"
                          value={formData.prenom}
                          onChange={(e) =>
                            handleChange("prenom", e.target.value)
                          }
                          className="pl-9 h-11 bg-white border-gray-200 focus:border-[#8EBD22] focus:ring-[#8EBD22]/20 rounded-xl transition-all text-sm"
                          required
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Téléphone{" "}
                        <span className="text-red-500 text-xs">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Votre téléphone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className="pl-9 h-11 bg-white border-gray-200 focus:border-[#8EBD22] focus:ring-[#8EBD22]/20 rounded-xl transition-all text-sm"
                          required
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email <span className="text-red-500 text-xs">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Votre email"
                          value={formData.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          className="pl-9 h-11 bg-white border-gray-200 focus:border-[#8EBD22] focus:ring-[#8EBD22]/20 rounded-xl transition-all text-sm"
                          required
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Travel Details ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                  <div className="w-7 h-7 rounded-lg bg-[#8EBD22] flex items-center justify-center text-white text-xs font-bold">
                    {travelStep}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Détails du voyage
                  </h3>
                </div>
                <div className="p-5 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="numberOfAdults"
                        className="text-sm font-medium text-gray-700"
                      >
                        Nombre d&apos;adultes{" "}
                        <span className="text-red-500 text-xs">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="numberOfAdults"
                          type="number"
                          name="numberOfAdults"
                          min="1"
                          value={formData.numberOfAdults}
                          onChange={(e) =>
                            handleChange(
                              "numberOfAdults",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="pl-9 h-11 bg-white border-gray-200 focus:border-[#8EBD22] focus:ring-[#8EBD22]/20 rounded-xl transition-all text-sm"
                          required
                        />
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {filteredTravelDates.length > 0 && (
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="travelDateId"
                          className="text-sm font-medium text-gray-700"
                        >
                          Date disponible{" "}
                          <span className="text-red-500 text-xs">*</span>
                        </Label>
                        <Select
                          value={formData.travelDateId}
                          onValueChange={(value) =>
                            handleChange("travelDateId", value)
                          }
                        >
                          <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-[#8EBD22] rounded-xl text-sm">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <SelectValue placeholder="Sélectionner une date" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredTravelDates.map((d: any) => (
                              <SelectItem value={d.id} key={d.id}>
                                {formatDate(d.startDate)} -{" "}
                                {formatDate(d.endDate)} - {d?.price} MAD
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Section 3: Required Custom Fields ── */}
              {hasRequiredFields && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                    <div className="w-7 h-7 rounded-lg bg-[#8EBD22] flex items-center justify-center text-white text-xs font-bold">
                      {requiredStep}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Informations requises
                    </h3>
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {requiredFields.map((field: any, index: number) =>
                        renderField(field, index),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Section 4: Optional Custom Fields ── */}
              {hasOptionalFields && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                    <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">
                      {optionalStep}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        Options supplémentaires
                      </h3>
                      <p className="text-xs text-gray-400">Facultatif</p>
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {optionalFields.map((field: any, index: number) =>
                        renderField(field, index),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Booking Summary ── */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                  <div className="w-7 h-7 rounded-lg bg-[#47663B] flex items-center justify-center">
                    <Receipt className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Résumé de la réservation
                  </h3>
                </div>
                <div className="p-5 md:p-6 space-y-3">
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-100/80">
                    <span className="text-sm text-gray-500">
                      Prix de base ({formData.numberOfAdults}{" "}
                      {formData.numberOfAdults > 1 ? "adultes" : "adulte"})
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {currentBasePrice} × {formData.numberOfAdults} ={" "}
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
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-between items-center py-2.5 border-b border-gray-100/80"
                          >
                            <span className="text-sm text-gray-500">
                              {field.label}
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              {field.price} ×{" "}
                              {formData.customFields[`${field.name}_count`] ||
                                1}{" "}
                              ={" "}
                              {field.price *
                                (formData.customFields[`${field.name}_count`] ||
                                  1)}{" "}
                              MAD
                            </span>
                          </motion.div>
                        );
                      }
                      if (field.type === "select") {
                        const selected = field.options?.find(
                          (opt: any) =>
                            opt.value === formData.customFields[field.name],
                        );
                        return selected?.price > 0 ? (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-between items-center py-2.5 border-b border-gray-100/80"
                          >
                            <span className="text-sm text-gray-500">
                              {field.label}: {selected.label}
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              +{selected.price} MAD
                            </span>
                          </motion.div>
                        ) : null;
                      }
                      return null;
                    })}

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-base font-bold text-gray-900">
                      Total
                    </span>
                    <motion.span
                      key={finalPrice}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl md:text-3xl font-bold text-[#8EBD22]"
                    >
                      {finalPrice} MAD
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* ── Terms & Submit ── */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4">
                  <Checkbox
                    id="acceptTerms"
                    checked={conditions}
                    onCheckedChange={(checked) =>
                      setCondition(checked as boolean)
                    }
                    className="mt-0.5 w-5 h-5 rounded-md border-2"
                    required
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-500 cursor-pointer leading-relaxed"
                  >
                    J&apos;accepte les{" "}
                    <a
                      href="/conditions-generales-de-vente"
                      target="_blank"
                      className="text-[#8EBD22] hover:underline font-medium"
                    >
                      conditions générales de vente
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={!conditions || isSubmitting}
                  className="w-full h-12 md:h-14 text-base font-semibold rounded-xl bg-[#8EBD22] hover:bg-[#7aa91c] text-white shadow-[0_8px_30px_rgba(142,189,34,0.25)] hover:shadow-[0_8px_40px_rgba(142,189,34,0.4)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <span className="flex items-center gap-2">
                      Réserver maintenant
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Paiement et données sécurisés
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
