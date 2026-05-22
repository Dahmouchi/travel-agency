/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Loading from "@/components/Loading";
import SafeHTML from "@/components/SafeHTML";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Program, Review, TourDate } from "@prisma/client";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Info,
  MapPin,
  Star,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import DiscountTimerProduct from "./DiscountBadgeProductPage";
import { cn } from "@/lib/utils";

// Mock functions for missing imports (assuming they exist or will be replaced)
// In a real scenario, I would import these correctly.
const GetFAQ = async () => ({ data: [] });
const getLanding = async () => null;
const getGoogleReview = async () => [];

type Props = {
  tour: any & {
    dates: TourDate[];
    reviews: Review[];
    inclus?: string;
    exclus?: string;
    extracts?: string;
  };
  programss: any[];
};

export default function TourDetailsModern({ tour, programss }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<TourDate[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // --- Logic from ProductDetails.tsx ---

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (tour?.dates) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const future = tour.dates.filter((date: any) => {
        const start = new Date(date.startDate);
        start.setHours(0, 0, 0, 0);
        return start >= now;
      });
      setAvailableDates(future);
      setSelectedDate(future[0]?.id ?? null);
    }
  }, [tour?.dates]);

  const approvedReviews = useMemo(
    () => tour?.reviews?.filter((r: any) => r.status === true) ?? [],
    [tour?.reviews],
  );

  const averageRating = useMemo(() => {
    const total = approvedReviews.reduce(
      (sum: any, r: any) => sum + r.rating,
      0,
    );
    return approvedReviews.length > 0
      ? (total / approvedReviews.length).toFixed(1)
      : "0";
  }, [approvedReviews]);

  const includes = useMemo(
    () =>
      (tour?.inclus ?? "")
        .split(";")
        .map((s: any) => s.trim())
        .filter(Boolean),
    [tour?.inclus],
  );

  const excludes = useMemo(
    () =>
      (tour?.exclus ?? "")
        .split(";")
        .map((s: any) => s.trim())
        .filter(Boolean),
    [tour?.exclus],
  );

  const getNextTourDate = useMemo(() => {
    if (!tour?.dates) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const sorted = tour.dates
      .filter((d: any) => {
        const date = new Date(d.startDate);
        date.setHours(0, 0, 0, 0);
        return date >= now;
      })
      .sort(
        (a: any, b: any) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );

    return sorted.length > 0 ? formatDate(new Date(sorted[0].startDate)) : null;
  }, [tour?.dates]);

  function formatDate(date: Date): string {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const scrollToBooking = () => {
    const el = document.getElementById("booking-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!tour) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- Hero Section --- */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={tour.imageUrl || "/placeholder.jpg"}
          alt={tour.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-medium uppercase tracking-wider opacity-90">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                {tour.type === "NATIONAL" ? "Maroc" : "International"}
              </span>
              {tour.destinations?.[0]?.name && (
                <>
                  <span>•</span>
                  <span>{tour.destinations[0].name}</span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
              {tour.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>
                  {tour.durationDays} Jours / {tour.durationNights} Nuits
                </span>
              </div>
              {approvedReviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>
                    {averageRating} ({approvedReviews.length} avis)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Itinerary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap gap-6 justify-between items-center border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Groupe</p>
                  <p className="font-semibold text-gray-900">
                    {tour.groupSizeMax} pers. max
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prochain départ</p>
                  <p className="font-semibold text-gray-900">
                    {getNextTourDate || "Bientôt"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Départ</p>
                  <p className="font-semibold text-gray-900">
                    {tour.startCity || "Casablanca"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                À propos de ce voyage
              </h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <SafeHTML html={tour.description || ""} />
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Programme détaillé
              </h2>
              <div className="space-y-4">
                {programss.map((prog: Program, index: number) => (
                  <div
                    key={prog.id}
                    className="border border-gray-100 rounded-xl overflow-hidden"
                  >
                    <Accordion type="single" collapsible>
                      <AccordionItem value={prog.id} className="border-none">
                        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4 text-left">
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full font-bold text-sm">
                              {index + 1}
                            </span>
                            <span className="font-semibold text-gray-900 text-lg">
                              {prog.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2 bg-gray-50/50">
                          <div className="prose prose-gray max-w-none">
                            <SafeHTML html={prog.description || ""} />
                          </div>
                          {prog.imageUrl && (
                            <img
                              src={prog.imageUrl}
                              alt={prog.title}
                              className="mt-4 rounded-xl w-full h-64 object-cover shadow-sm"
                            />
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions / Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check className="w-5 h-5" />
                  </span>
                  Inclus
                </h3>
                <ul className="space-y-3">
                  {includes.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <X className="w-5 h-5" />
                  </span>
                  Non inclus
                </h3>
                <ul className="space-y-3">
                  {excludes.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6" id="booking-card">
              <Card className="border-0 shadow-xl overflow-hidden rounded-2xl ring-1 ring-black/5">
                <div className="bg-primary p-6 text-white text-center">
                  <p className="text-sm font-medium opacity-90 uppercase tracking-wider">
                    Prix par personne
                  </p>
                  <div className="flex items-baseline justify-center gap-2 mt-2">
                    {tour.priceOriginal !== tour.priceDiscounted && (
                      <span className="text-lg line-through opacity-70">
                        {tour.priceOriginal} MAD
                      </span>
                    )}
                    <span className="text-4xl font-bold">
                      {selectedDate
                        ? availableDates.find((d) => d.id === selectedDate)
                            ?.price || tour.priceDiscounted
                        : tour.priceDiscounted}
                      <span className="text-xl font-normal ml-1">MAD</span>
                    </span>
                  </div>
                </div>

                <CardContent className="p-6 space-y-6 bg-white">
                  {tour.discountEndDate && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm font-medium border border-red-100">
                      <DiscountTimerProduct
                        endDate={tour.discountEndDate.toString()}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Choisir une date
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDate || ""}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-primary focus:border-primary block p-4 pr-10 font-medium transition-all hover:bg-gray-100"
                      >
                        {availableDates.length > 0 ? (
                          availableDates
                            .filter((date) => date.visible)
                            .map((date: any) => (
                              <option key={date.id} value={date.id}>
                                {formatDate(new Date(date.startDate))}
                              </option>
                            ))
                        ) : (
                          <option disabled>Aucune date disponible</option>
                        )}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <Button
                    className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5"
                    size="lg"
                    disabled={availableDates.length === 0}
                    onClick={() => {
                      const el = document.getElementById("reservation-form");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {availableDates.length > 0
                      ? "Réserver maintenant"
                      : "Complet"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      Paiement sécurisé • Annulation gratuite sous conditions
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Besoin d&apos;aide ?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Nos experts sont là pour vous aider à organiser votre voyage.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-gray-200 hover:bg-gray-50 hover:text-primary"
                >
                  Contacter l&apos;agence
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
