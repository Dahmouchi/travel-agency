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
  Check,
  Minus,
  Plus,
  Receipt,
  Sparkles,
  CheckCircle2,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6" id="reservation-form">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8EBD22]/5 via-transparent to-accent/5 rounded-3xl blur-xl" />

        <div className="relative bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#8EBD22] to-[#8EBD22]/80 px-6 py-8 md:px-10 md:py-10">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Réservation
              </h2>
              <p className="text-white/80 mt-2 text-lg">
                Complétez le formulaire pour réserver votre voyage
              </p>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Réservation envoyée !
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto text-lg">
                    Nous vous contacterons très bientôt pour confirmer les
                    disponibilités des places et finaliser votre réservation.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center gap-3 mb-6"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#8EBD22]" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Informations personnelles
                      </h3>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label
                          htmlFor="nom"
                          className="text-sm font-medium text-foreground flex items-center gap-1"
                        >
                          Nom <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="nom"
                            name="nom"
                            placeholder="Votre nom"
                            value={formData.nom}
                            onChange={(e) =>
                              handleChange("nom", e.target.value)
                            }
                            className="pl-9 h-12 bg-background/50 border-border/50 focus:border-[#8EBD22] rounded-xl transition-all"
                            required
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label
                          htmlFor="prenom"
                          className="text-sm font-medium text-foreground flex items-center gap-1"
                        >
                          Prénom <span className="text-destructive">*</span>
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
                            className="pl-9 h-12 bg-background/50 border-border/50 focus:border-[#8EBD22] rounded-xl transition-all"
                            required
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium text-foreground flex items-center gap-1"
                        >
                          Téléphone <span className="text-destructive">*</span>
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
                            className="pl-9 h-12 bg-background/50 border-border/50 focus:border-[#8EBD22] rounded-xl transition-all"
                            required
                          />
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground flex items-center gap-1"
                        >
                          Email <span className="text-destructive">*</span>
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
                            className="pl-9 h-12 bg-background/50 border-border/50 focus:border-[#8EBD22] rounded-xl transition-all"
                            required
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Travel Details Section */}
                  <div className="space-y-6">
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center gap-3 mb-6"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#8EBD22]" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Détails du voyage
                      </h3>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label
                          htmlFor="numberOfAdults"
                          className="text-sm font-medium text-foreground flex items-center gap-1"
                        >
                          Nombre d&apos;adultes{" "}
                          <span className="text-destructive">*</span>
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
                            className="pl-9 h-12 bg-background/50 border-border/50 focus:border-[#8EBD22] rounded-xl transition-all"
                            required
                          />
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                      </motion.div>

                      {filteredTravelDates.length > 0 && (
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label
                            htmlFor="travelDateId"
                            className="text-sm font-medium text-foreground flex items-center gap-1"
                          >
                            Date disponible{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={formData.travelDateId}
                            onValueChange={(value) =>
                              handleChange("travelDateId", value)
                            }
                          >
                            <SelectTrigger className="h-12 bg-background/50 border-border/50 focus:border-[#8EBD22] rounded-xl">
                              <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
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
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Custom Fields */}
                  {fields.length > 0 && (
                    <div className="space-y-6">
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 mb-6"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center">
                          <Check className="w-5 h-5 text-[#8EBD22]" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          Options supplémentaires
                        </h3>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {fields.map((field: any, index: number) => {
                          if (field.type === "text") {
                            return (
                              <motion.div
                                variants={itemVariants}
                                className="space-y-2"
                                key={index}
                              >
                                <Label
                                  htmlFor={field.name}
                                  className="text-sm font-medium text-foreground flex items-center gap-1"
                                >
                                  {field.label}
                                  {field.required && (
                                    <span className="text-destructive">*</span>
                                  )}
                                </Label>
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  placeholder={field.placeholder || field.label}
                                  value={
                                    formData.customFields[field.name] || ""
                                  }
                                  onChange={(e) =>
                                    handleChange(field.name, e.target.value)
                                  }
                                  className="h-12 bg-background/50 border-border/50 focus:border-[#8EBD22] rounded-xl transition-all"
                                  required={field.required}
                                />
                              </motion.div>
                            );
                          }

                          if (field.type === "checkbox") {
                            return (
                              <motion.div
                                key={index}
                                variants={itemVariants}
                                className={cn(
                                  "col-span-1 md:col-span-2 p-5 rounded-2xl border-2 transition-all duration-300",
                                  formData.customFields[field.name]
                                    ? "border-[#8EBD22] bg-[#8EBD22]/5"
                                    : "border-border/50 bg-background/30 hover:border-border",
                                )}
                              >
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                  <div className="flex items-center gap-4">
                                    <Checkbox
                                      id={`checkbox-${field.name}`}
                                      checked={
                                        formData.customFields[field.name] ||
                                        false
                                      }
                                      onCheckedChange={(checked) =>
                                        setFormData((prev: any) => ({
                                          ...prev,
                                          customFields: {
                                            ...prev.customFields,
                                            [field.name]: checked,
                                            [`${field.name}_count`]: checked
                                              ? prev.customFields[
                                                  `${field.name}_count`
                                                ] || 1
                                              : 1,
                                          },
                                        }))
                                      }
                                      className="w-6 h-6 rounded-xl border-2"
                                    />
                                    <label
                                      htmlFor={`checkbox-${field.name}`}
                                      className="text-base font-medium text-foreground cursor-pointer"
                                    >
                                      {field.label}
                                      {field.price > 0 && (
                                        <span className="ml-2 text-[#8EBD22] font-semibold">
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
                                        className="flex items-center gap-2"
                                      >
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          className="w-10 h-10 rounded-xl"
                                          onClick={() =>
                                            setFormData((prev: any) => ({
                                              ...prev,
                                              customFields: {
                                                ...prev.customFields,
                                                [`${field.name}_count`]:
                                                  Math.max(
                                                    1,
                                                    (prev.customFields[
                                                      `${field.name}_count`
                                                    ] || 1) - 1,
                                                  ),
                                              },
                                            }))
                                          }
                                          disabled={
                                            formData.customFields[
                                              `${field.name}_count`
                                            ] <= 1
                                          }
                                        >
                                          <Minus className="w-4 h-4" />
                                        </Button>

                                        <span className="w-12 text-center font-semibold text-lg">
                                          {formData.customFields[
                                            `${field.name}_count`
                                          ] || 1}
                                        </span>

                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          className="w-10 h-10 rounded-xl"
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
                                        >
                                          <Plus className="w-4 h-4" />
                                        </Button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.div>
                            );
                          }

                          if (field.type === "select") {
                            return (
                              <motion.div
                                variants={itemVariants}
                                className="space-y-2"
                                key={index}
                              >
                                <Label
                                  htmlFor={field.name}
                                  className="text-sm font-medium text-foreground flex items-center gap-1"
                                >
                                  {field.label}
                                  {field.required && (
                                    <span className="text-destructive">*</span>
                                  )}
                                </Label>
                                <Select
                                  value={
                                    formData.customFields[field.name] || ""
                                  }
                                  onValueChange={(value) =>
                                    handleChange(field.name, value)
                                  }
                                  required={field.required}
                                >
                                  <SelectTrigger className="h-12 bg-background/50 border-border/50 focus:border-[#8EBD22] rounded-xl">
                                    <SelectValue
                                      placeholder={`-- Sélectionnez ${field.label} --`}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map(
                                      (opt: any, i: number) => (
                                        <SelectItem key={i} value={opt.value}>
                                          {opt.label}{" "}
                                          {opt.price > 0
                                            ? `(+${opt.price} MAD)`
                                            : ""}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                              </motion.div>
                            );
                          }

                          if (field.type === "date") {
                            return (
                              <motion.div
                                variants={itemVariants}
                                className="space-y-2"
                                key={index}
                              >
                                <Label
                                  htmlFor={field.name}
                                  className="text-sm font-medium text-foreground flex items-center gap-1"
                                >
                                  {field.label}
                                  {field.required && (
                                    <span className="text-destructive">*</span>
                                  )}
                                </Label>
                                <Input
                                  id={field.name}
                                  type="date"
                                  name={field.name}
                                  value={
                                    formData.customFields[field.name] || ""
                                  }
                                  onChange={(e) =>
                                    handleChange(field.name, e.target.value)
                                  }
                                  className="h-12 bg-background/50 border-border/50 focus:border-[#8EBD22] rounded-xl transition-all"
                                  required={field.required}
                                  max={new Date().toISOString().split("T")[0]}
                                />
                              </motion.div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Booking Summary */}
                  <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border-2 border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-[#8EBD22]" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Résumé de la réservation
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-border/30">
                        <span className="text-muted-foreground">
                          Prix de base ({formData.numberOfAdults} adultes)
                        </span>
                        <span className="font-medium text-foreground">
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
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex justify-between items-center py-3 border-b border-border/30"
                              >
                                <span className="text-muted-foreground">
                                  {field.label}
                                </span>
                                <span className="font-medium text-foreground">
                                  {field.price} MAD ×{" "}
                                  {formData.customFields[
                                    `${field.name}_count`
                                  ] || 1}{" "}
                                  ={" "}
                                  {field.price *
                                    (formData.customFields[
                                      `${field.name}_count`
                                    ] || 1)}{" "}
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
                                className="flex justify-between items-center py-3 border-b border-border/30"
                              >
                                <span className="text-muted-foreground">
                                  {field.label}: {selected.label}
                                </span>
                                <span className="font-medium text-foreground">
                                  +{selected.price} MAD
                                </span>
                              </motion.div>
                            ) : null;
                          }
                          return null;
                        })}

                      <div className="flex justify-between items-center pt-4">
                        <span className="text-lg font-bold text-foreground">
                          Total
                        </span>
                        <motion.span
                          key={finalPrice}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          className="text-3xl font-bold text-[#8EBD22]"
                        >
                          {finalPrice} MAD
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Terms and Submit */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={conditions}
                        onCheckedChange={(checked) =>
                          setCondition(checked as boolean)
                        }
                        className="mt-0.5 w-5 h-5 rounded-md"
                        required
                      />
                      <label
                        htmlFor="acceptTerms"
                        className="text-sm text-muted-foreground cursor-pointer"
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
                      className="w-full h-14 text-lg font-semibold rounded-xl bg-[#8EBD22] hover:bg-[#8EBD22]/90 text-white shadow-[#8EBD22]/25 transition-all hover:shadow-xl hover:shadow-[#8EBD22]/30 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>Réserver maintenant</>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
