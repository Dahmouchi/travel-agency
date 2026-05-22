"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Users,
  Hotel,
  Mountain,
  Check,
  X,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  MapPinHouse,
  MessageCircle,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import ReservationFormRedesigned from "./ReservationFormLavabel";
import { GetFAQ, getLanding } from "@/actions/saveLandingConfig";
import { getGoogleReview } from "@/actions/googleReviews";
import TravelImageGallery from "./TravelImageGallery";
import SafeHTML from "@/components/SafeHTML";
import { ReviewModal } from "./ReviewsForm";
import { Review } from "@prisma/client";

type TourDate = {
  id: string;
  startDate: Date;
  price: number;
  visible: boolean;
};

const TourDetailsRedesigned = ({ tour, programss }: any) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<TourDate[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const [sampleFaqData, setSampleFaqData] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [landing, setLanding] = useState<any>(null);

  async function fetchData() {
    try {
      const [faqRes, landingRes, googleRes] = await Promise.all([
        GetFAQ(),
        getLanding(),
        getGoogleReview(),
      ]);
      setSampleFaqData(faqRes?.data ?? []);
      setLanding(landingRes);
      setReviews(googleRes ?? []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }
  // Filter available dates
  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const future = tour.dates.filter((date: any) => {
      const start = new Date(date.startDate);
      start.setHours(0, 0, 0, 0);
      return start >= now;
    });
    setAvailableDates(future);
    setSelectedDate(future[0]?.id ?? null);
    fetchData();
  }, [tour.dates]);

  // Calculate reviews
  const approvedReviews = useMemo(
    () => tour.reviews?.filter((r: any) => r.status === "APPROVED") ?? [],
    [tour.reviews],
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

  const reviewCount = approvedReviews.length;

  // Parse includes/excludes
  const includes = useMemo(
    () =>
      (tour.inclus ?? "")
        .split(";")
        .map((s: any) => s.trim())
        .filter(Boolean),
    [tour.inclus],
  );

  const excludes = useMemo(
    () =>
      (tour.exclus ?? "")
        .split(";")
        .map((s: any) => s.trim())
        .filter(Boolean),
    [tour.exclus],
  );

  const extract = useMemo(
    () =>
      (tour.extracts ?? "")
        .split(";")
        .map((s: any) => s.trim())
        .filter(Boolean),
    [tour.extracts],
  );

  const getNextTourDate = useMemo(() => {
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
  }, [tour.dates]);

  function formatDate(date: Date): string {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const scrollToBooking = () => {
    const el = document.getElementById("reservation-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background ">
      {/* Hero Section with Image Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[80vh] overflow-hidden"
      >
        <Carousel
          opts={{ loop: true }}
          plugins={[plugin.current]}
          className="h-full"
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
        >
          <CarouselContent>
            <CarouselItem>
              <div className="relative h-[80vh]">
                <img
                  src={tour.imageUrl}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              </div>
            </CarouselItem>
            {tour.images?.map((image: any, index: number) => (
              <CarouselItem key={index}>
                <div className="relative h-[80vh]">
                  <img
                    src={image.url}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-background/80 hover:bg-background" />
          <CarouselNext className="right-4 bg-background/80 hover:bg-background" />
        </Carousel>

        {/* Floating Info Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-10 px-2 lg:px-24 left-1/2 -translate-x-1/2 w-full max-w-6xl"
        >
          <Card className="backdrop-blur-xl py-0 bg-card/95 border-[#8EBD22] shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#8EBD22]" />
                    <span className="text-sm text-muted-foreground">
                      {tour.destinations[0]?.name} •{" "}
                      {tour.type === "NATIONAL" ? "Maroc" : "International"}
                    </span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
                    {tour.title}
                  </h1>
                  {tour.showReviews && reviewCount > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4",
                              i < Math.round(Number(averageRating))
                                ? "fill-[#8EBD22] text-[#8EBD22]"
                                : "text-muted",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {averageRating}/5 ({reviewCount} avis)
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      À partir de
                    </div>
                    <div className="text-4xl font-bold text-[#8EBD22]">
                      {tour.priceDiscounted}{" "}
                      <span className="text-lg">MAD</span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={scrollToBooking}
                    className="bg-[#8EBD22] hover:bg-[#8EBD22]/90 text-white shadow-lg"
                  >
                    Réserver maintenant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Info Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="container mx-auto px-4 -mt-8 relative z-10 lg:px-24"
      >
        <Card className="bg-[#8EBD22] py-0 border-[#8EBD22]/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white/10">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white">Durée</div>
                  <div className="font-semibold text-white">
                    {tour.durationDays}J / {tour.durationNights}N
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white/10">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white">Prochaine date</div>
                  <div className="font-semibold text-sm text-white">
                    {getNextTourDate || "À venir"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white/10">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white">Groupe max</div>
                  <div className="font-semibold text-white">
                    {tour.groupSizeMax} personnes
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white/10">
                  <Hotel className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white">Hébergement</div>
                  <div className="font-semibold text-white">
                    {tour.accommodationType}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="container px-2 lg:px-24 mx-auto py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Card className="py-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    Description du voyage
                  </h2>
                  <div
                    className={cn(
                      "prose prose-sm max-w-none transition-all duration-300",
                      !expanded && "line-clamp-6",
                    )}
                    dangerouslySetInnerHTML={{ __html: tour.description || "" }}
                  />
                  {tour.description && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpanded(!expanded)}
                      className="mt-2"
                    >
                      {expanded ? "Voir moins" : "Voir plus"}
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 ml-2 transition-transform",
                          expanded && "rotate-180",
                        )}
                      />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Video Section */}
            {tour.videoUrl && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                <Card className="py-0">
                  <CardContent className="p-0">
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full rounded-xl"
                        src={tour.videoUrl}
                        title="Video du tour"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Program Itinerary */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mountain className="w-6 h-6 text-[#8EBD22]" />
                Programme du voyage
              </h2>
              <Accordion
                type="multiple"
                className="space-y-3"
                defaultValue={[programss[0]?.id]}
              >
                {programss.map((prog: any, index: any) => (
                  <AccordionItem
                    value={prog.id}
                    key={prog.id}
                    className="border-none"
                  >
                    <Card className="py-0">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8EBD22] text-white flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <span className="font-semibold">{prog.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardContent className="pt-0">
                          <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                              <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: prog.description || "",
                                }}
                              />
                            </div>
                            {prog.imageUrl && (
                              <div className="lg:col-span-1">
                                <img
                                  src={prog.imageUrl}
                                  alt={prog.title}
                                  className="rounded-xl w-full h-48 object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            {/* Includes / Excludes */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Included */}
                {includes.length > 0 && (
                  <Card className="border-[#8EBD22]/20">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#8EBD22]">
                        <Check className="w-5 h-5" />
                        Inclus dans le voyage
                      </h3>
                      <ul className="space-y-3">
                        {includes.map((item: any, index: any) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#8EBD22] mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Excluded */}
                {excludes.length > 0 && (
                  <Card className="border-destructive/20">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-destructive">
                        <X className="w-5 h-5" />
                        Non inclus
                      </h3>
                      <ul className="space-y-3">
                        {excludes.map((item: any, index: any) => (
                          <li key={index} className="flex items-start gap-2">
                            <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Extras */}
              {extract.length > 0 && (
                <Card className="mt-6 border-blue-600/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-600">
                      <Plus className="w-5 h-5" />
                      Suppléments optionnels
                    </h3>
                    <ul className="space-y-3">
                      {extract.map((item: any, index: any) => (
                        <li key={index} className="flex items-start gap-2">
                          <Plus className="w-4 h-4 text-bluborder-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Checklist */}
            {tour.showChecklist &&
              tour.checklist &&
              tour.checklist.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">
                        {tour.titleCkecklist}
                      </h2>
                      <div className="space-y-6">
                        {tour.checklist.map((item: any, index: any) => (
                          <div key={index}>
                            <h3 className="text-lg font-semibold mb-2">
                              {item.title}
                            </h3>
                            <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Booking Card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border-[#8EBD22]/20 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-center">
                      Réservez votre place
                    </h3>

                    {/* Date Selection */}
                    {availableDates.length > 0 ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Choisissez votre date
                          </label>
                          <select
                            value={selectedDate || ""}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full p-3 rounded-xl border bg-background focus:ring-2 focus:ring-[#8EBD22]"
                          >
                            {availableDates
                              .filter((date) => date.visible)
                              .map((date) => (
                                <option key={date.id} value={date.id}>
                                  {formatDate(date.startDate)} - {date.price}{" "}
                                  MAD
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="py-4 border-y">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-muted-foreground">
                              Prix par personne
                            </span>
                            <span className="text-2xl font-bold text-[#8EBD22]">
                              {tour.priceDiscounted} MAD
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={scrollToBooking}
                          className="w-full bg-[#8EBD22] hover:bg-[#8EBD22]/90 text-[#8EBD22]-foreground"
                          size="lg"
                        >
                          Réserver maintenant
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Aucune date disponible
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tour Details Card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">
                      Détails du voyage
                    </h3>
                    <div className="space-y-4">
                      {tour.showDifficulty && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Niveau
                          </span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-6 h-6 rounded-sm",
                                  i < (tour.difficultyLevel || 0)
                                    ? "bg-[#8EBD22]"
                                    : "bg-muted",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Destination
                        </span>
                        <span className="font-medium">
                          {tour.destinations.map((d: any) => d.name).join(", ")}
                        </span>
                      </div>

                      {tour.natures && tour.natures.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground block mb-2">
                            Thématiques
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {tour.natures.map((nature: any) => (
                              <Badge key={nature.id} variant="info">
                                {nature.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {tour.services && tour.services.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground block mb-2">
                            Services
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {tour.services.map((service: any) => (
                              <Badge
                                key={service.id}
                                className="bg-[#8EBD22]/10 text-[#8EBD22]"
                              >
                                {service.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {landing?.reviews && (
                <div className="bg-[#FFEDF3] my-4 p-6 md:p-8 rounded-xl border border-slate-200 shadow-lg max-w-2xl mx-auto font-sans">
                  <div className="flex items-center justify-center mb-4 gap-3">
                    {/* Reviews Section <img
                                  src="/icons/google-logo-Photoroom.png"
                                  alt=""
                                  className="w-6 h-6"
                                />*/}
                    <h2 className="text-xl font-bold text-gray-800  flex items-center justify-center text-center">
                      Ce que disent nos voyageurs sur Build Travel
                    </h2>
                  </div>
                  {reviews.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      Aucun avis pour ce tour pour le moment.
                    </div>
                  ) : reviews.length > 1 ? (
                    <Carousel
                      opts={{
                        align: "center",
                        loop: true,
                      }}
                      plugins={[
                        Autoplay({
                          delay: 5000,
                          stopOnInteraction: false,
                        }),
                      ]}
                      className="relative group"
                    >
                      <CarouselContent className="-ml-1 px-8 py-4">
                        {reviews
                          .filter((review: any) => review.status)
                          .map((review: any) => (
                            <ReviewItem key={review.id} review={review} />
                          ))}
                      </CarouselContent>

                      {/* Navigation Arrows */}
                      <div className="hidden sm:block">
                        <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-[#8EBD22] rounded-full shadow-lg hover:bg-[#8EBD22] hover:text-white transition-all border border-gray-200 opacity-0 group-hover:opacity-100 z-10" />
                        <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-[#8EBD22] rounded-full shadow-lg hover:bg-[#8EBD22] hover:text-white transition-all border border-gray-200 opacity-0 group-hover:opacity-100 z-10" />
                      </div>

                      {/* Mobile Navigation */}
                      <div className="sm:hidden flex justify-center gap-4 mt-6">
                        <CarouselPrevious className="static w-10 h-10 bg-white text-[#8EBD22] rounded-full shadow hover:bg-[#8EBD22] hover:text-white transition-all border border-gray-200">
                          <ChevronLeft className="w-5 h-5" />
                        </CarouselPrevious>
                        <CarouselNext className="static w-10 h-10 bg-white text-[#8EBD22] rounded-full shadow hover:bg-[#8EBD22] hover:text-white transition-all border border-gray-200">
                          <ChevronRight className="w-5 h-5" />
                        </CarouselNext>
                      </div>
                    </Carousel>
                  ) : (
                    <div className="w-full">
                      <ReviewsCard
                        review={{
                          name: approvedReviews[0]?.fullName,
                          message: approvedReviews[0]?.message,
                          rating: approvedReviews[0]?.rating,
                          role: "Client",
                          avatarUrl: "/home/ubuntu/upload/image.png",
                        }}
                      />
                    </div>
                  )}
                  {landing?.googleAvie && (
                    <div className="text-center ">
                      <a
                        href={`https://www.google.com/maps/place/Happy+Trip/@34.0202687,-6.8372415,722m/data=!3m2!1e3!4b1!4m6!3m5!1s0xda76de9c8728317:0x46dc98bb0096920e!8m2!3d34.0202687!4d-6.8372415!16s%2Fg%2F11r8xd0s0x?entry=ttu&g_ep=EgoyMDI1MDcxMy4wIKXMDSoASAFQAw%3D%3D`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#8EBD22] text-white rounded-xl hover:bg-[#6db05e] transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      >
                        <Star className="w-5 h-5" />
                        <span>Voir tous les avis sur Google Maps</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
              {tour.showReviews && (
                <div className="bg-[#FFEDF3]  p-6 md:p-8 rounded-xl border border-slate-200 shadow-lg max-w-2xl mx-auto font-sans">
                  <h2 className="text-xl text-center font-bold text-gray-800 mb-6 flex flex-col gap-2 items-center justify-center">
                    <MessageCircle />
                    Les avis de nos clients à propos de ce voyage
                  </h2>
                  {approvedReviews.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      Aucun avis pour ce tour pour le moment.
                    </div>
                  ) : approvedReviews.length > 1 ? (
                    <Carousel
                      plugins={[plugin.current]} // Add plugin ref here for autoplay
                      className="w-full"
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                      onMouseEnter={plugin.current.stop} // Optional: pause on hover
                      onMouseLeave={plugin.current.reset}
                    >
                      <CarouselContent>
                        {approvedReviews.map(
                          (review: Review, index: number) => (
                            <CarouselItem
                              key={index}
                              className="md:basis-1/1 lg:basis-1/1"
                            >
                              {/* Show 1 item at a time */}
                              <div className="p-1">
                                <ReviewsCard
                                  review={{
                                    name: review.fullName,
                                    message: review.message,
                                    rating: review.rating,
                                    role: "Client",
                                    avatarUrl: "/home/ubuntu/upload/image.png",
                                  }}
                                />
                              </div>
                            </CarouselItem>
                          ),
                        )}
                      </CarouselContent>
                      <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-lime-400 hover:bg-lime-500 text-white border-none rounded-full w-8 h-8" />
                      <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-lime-400 hover:bg-lime-500 text-white border-none rounded-full w-8 h-8" />
                    </Carousel>
                  ) : (
                    <div className="w-full">
                      <ReviewsCard
                        review={{
                          name: approvedReviews[0].fullName,
                          message: approvedReviews[0].message,
                          rating: approvedReviews[0].rating,
                          role: "Client",
                          avatarUrl: "/home/ubuntu/upload/image.png",
                        }}
                      />
                    </div>
                  )}
                  <ReviewModal tourId={tour.id} />
                </div>
              )}
              {tour?.bookinSteps?.length > 0 && (
                <div className="w-full max-w-4xl mx-auto p-6 md:p-8 font-sans bg-[#FFEDF3] rounded-xl shadow border border-slate-200">
                  <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
                    Comment faire la réservation
                  </h2>
                  <p className="text-center text-sm text-gray-600 mb-8">
                    La réservation est ouverte à la limite des places
                    disponibles.
                  </p>
                  {/* Steps Section */}
                  <div className="space-y-2 mb-10">
                    {tour?.bookinSteps.map((ste: any) => (
                      <div
                        key={ste.orderIndex}
                        className="flex items-start space-x-2 p-4 bg-white rounded-xl border border-blue-100"
                      >
                        <div className="flex items-center justify-center w-4 h-4 p-3 rounded-full text-white bg-[#8EBD22] font-semibold text-xs shadow">
                          {ste.orderIndex + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {ste.title}
                          </h3>
                          <div className="text-gray-700 text-sm">
                            <SafeHTML html={ste.description || ""} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center border-t pt-2 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Contact
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      GSM/Whatsapp: 06255555
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: buildTravel@gmail.com
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Anchor */}
      <div id="reservation-form">
        <ReservationFormRedesigned
          fields={tour.reservationForm[0]?.fields || []}
          tourId={tour.id}
          basePrice={tour.priceDiscounted}
          travelDates={tour.dates || []}
        />
        {/* <ReservationSection
                availableDates={sampleAvailableDates}
                hotels={sampleHotels}
                tour={tour}
                imageSrc="/path/to/your/image.jpg" // Provide image path
              /> */}
      </div>
      <TravelImageGallery images={tour.images} />

      {tour.googleMapsUrl && (
        <div className="bg-white p-6 lg:px-12 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3 justify-center">
            <MapPinHouse />
            Votre Destination.
          </h2>
          {/* Map Placeholder - Replace with actual map embed or component */}
          <div className="mb-3 rounded overflow-hidden border border-gray-200 w-full">
            <iframe
              className="w-full rounded-xl"
              src={tour.googleMapsUrl}
              width={600}
              height={450}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
      <FaqSection faqData={sampleFaqData} />
    </div>
  );
};

export default TourDetailsRedesigned;

const FaqSection = ({
  faqData,
  title = "Questions fréquemment posées",
}: any) => {
  return (
    <div>
      {faqData.length > 0 && (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8 font-sans">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
            {/* Optional Icon */}
            {/* <QuestionIcon /> */}
            {title}
          </h2>

          {/* Shadcn Accordion Component */}
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqData?.map((item: any) => (
              <AccordionItem
                key={item.id}
                value={item.id} // Use unique ID for value
                className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden"
              >
                <AccordionTrigger className="flex justify-between items-center w-full p-4 md:p-5 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors [&[data-state=open]>svg]:rotate-180">
                  <span className="flex-1 mr-4">{item.question}</span>
                  {/* Default chevron is included in AccordionTrigger, styled via CSS */}
                  {/* You can customize the icon if needed */}
                  {/* <ChevronDownIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" /> */}
                </AccordionTrigger>
                <AccordionContent className="p-4 md:p-5 pt-0 text-gray-600 text-sm leading-relaxed bg-white">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};
const ReviewsCard = ({ review }: { review: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);

  // Check if review message needs truncation (more than 4 lines)
  const needsTruncation =
    review?.message?.split("\n").length > 4 || review?.message?.length > 200;

  return (
    <>
      <Card className="mx-2 border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
        <CardContent className="p-6 flex flex-col items-start text-left">
          <div className="flex justify-between items-center w-full mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < review?.rating ? "text-yellow-400" : "text-gray-300"
                  }
                  fill={i < review?.rating ? "#facc15" : "none"}
                />
              ))}
            </div>
          </div>

          {/* Review text with line clamp */}
          <div className="relative w-full">
            <p
              className={`text-gray-600 text-sm mb-4 leading-relaxed ${
                !isExpanded && needsTruncation ? "line-clamp-4" : ""
              }`}
            >
              &quot;{review?.message}&quot;
            </p>

            {/* Show "Voir plus" button if text is truncated */}
            {needsTruncation && !isExpanded && (
              <button
                onClick={() => setShowFullReview(true)}
                className="text-[#8EBD22] hover:text-blue-800 text-sm font-medium mt-1"
              >
                Voir plus
              </button>
            )}
          </div>

          <div className="flex items-center mt-auto pt-4 border-t border-gray-100 w-full">
            <img
              src="/icons/user.png"
              alt={review?.name}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {review?.name}
              </p>
              <p className="text-gray-500 text-xs">{review?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full review dialog */}
      <AlertDialog open={showFullReview} onOpenChange={setShowFullReview}>
        <AlertDialogContent className="text-left max-h-[90vh] overflow-y-auto animate-in fade-in-90 zoom-in-95">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < review?.rating ? "text-yellow-400" : "text-gray-300"
                  }
                  fill={i < review?.rating ? "#facc15" : "none"}
                />
              ))}
              <span>Avis de {review?.name}</span>
            </AlertDialogTitle>
          </AlertDialogHeader>

          <p className="text-gray-800 italic mb-4">
            &quot;{review?.message}&quot;
          </p>
          <div className="flex items-center mt-4">
            <img
              src="/icons/user.png"
              alt={review?.name}
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <div>
              <p className="font-medium text-gray-800 text-sm">
                {review?.name}
              </p>
              <p className="text-gray-500 text-xs">{review?.role}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#8EBD22] text-white px-4 py-1 rounded-xl cursor-pointer">
              Fermer
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const ReviewItem = ({ review }: { review: any }) => {
  // Create a ref to detect if text is clamped
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedReview, setSelectedReview] = React.useState<any>(null);

  // Check if text is clamped after render
  React.useEffect(() => {
    if (textRef.current) {
      setIsClamped(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [review.text]);

  const getInitialsAvatar = (fullName: string) => {
    // Split the name into parts
    const nameParts = fullName.trim().split(" ");

    // Get first letter of first name
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";

    // Get first letter of last name (if exists)
    const lastNameInitial =
      nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";

    return `${firstNameInitial}${lastNameInitial}`;
  };
  const renderStars = (rating: any) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
        />
      ));
  };

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-[#8EBD22]",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatRelativeTime = (inputDate: string | Date): string => {
    // Convert input to Date object if it's a string
    const date =
      typeof inputDate === "string" ? new Date(inputDate) : inputDate;
    const now = new Date();

    // Calculate time difference in seconds
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Define time intervals in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    // Calculate time passed for each interval
    if (diffInSeconds >= intervals.year) {
      const years = Math.floor(diffInSeconds / intervals.year);
      return `${years}${years === 1 ? " années" : " années"}`;
    }
    if (diffInSeconds >= intervals.month) {
      const months = Math.floor(diffInSeconds / intervals.month);
      return `${months}${months === 1 ? " mois" : " mois"}`;
    }
    if (diffInSeconds >= intervals.week) {
      const weeks = Math.floor(diffInSeconds / intervals.week);
      return `${weeks}${weeks === 1 ? " semaines" : " semaines"}`;
    }
    if (diffInSeconds >= intervals.day) {
      const days = Math.floor(diffInSeconds / intervals.day);
      return `${days}${days === 1 ? " jours" : " jours"}`;
    }
    if (diffInSeconds >= intervals.hour) {
      const hours = Math.floor(diffInSeconds / intervals.hour);
      return `${hours}${hours === 1 ? "h" : "h"}`;
    }
    if (diffInSeconds >= intervals.minute) {
      const minutes = Math.floor(diffInSeconds / intervals.minute);
      return `${minutes}${minutes === 1 ? "m" : "m"}`;
    }

    return "Just now";
  };
  return (
    <CarouselItem className="">
      <motion.div
        className="bg-white h-full text-slate-700 border border-gray-100 p-4 rounded-xl mb-4 shadow-lg mx-auto max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with avatar and user info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {review.profilePhotoUrl ? (
              <img
                src={review.profilePhotoUrl}
                alt=""
                className="h-10 w-10 rounded-full bg-cover"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getRandomColor()}`}
              >
                {getInitialsAvatar(review.authorName)}
              </div>
            )}
            <div>
              <h3 className="font-medium text-black text-sm">
                {review.authorName}
              </h3>
              <div className="flex items-center text-gray-400 text-xs space-x-1">
                <span>{review.originalText || 1} avis</span>
              </div>
            </div>
          </div>
          <img
            src="/icons/google-logo-Photoroom.png"
            alt=""
            className="w-6 h-6"
          />
        </div>

        {/* Rating and date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
            </div>
            <span className="text-gray-400 text-sm">
              il y a {formatRelativeTime(review.time)}
            </span>
          </div>
        </div>

        {/* Review text with expand functionality */}
        <div className="mb-4">
          <p
            ref={textRef}
            className={`text-gray-800 text-sm leading-relaxed ${
              !isExpanded ? "line-clamp-3" : ""
            }`}
          >
            {review.text}
          </p>
          {isClamped && !isExpanded && (
            <button
              onClick={() => {
                setSelectedReview({
                  text: review.text,
                  authorName: review.authorName,
                  rating: review.rating,
                });
              }}
              className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
            >
              Plus
            </button>
          )}
        </div>

        {review.language && (
          <img
            src={review.language}
            alt=""
            className="w-full h-40 rounded-2xl"
          />
        )}
      </motion.div>

      <AlertDialog
        open={!!selectedReview}
        onOpenChange={(open) => !open && setSelectedReview(null)}
      >
        <AlertDialogContent className="text-left max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {selectedReview &&
                [...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < selectedReview.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                    fill={i < selectedReview.rating ? "#facc15" : "none"}
                  />
                ))}
              <span>Avis de {selectedReview?.authorName}</span>
            </AlertDialogTitle>
          </AlertDialogHeader>

          <p className="text-gray-800 italic mb-4">
            &quot;{selectedReview?.text}&quot;
          </p>

          <div className="flex items-center space-x-3">
            {review.profilePhotoUrl ? (
              <img
                src={review.profilePhotoUrl}
                alt=""
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getRandomColor()}`}
              >
                {getInitialsAvatar(review.authorName)}
              </div>
            )}
            <div>
              <h3 className="font-medium text-black text-sm">
                {review.authorName}
              </h3>
              <div className="flex items-center text-gray-400 text-xs space-x-1">
                <span>1 avis</span>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#8EBD22] text-white px-4 py-1 rounded-xl cursor-pointer">
              Fermer
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CarouselItem>
  );
};
