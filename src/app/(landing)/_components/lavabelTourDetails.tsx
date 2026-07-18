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
  Play,
  Shield,
  Heart,
  ArrowRight,
  Quote,
  Globe,
  Camera,
  CircleCheck,
  CircleX,
  CirclePlus,
  HelpCircle,
  FileText,
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
  const [activeSection, setActiveSection] = useState("overview");

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

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#fafbf7] pb-20 lg:pb-0">
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Split layout with single image
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br bg-[#47663B] overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="  px-4 md:px-8 lg:px-24 pt-4 lg:pt-32 pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6 relative z-10 order-2 lg:order-1"
            >
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                  <MapPin className="w-4 h-4 text-[#8EBD22]" />
                  <span className="text-white/90 text-sm font-medium">
                    {tour.destinations[0]?.name} •{" "}
                    {tour.type === "NATIONAL" ? "Maroc" : "International"}
                  </span>
                </div>
                {tour.showReviews && reviewCount > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                    <Star className="w-4 h-4 fill-[#8EBD22] text-[#8EBD22]" />
                    <span className="text-white/90 text-sm font-medium">
                      {averageRating} ({reviewCount} avis)
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
                {tour.title}
              </h1>

              {/* Quick info chips */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock className="w-4 h-4 text-[#8EBD22]" />
                  <span>
                    {tour.durationDays}J / {tour.durationNights}N
                  </span>
                </div>
                <div className="w-px h-5 bg-white/20" />
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Users className="w-4 h-4 text-[#8EBD22]" />
                  <span>Max {tour.groupSizeMax} pers.</span>
                </div>
                {getNextTourDate && (
                  <>
                    <div className="w-px h-5 bg-white/20" />
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Calendar className="w-4 h-4 text-[#8EBD22]" />
                      <span>{getNextTourDate}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Price & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 pt-2">
                <div>
                  <span className="text-white/80 text-xs uppercase tracking-wider font-medium block mb-1">
                    À partir de
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl md:text-5xl font-black text-[#aae61f]">
                      {tour.priceDiscounted}
                    </span>
                    <span className="text-lg text-[#fff] font-semibold">
                      MAD
                    </span>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={scrollToBooking}
                  className="bg-[#8EBD22] hover:bg-[#7aa91c] text-white font-semibold px-8 py-6 rounded-xl text-base  hover:shadow-[0_8px_40px_rgba(142,189,34,0.5)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  Réserver maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* Right — Single Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative rounded-2xl border-r-4  border-r-[#8EBD22] overflow-hidden aspect-[4/3] lg:aspect-[4/2.5]">
                <img
                  src={tour.imageUrl}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t  from-black/30 via-transparent to-transparent" />

                {/* Floating badge on image */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
                  <Hotel className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-medium">
                    {tour.accommodationType}
                  </span>
                </div>
              </div>

              {/* Decorative glow behind image */}
              <div className="absolute -inset-4 bg-[#8EBD22]/10 rounded-[2rem] blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          QUICK STATS BAR
      ═══════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative z-20 px-4 md:px-8 lg:px-24 -top-6 "
      >
        <div className="bg-white rounded-2xl border-[0.5px] border-[#7676763f] shadow-[0_4px_40px_rgba(0,0,0,0.06)]  p-1">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock,
                label: "Durée",
                value: `${tour.durationDays}J / ${tour.durationNights}N`,
              },
              {
                icon: Calendar,
                label: "Prochaine date",
                value: getNextTourDate || "À venir",
              },
              {
                icon: Users,
                label: "Groupe max",
                value: `${tour.groupSizeMax} personnes`,
              },
              {
                icon: Hotel,
                label: "Hébergement",
                value: tour.accommodationType,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-xl transition-colors hover:bg-[#8EBD22]/5",
                  i < 3 && "lg:border-r border-gray-100",
                )}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#8EBD22]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="font-semibold text-gray-800 text-sm truncate">
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════
          MAIN CONTENT AREA — Interleaved on mobile, 2-col on desktop
      ═══════════════════════════════════════════════════════════ */}
      <div className="lg:max-w-[80%] lg:mx-auto px-4 md:px-8 lg:px-24 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_380px] gap-6 md:gap-8 lg:gap-10">
          {/* DESCRIPTION — order-1 on mobile, stays in left col on desktop */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-none lg:col-start-1"
          >
            <SectionHeader
              icon={<FileText className="w-5 h-5" />}
              title="Description du voyage"
            />
            <div className="mt-6 bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80">
              <div
                className={cn(
                  "safe-html text-sm text-gray-600 max-w-none",
                  !expanded && "line-clamp-6",
                )}
                dangerouslySetInnerHTML={{ __html: tour.description || "" }}
              />
              {tour.description && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-4 inline-flex items-center gap-2 text-[#8EBD22] hover:text-[#7aa91c] font-semibold text-sm transition-colors group"
                >
                  {expanded ? "Voir moins" : "Lire la suite"}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5",
                      expanded && "rotate-180",
                    )}
                  />
                </button>
              )}
            </div>
          </motion.section>

          {/* VIDEO — order-4 on mobile */}
          {tour.videoUrl && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="order-4 lg:order-none lg:col-start-1"
            >
              <SectionHeader
                icon={<Play className="w-5 h-5" />}
                title="Vidéo du voyage"
              />
              <div className="mt-6 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-gray-100/80">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={tour.videoUrl}
                    title="Video du tour"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.section>
          )}

          {/* PROGRAM / ITINERARY */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="order-5 lg:order-none lg:col-start-1"
          >
            <SectionHeader
              icon={<Mountain className="w-5 h-5" />}
              title="Programme du voyage"
            />
            <div className="mt-6 relative">
              {/* Timeline connecting line */}
              <div className="absolute left-[23px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-[#8EBD22] via-[#8EBD22]/30 to-transparent hidden md:block" />

              <Accordion
                type="multiple"
                className="space-y-4"
                defaultValue={[programss[0]?.id]}
              >
                {programss.map((prog: any, index: any) => (
                  <AccordionItem
                    value={prog.id}
                    key={prog.id}
                    className="border-none"
                  >
                    <div className="relative bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden hover:shadow-[0_4px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                      <AccordionTrigger className="px-6 py-5 hover:no-underline [&[data-state=open]>div>.day-badge]:bg-[#8EBD22] [&[data-state=open]>div>.day-badge]:text-white [&[data-state=open]>div>.day-badge]:shadow-[0_4px_15px_rgba(142,189,34,0.3)]">
                        <div className="flex items-center gap-4 text-left">
                          <div className="day-badge flex-shrink-0 w-10 h-10 rounded-xl bg-[#8EBD22]/10 text-[#8EBD22] flex items-center justify-center font-bold text-sm transition-all duration-300">
                            J{index + 1}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 text-base block">
                              {prog.title}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              Jour {index + 1}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-6 pb-6">
                          <div className="h-px bg-gradient-to-r from-[#8EBD22]/20 via-gray-100 to-transparent mb-6" />
                          <div className="grid lg:grid-cols-3 gap-6">
                            <div
                              className={
                                prog.imageUrl
                                  ? "lg:col-span-2"
                                  : "lg:col-span-3"
                              }
                            >
                              <div
                                className="safe-html text-sm text-gray-600 max-w-none"
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
                                  className="rounded-xl w-full h-48 object-cover shadow-sm"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.section>

          {/* INCLUDES / EXCLUDES / EXTRAS */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="order-7 lg:order-none lg:col-start-1"
          >
            <SectionHeader
              icon={<Shield className="w-5 h-5" />}
              title="Ce qui est compris"
            />
            <div className="mt-6 grid md:grid-cols-2 gap-5">
              {/* Included */}
              {includes.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8EBD22] to-[#8EBD22]/30 rounded-l-2xl" />
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#8EBD22]/10 flex items-center justify-center">
                      <CircleCheck className="w-4 h-4 text-[#8EBD22]" />
                    </div>
                    Inclus
                  </h3>
                  <ul className="space-y-3">
                    {includes.map((item: any, index: any) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <Check className="w-4 h-4 text-[#8EBD22] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Excluded */}
              {excludes.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-400 to-red-400/30 rounded-l-2xl" />
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                      <CircleX className="w-4 h-4 text-red-400" />
                    </div>
                    Non inclus
                  </h3>
                  <ul className="space-y-3">
                    {excludes.map((item: any, index: any) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Extras */}
            {extract.length > 0 && (
              <div className="mt-5 bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-400/30 rounded-l-2xl" />
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <CirclePlus className="w-4 h-4 text-blue-500" />
                  </div>
                  Suppléments optionnels
                </h3>
                <ul className="space-y-3">
                  {extract.map((item: any, index: any) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <Plus className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>

          {/* CHECKLIST */}
          {tour.showChecklist &&
            tour.checklist &&
            tour.checklist.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="order-9 lg:order-none lg:col-start-1"
              >
                <div className=" bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80">
                  <div className="space-y-6">
                    {tour.checklist.map((item: any, index: any) => (
                      <div key={index} className="group">
                        <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#8EBD22]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[#8EBD22]">
                              {index + 1}
                            </span>
                          </div>
                          {item.title}
                        </h3>
                        <div
                          className="safe-html text-sm text-gray-600 max-w-none pl-8"
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        />
                        {index < tour.checklist.length - 1 && (
                          <div className="h-px bg-gray-100 mt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}
          {/* ─── SIDEBAR SECTIONS (interleaved on mobile, sticky column on desktop) ─── */}

          {/* Booking Card — order-2 on mobile (right after description) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-6"
          >
            <div className=" lg:top-6 space-y-5 sm:space-y-6">
              <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] border border-gray-100/80 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#8EBD22] to-[#6da015] p-5">
                  <h3 className="text-lg font-bold text-white">
                    Réservez votre place
                  </h3>
                  <p className="text-white/80 text-xs mt-0.5">
                    Places limitées • Réservez tôt
                  </p>
                </div>

                <div className="p-6">
                  {availableDates.length > 0 ? (
                    <div className="space-y-5">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                          Choisissez votre date
                        </label>
                        <select
                          value={selectedDate || ""}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-[#8EBD22] focus:border-[#8EBD22] transition-all text-sm font-medium text-gray-700 appearance-none cursor-pointer"
                        >
                          {availableDates
                            .filter((date) => date.visible)
                            .map((date) => (
                              <option key={date.id} value={date.id}>
                                {formatDate(date.startDate)} - {date.price} MAD
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="bg-[#8EBD22]/5 rounded-xl p-4 border border-[#8EBD22]/10">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Prix par personne
                          </span>
                          <div className="text-right">
                            <span className="text-2xl font-extrabold text-[#8EBD22]">
                              {tour.priceDiscounted}
                            </span>
                            <span className="text-sm font-semibold text-[#8EBD22]/70 ml-1">
                              MAD
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={scrollToBooking}
                        className="w-full bg-[#8EBD22] hover:bg-[#7aa91c] text-white font-semibold py-6 rounded-xl text-base shadow-[0_8px_30px_rgba(142,189,34,0.25)] hover:shadow-[0_8px_40px_rgba(142,189,34,0.4)] transition-all duration-300 hover:-translate-y-0.5"
                        size="lg"
                      >
                        Réserver maintenant
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>

                      <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" />
                        Réservation sécurisée
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        Aucune date disponible
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tour Details Card */}
              <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6">
                <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#8EBD22]" />
                  Détails du voyage
                </h3>
                <div className="space-y-4 mt-4">
                  {tour.showDifficulty && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Niveau</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-5 h-2 rounded-full transition-colors",
                              i < (tour.difficultyLevel || 0)
                                ? "bg-[#8EBD22]"
                                : "bg-gray-100",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-gray-50" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Destination</span>
                    <span className="font-medium text-gray-800 text-sm text-right max-w-[180px]">
                      {tour.destinations.map((d: any) => d.name).join(", ")}
                    </span>
                  </div>

                  {tour.natures && tour.natures.length > 0 && (
                    <>
                      <div className="h-px bg-gray-50" />
                      <div>
                        <span className="text-sm text-gray-500 block mb-2">
                          Thématiques
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {tour.natures.map((nature: any) => (
                            <span
                              key={nature.id}
                              className="inline-flex items-center px-3 py-1 rounded-lg bg-[#8EBD22]/5 text-[#8EBD22] text-xs font-medium border border-[#8EBD22]/10"
                            >
                              {nature.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {tour.services && tour.services.length > 0 && (
                    <>
                      <div className="h-px bg-gray-50" />
                      <div>
                        <span className="text-sm text-gray-500 block mb-2">
                          Services
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {tour.services.map((service: any) => (
                            <span
                              key={service.id}
                              className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100"
                            >
                              {service.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* Google Reviews Sidebar */}
              {landing?.reviews && (
                <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <img
                      src="/icons/google-logo-Photoroom.png"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <h3 className="text-sm font-bold text-gray-800">
                      Avis Google Maps
                    </h3>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center text-gray-400 py-6 text-sm">
                      Aucun avis pour le moment.
                    </div>
                  ) : reviews.length > 1 ? (
                    <Carousel
                      opts={{ align: "center", loop: true }}
                      plugins={[
                        Autoplay({
                          delay: 5000,
                          stopOnInteraction: false,
                        }),
                      ]}
                      className="relative"
                    >
                      <CarouselContent className="-ml-1">
                        {reviews
                          .filter((review: any) => review.status)
                          .map((review: any) => (
                            <ReviewItem key={review.id} review={review} />
                          ))}
                      </CarouselContent>
                      <div className="flex justify-center gap-2 mt-4">
                        <CarouselPrevious className="static w-8 h-8 bg-gray-50 text-gray-500 rounded-lg hover:bg-[#8EBD22]/10 hover:text-[#8EBD22] transition-all border-gray-100" />
                        <CarouselNext className="static w-8 h-8 bg-gray-50 text-gray-500 rounded-lg hover:bg-[#8EBD22]/10 hover:text-[#8EBD22] transition-all border-gray-100" />
                      </div>
                    </Carousel>
                  ) : (
                    <ReviewsCard
                      review={{
                        name: approvedReviews[0]?.fullName,
                        message: approvedReviews[0]?.message,
                        rating: approvedReviews[0]?.rating,
                        role: "Client",
                        avatarUrl: "/home/ubuntu/upload/image.png",
                      }}
                    />
                  )}

                  {landing?.googleAvie && (
                    <a
                      href={`https://www.google.com/maps/place/Happy+Trip/@34.0202687,-6.8372415,722m/data=!3m2!1e3!4b1!4m6!3m5!1s0xda76de9c8728317:0x46dc98bb0096920e!8m2!3d34.0202687!4d-6.8372415!16s%2Fg%2F11r8xd0s0x?entry=ttu&g_ep=EgoyMDI1MDcxMy4wIKXMDSoASAFQAw%3D%3D`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-[#8EBD22]/10 hover:text-[#8EBD22] transition-all duration-200 text-xs font-medium border border-gray-100"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Voir tous les avis Google Maps
                    </a>
                  )}
                </div>
              )}

              {/* Tour Reviews Sidebar */}
              {tour.showReviews && (
                <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#8EBD22]" />
                    Avis de nos clients
                  </h3>
                  {approvedReviews.length === 0 ? (
                    <div className="text-center text-gray-400 py-6 text-sm">
                      Aucun avis pour le moment.
                    </div>
                  ) : approvedReviews.length > 1 ? (
                    <Carousel
                      plugins={[plugin.current]}
                      className="w-full"
                      opts={{ align: "start", loop: true }}
                      onMouseEnter={plugin.current.stop}
                      onMouseLeave={plugin.current.reset}
                    >
                      <CarouselContent>
                        {approvedReviews.map(
                          (review: Review, index: number) => (
                            <CarouselItem
                              key={index}
                              className="md:basis-1/1 lg:basis-1/1"
                            >
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
                      <div className="flex justify-center gap-2 mt-3">
                        <CarouselPrevious className="static w-8 h-8 bg-gray-50 text-gray-500 rounded-lg hover:bg-[#8EBD22]/10 hover:text-[#8EBD22] transition-all border-gray-100" />
                        <CarouselNext className="static w-8 h-8 bg-gray-50 text-gray-500 rounded-lg hover:bg-[#8EBD22]/10 hover:text-[#8EBD22] transition-all border-gray-100" />
                      </div>
                    </Carousel>
                  ) : (
                    <ReviewsCard
                      review={{
                        name: approvedReviews[0].fullName,
                        message: approvedReviews[0].message,
                        rating: approvedReviews[0].rating,
                        role: "Client",
                        avatarUrl: "/home/ubuntu/upload/image.png",
                      }}
                    />
                  )}
                  <div className="mt-4">
                    <ReviewModal tourId={tour.id} />
                  </div>
                </div>
              )}

              {/* Booking Steps */}
              {tour?.bookinSteps?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#8EBD22]" />
                    Comment réserver
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    La réservation est ouverte à la limite des places
                    disponibles.
                  </p>
                  <div className="space-y-3 relative">
                    <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#8EBD22]/40 to-transparent" />
                    {tour?.bookinSteps.map((ste: any) => (
                      <div
                        key={ste.orderIndex}
                        className="flex items-start gap-3 relative"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8EBD22]/10 flex items-center justify-center z-10 border-2 border-white">
                          <span className="text-xs font-bold text-[#8EBD22]">
                            {ste.orderIndex + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h4 className="text-sm font-semibold text-gray-800 mb-0.5">
                            {ste.title}
                          </h4>
                          <div className="text-xs text-gray-500">
                            <SafeHTML html={ste.description || ""} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                      GSM/Whatsapp: 06255555
                    </p>
                    <p className="text-xs text-gray-500">
                      Email: buildTravel@gmail.com
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          STICKY MOBILE BOTTOM CTA BAR
      ═══════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium block">
              À partir de
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-[#8EBD22]">
                {tour.priceDiscounted}
              </span>
              <span className="text-xs font-semibold text-gray-500">MAD</span>
            </div>
          </div>
          <Button
            onClick={scrollToBooking}
            className="bg-[#8EBD22] hover:bg-[#7aa91c] text-white font-semibold px-6 py-5 rounded-xl text-sm shadow-[0_4px_15px_rgba(142,189,34,0.3)]"
          >
            Réserver
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RESERVATION FORM
      ═══════════════════════════════════════════════════════════ */}
      <div id="reservation-form">
        <ReservationFormRedesigned
          fields={tour.reservationForm[0]?.fields || []}
          tourId={tour.id}
          basePrice={tour.priceDiscounted}
          travelDates={tour.dates || []}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          IMAGE GALLERY
      ═══════════════════════════════════════════════════════════ */}
      <TravelImageGallery images={tour.images} />

      {/* ═══════════════════════════════════════════════════════════
          GOOGLE MAPS EMBED
      ═══════════════════════════════════════════════════════════ */}
      {tour.googleMapsUrl && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 md:px-8 lg:px-24 pb-16"
        >
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center">
                <MapPinHouse className="w-5 h-5 text-[#8EBD22]" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Votre Destination
              </h2>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-100">
              <iframe
                className="w-full"
                src={tour.googleMapsUrl}
                width={600}
                height={400}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </motion.section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          FAQ SECTION
      ═══════════════════════════════════════════════════════════ */}
      <FaqSection faqData={sampleFaqData} />
    </div>
  );
};

export default TourDetailsRedesigned;

/* ═══════════════════════════════════════════════════════════════
   SECTION HEADER — Reusable component for section titles
═══════════════════════════════════════════════════════════════ */
const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center text-[#8EBD22]">
      {icon}
    </div>
    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   FAQ SECTION
═══════════════════════════════════════════════════════════════ */
const FaqSection = ({
  faqData,
  title = "Questions fréquemment posées",
}: any) => {
  return (
    <div>
      {faqData.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#8EBD22]/10 mb-4">
              <HelpCircle className="w-6 h-6 text-[#8EBD22]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {title}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Trouvez les réponses à vos questions
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqData?.map((item: any) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-none"
              >
                <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden hover:shadow-[0_4px_30px_rgba(0,0,0,0.06)] transition-shadow">
                  <AccordionTrigger className="flex justify-between items-center w-full p-5 text-left font-medium text-gray-700 hover:text-[#8EBD22] hover:no-underline transition-colors">
                    <span className="flex-1 mr-4 text-sm">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 pt-0 text-gray-500 text-sm leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   REVIEWS CARD — For tour reviews
═══════════════════════════════════════════════════════════════ */
const ReviewsCard = ({ review }: { review: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);

  const needsTruncation =
    review?.message?.split("\n").length > 4 || review?.message?.length > 200;

  return (
    <>
      <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < review?.rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-200",
              )}
            />
          ))}
        </div>

        <div className="relative">
          <p
            className={`text-gray-600 text-sm leading-relaxed italic ${
              !isExpanded && needsTruncation ? "line-clamp-3" : ""
            }`}
          >
            &quot;{review?.message}&quot;
          </p>

          {needsTruncation && !isExpanded && (
            <button
              onClick={() => setShowFullReview(true)}
              className="text-[#8EBD22] hover:text-[#7aa91c] text-xs font-semibold mt-1"
            >
              Voir plus
            </button>
          )}
        </div>

        <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
          <div className="w-8 h-8 rounded-full bg-[#8EBD22]/10 flex items-center justify-center mr-2.5 flex-shrink-0">
            <span className="text-xs font-bold text-[#8EBD22]">
              {review?.name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-xs">
              {review?.name}
            </p>
            <p className="text-gray-400 text-[10px]">{review?.role}</p>
          </div>
        </div>
      </div>

      {/* Full review dialog */}
      <AlertDialog open={showFullReview} onOpenChange={setShowFullReview}>
        <AlertDialogContent className="text-left max-h-[90vh] overflow-y-auto rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-5 h-5",
                    i < review?.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200",
                  )}
                />
              ))}
              <span className="text-sm font-semibold">
                Avis de {review?.name}
              </span>
            </AlertDialogTitle>
          </AlertDialogHeader>

          <p className="text-gray-600 italic text-sm leading-relaxed">
            &quot;{review?.message}&quot;
          </p>
          <div className="flex items-center mt-4">
            <div className="w-10 h-10 rounded-full bg-[#8EBD22]/10 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-sm font-bold text-[#8EBD22]">
                {review?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {review?.name}
              </p>
              <p className="text-gray-400 text-xs">{review?.role}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#8EBD22] text-white px-6 py-2 rounded-xl cursor-pointer hover:bg-[#7aa91c]">
              Fermer
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   REVIEW ITEM — For Google reviews carousel
═══════════════════════════════════════════════════════════════ */
const ReviewItem = ({ review }: { review: any }) => {
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedReview, setSelectedReview] = React.useState<any>(null);

  React.useEffect(() => {
    if (textRef.current) {
      setIsClamped(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [review.text]);

  const getInitialsAvatar = (fullName: string) => {
    const nameParts = fullName.trim().split(" ");
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
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
          className={`w-3.5 h-3.5 ${
            i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
          }`}
        />
      ));
  };

  const avatarColors = [
    "bg-rose-500",
    "bg-sky-500",
    "bg-[#8EBD22]",
    "bg-violet-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
  ];

  const getAvatarColor = (name: string) => {
    const index = name ? name.charCodeAt(0) % avatarColors.length : 0;
    return avatarColors[index];
  };

  const formatRelativeTime = (inputDate: string | Date): string => {
    const date =
      typeof inputDate === "string" ? new Date(inputDate) : inputDate;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    if (diffInSeconds >= intervals.year) {
      const years = Math.floor(diffInSeconds / intervals.year);
      return `${years} ${years === 1 ? "an" : "ans"}`;
    }
    if (diffInSeconds >= intervals.month) {
      const months = Math.floor(diffInSeconds / intervals.month);
      return `${months} mois`;
    }
    if (diffInSeconds >= intervals.week) {
      const weeks = Math.floor(diffInSeconds / intervals.week);
      return `${weeks} ${weeks === 1 ? "semaine" : "semaines"}`;
    }
    if (diffInSeconds >= intervals.day) {
      const days = Math.floor(diffInSeconds / intervals.day);
      return `${days} ${days === 1 ? "jour" : "jours"}`;
    }
    if (diffInSeconds >= intervals.hour) {
      const hours = Math.floor(diffInSeconds / intervals.hour);
      return `${hours}h`;
    }
    if (diffInSeconds >= intervals.minute) {
      const minutes = Math.floor(diffInSeconds / intervals.minute);
      return `${minutes}m`;
    }

    return "À l'instant";
  };

  return (
    <CarouselItem className="pl-2">
      <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {review.profilePhotoUrl ? (
              <img
                src={review.profilePhotoUrl}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(review.authorName)}`}
              >
                {getInitialsAvatar(review.authorName)}
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-800 text-xs">
                {review.authorName}
              </h4>
              <span className="text-gray-400 text-[10px]">
                il y a {formatRelativeTime(review.time)}
              </span>
            </div>
          </div>
          <img
            src="/icons/google-logo-Photoroom.png"
            alt=""
            className="w-4 h-4"
          />
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-2">
          {renderStars(review.rating)}
        </div>

        {/* Text */}
        <div className="mb-2">
          <p
            ref={textRef}
            className={`text-gray-600 text-xs leading-relaxed ${
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
              className="text-[#8EBD22] hover:text-[#7aa91c] text-[10px] font-semibold mt-0.5"
            >
              Voir plus
            </button>
          )}
        </div>

        {review.language && (
          <img
            src={review.language}
            alt=""
            className="w-full h-28 rounded-lg object-cover mt-2"
          />
        )}
      </div>

      <AlertDialog
        open={!!selectedReview}
        onOpenChange={(open) => !open && setSelectedReview(null)}
      >
        <AlertDialogContent className="text-left max-h-[90vh] overflow-y-auto rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {selectedReview &&
                [...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < selectedReview.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200",
                    )}
                  />
                ))}
              <span className="text-sm">
                Avis de {selectedReview?.authorName}
              </span>
            </AlertDialogTitle>
          </AlertDialogHeader>

          <p className="text-gray-600 italic text-sm leading-relaxed">
            &quot;{selectedReview?.text}&quot;
          </p>

          <div className="flex items-center gap-2.5 mt-4">
            {review.profilePhotoUrl ? (
              <img
                src={review.profilePhotoUrl}
                alt=""
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(review.authorName)}`}
              >
                {getInitialsAvatar(review.authorName)}
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-800 text-sm">
                {review.authorName}
              </h4>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#8EBD22] text-white px-6 py-2 rounded-xl cursor-pointer hover:bg-[#7aa91c]">
              Fermer
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CarouselItem>
  );
};
