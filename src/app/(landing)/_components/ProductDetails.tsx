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
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Program, Review, Tour, TourDate } from "@prisma/client";
import {
  ArrowRightIcon,
  BadgeCheck,
  BadgePlus,
  BadgeX,
  Boxes,
  CalendarIcon,
  ChartNoAxesColumnDecreasing,
  ChevronLeft,
  ChevronRight,
  Hotel,
  Map,
  MapPin,
  MapPinHouse,
  MessageCircle,
  MountainSnow,
  Star,
  Tickets,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; // Optional: if you want autoplay
import { toast } from "react-toastify";
import DiscountTimerProduct from "./DiscountBadgeProductPage";
import { ReviewModal } from "./ReviewsForm";

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
const TourDetails = ({ tour, programss }: Props) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<TourDate[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [sampleFaqData, setSampleFaqData] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [landing, setLanding] = useState<any>(null);

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  // ✅ Filter available dates once on mount
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
  }, [tour.dates]);

  // ✅ Group async fetches into one request
  useEffect(() => {
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

    fetchData();
  }, []);

  // ✅ Memoize computed values
  const approvedReviews = useMemo(
    () => tour.reviews?.filter((r: any) => r.status === true) ?? [],
    [tour.reviews]
  );

  const averageRating = useMemo(() => {
    const total = approvedReviews.reduce(
      (sum: any, r: any) => sum + r.rating,
      0
    );
    return approvedReviews.length > 0
      ? (total / approvedReviews.length).toFixed(1)
      : "0";
  }, [approvedReviews]);

  const reviewCount = approvedReviews.length;

  const includes = useMemo(
    () =>
      (tour.inclus ?? "")
        .split(";")
        .map((s: any) => s.trim())
        .filter(Boolean),
    [tour.inclus]
  );

  const excludes = useMemo(
    () =>
      (tour.exclus ?? "")
        .split(";")
        .map((s: any) => s.trim())
        .filter(Boolean),
    [tour.exclus]
  );

  const extract = useMemo(
    () =>
      (tour.extracts ?? "")
        .split(";")
        .map((s: any) => s.trim())
        .filter(Boolean),
    [tour.extracts]
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
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
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

  if (!tour) {
    return <Loading />;
  }
  return (
    <div className="relative">
      <div className="block lg:hidden bg-[#F6F3F2]">
        {tour.discountEndDate &&
          tour.showDiscount &&
          tour.priceOriginal !== tour.priceDiscounted && (
            <DiscountTimerProduct endDate={tour.discountEndDate?.toString()} />
          )}
      </div>

      <div className="bg-[#F6F3F2] p-4 md:p-8 lg:p-8">
        <div className="flex flex-col-reverse lg:flex-row lg:gap-8 gap-4 items-center">
          <div className="lg:w-1/2 lg:py-6">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5" />
              {tour.type === "NATIONAL" && (
                <span
                  className="text-gray-500 hover:underline cursor-pointer"
                  onClick={() =>
                    (window.location.href = "/destination/national")
                  }
                >
                  Maroc
                </span>
              )}
              {tour.type === "INTERNATIONAL" && (
                <span
                  className="text-gray-600 hover:underline cursor-pointer"
                  onClick={() =>
                    (window.location.href = "/destination/international")
                  }
                >
                  International
                </span>
              )}
              <span className="mx-2">&gt;</span>
              <span
                className="text-gray-600 hover:underline cursor-pointer"
                onClick={() =>
                  (window.location.href = `/destination/international?destinations=${tour.destinations[0]?.id}`)
                }
              >
                {tour.destinations[0]?.name}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {tour.title}
            </h1>

            {tour.showReviews && (
              <div className="flex items-center mb-6">
                <div className="flex mr-2">
                  <StarRatingDisplay averageRating={parseInt(averageRating)} />
                </div>
                <span className="text-gray-600 text-sm ml-1">
                  ({reviewCount} {reviewCount === 1 ? "avis" : "avis"}) •{" "}
                  {averageRating}/5
                </span>
              </div>
            )}

            <div className="">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Description
              </h2>

              <div
                className={clsx(
                  "text-gray-700 leading-relaxed transition-all duration-300",
                  !expanded && "line-clamp-6"
                )}
              >
                <SafeHTML html={tour.description || ""} />
              </div>

              {tour.description && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-sm text-[#8ebd21] hover:underline focus:outline-none"
                >
                  {expanded ? "Voir moins" : "Voir plus"}
                </button>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 w-full h-full relative">
            <div className="lg:block hidden">
              {tour.discountEndDate &&
                tour.showDiscount &&
                tour.priceOriginal !== tour.priceDiscounted &&
                tour.discountEndDate && (
                  <DiscountTimerProduct
                    endDate={tour.discountEndDate.toString()}
                  />
                )}
            </div>
            <img
              src={tour.imageUrl || ""} // Remplacez par le chemin réel ou l'URL de votre image
              alt="Randonnée Atlas Central"
              className="rounded-lg shadow-md w-full lg:h-[60vh] h-[30vh] object-cover"
              // Pour Next.js, utilisez <Image />
              // import Image from 'next/image';
              // <Image src="/path/to/your/image.jpg" alt="..." width={600} height={400} className="rounded-lg shadow-md" />
            />
          </div>
        </div>
      </div>
      <div className="bg-white">
        {/* Top Info Bar */}
        <div className="bg-[#8ebd21] text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 mb-4">
          <div className="flex flex-col lg:hidden  items-center  px-2 lg:col-span-2 gap-4 bg-[#47663B] text-white py-4  font-semibold">
            {/* Price Section - Now shows price for selected date */}
            <div className="flex items-center gap-2">
              <Tickets className="w-6 h-6" />
              <span className="whitespace-nowrap text-2xl font-bold">
                {selectedDate
                  ? `${tour.type === "INTERNATIONAL" ? "À partir de " : ""}${
                      tour.priceDiscounted
                    } MAD`
                  : "Sélectionnez une date"}
              </span>
            </div>

            {/* Date Dropdown and Booking Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Modern Dropdown */}
              {availableDates.length > 0 ? (
                <div className="relative w-full lg:w-auto">
                  <select
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`
                      appearance-none text-center 
                      bg-white/10 border border-white/20 rounded-full
                      pl-4 pr-8
                      py-2
                      text-white
                      focus:outline-none focus:ring-2 focus:ring-white/30
                      w-full
                      text-base
                      md:pl-3 md:pr-7 md:py-1.5 md:text-sm
                    `}
                  >
                    {availableDates
                      .filter((date) => date.visible)
                      .map((date: any) => (
                        <option
                          key={date.id}
                          value={date.id}
                          className="text-gray-900"
                        >
                          {formatDate(date.startDate)} - {date?.price} MAD
                        </option>
                      ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className="h-4 w-4 md:h-3 md:w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="text-white/80 italic text-base md:text-sm">
                  Aucune date disponible actuellement
                </div>
              )}

              {/* Booking Button - Disabled if no dates available */}
              <div>
                <div
                  className={`px-6 py-2 rounded-full  text-sm transition-colors whitespace-nowrap w-full sm:w-auto text-center ${
                    availableDates.length > 0
                      ? "bg-white text-[#47663B] hover:bg-lime-700 hover:text-white"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    const el = document.getElementById("reservation-form");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {availableDates.length > 0 ? "Réserver" : "Complet"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex lg:hidden flex-col gap-2 items-start lg:items-center lg:px-0 px-8 justify-start lg:text-nowrap text-xl md:text-lg lg:justify-center py-4">
            <div className="flex items-center gap-2">
              <img
                src={"/icons/calendar.png"}
                className="w-7 h-7 md:w-6 md:h-6"
              />
              <span className="md:text-lg text-xl">Prochaine date</span>
            </div>
            <div className="md:text-base text-xl w-full text-center  lg:ml-0 font-semibold bg-white/20 px-4 py-1 rounded-full shadow text-white border border-white/30">
              {getNextTourDate || "Aucune date à venir"}
            </div>
          </div>
          <div className="flex items-center lg:px-0 px-8 justify-start lg:text-nowrap text-xl md:text-lg lg:justify-center gap-2 w-full lg:border-r-2 border-t-2 lg:border-t-0 lg:border-b-0 py-4 border-white lg:my-4 ">
            <img
              src={"/icons/night-mode.png"}
              className="w-7 h-7 md:w-6 md:h-6"
            />{" "}
            {/* Replace with moon/duration icon */}
            <span className="md:text-lg text-xl">
              {tour.durationDays} Jours / {tour.durationNights} Nuitées
            </span>
          </div>

          <div className="lg:flex hidden flex-col gap-2 items-start lg:items-center lg:px-0 px-8 justify-start lg:text-nowrap text-xl md:text-lg lg:justify-center py-4">
            <div className="flex items-center gap-2">
              <img
                src={"/icons/calendar.png"}
                className="w-7 h-7 md:w-6 md:h-6"
              />
              <span className="md:text-lg text-xl">Prochaine date</span>
            </div>
            <div className="md:text-base text-center  text-xl w-full  lg:ml-0 font-semibold bg-white/20 px-4 py-1 rounded-full shadow text-white border border-white/30">
              {getNextTourDate || "Aucune date à venir"}
            </div>
          </div>

          <div className=" flex-col lg:flex hidden  items-center  px-2 lg:col-span-2 gap-4 bg-[#47663B] text-white py-4  font-semibold">
            {/* Price Section - Now shows price for selected date */}
            <div className="flex items-center gap-2">
              <Tickets className="w-6 h-6" />
              <span className="whitespace-nowrap text-2xl font-bold">
                {selectedDate
                  ? `${tour.type === "INTERNATIONAL" ? "À partir de " : ""}${
                      tour.priceDiscounted
                    } MAD`
                  : "Sélectionnez une date"}
              </span>
            </div>

            {/* Date Dropdown and Booking Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Modern Dropdown */}
              {availableDates.length > 0 ? (
                <div className="relative w-full lg:w-auto">
                  <select
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`
                      appearance-none text-center 
                      bg-white/10 border border-white/20 rounded-full
                      pl-4 pr-8
                      py-2
                      text-white
                      focus:outline-none focus:ring-2 focus:ring-white/30
                      w-full
                      text-base
                      md:pl-3 md:pr-7 md:py-1.5 md:text-sm
                    `}
                  >
                    {availableDates
                      .filter((date) => date.visible)
                      .map((date: any) => (
                        <option
                          key={date.id}
                          value={date.id}
                          className="text-gray-900"
                        >
                          {formatDate(date.startDate)} - {date?.price} MAD
                        </option>
                      ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className="h-4 w-4 md:h-3 md:w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="text-white/80 italic text-base md:text-sm">
                  Aucune date disponible actuellement
                </div>
              )}

              {/* Booking Button - Disabled if no dates available */}
              <div>
                <div
                  className={`px-6 py-2 rounded-full cursor-pointer  text-sm transition-colors whitespace-nowrap w-full sm:w-auto text-center ${
                    availableDates.length > 0
                      ? "bg-white text-[#47663B] hover:bg-lime-700 hover:text-white"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    const el = document.getElementById("reservation-form");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {availableDates.length > 0 ? "Réserver" : "Complet"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-2 lg:hidden px-2">
          <div className="bg-[#F6F3F2] rounded-lg shadow border border-slate-200 p-4 space-y-4">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4  border-b pb-2">
              Voyage Details
            </h3>

            {/* Detail Item */}
            {tour.showDifficulty && (
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <ChartNoAxesColumnDecreasing className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with level icon */}
                  <span className="text-gray-600 font-medium w-24">Niveau</span>
                </div>

                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <img
                      src="/boot.png"
                      alt=""
                      key={i}
                      className={
                        i < tour.difficultyLevel
                          ? "bg-[#8ebd21] w-8 rounded-md p-1 h-8"
                          : "bg-gray-300 w-8 rounded-md p-1 h-8"
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Detail Item */}
            <div className="flex items-center gap-3 border-b pb-3 justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-6 h-6 text-gray-400" />{" "}
                {/* Replace with destination icon */}
                <span className="text-gray-600 font-medium w-24">
                  Destination
                </span>
              </div>
              <p>
                {tour.destinations.map((des: any, index: any) => (
                  <span className="text-gray-800" key={index}>
                    {des.name}
                  </span>
                ))}
              </p>
            </div>

            {/* Detail Item */}
            <div className="flex items-center gap-3 border-b pb-3 justify-between">
              <div className="flex items-center gap-2">
                <MountainSnow className="w-6 h-6 text-gray-400" />{" "}
                {/* Replace with theme icon */}
                <span className="text-gray-600 font-medium w-24">
                  Thématique
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {tour.natures.map((des: any, index: any) => (
                  <div
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                    key={index}
                  >
                    {des.name}{" "}
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Item */}
            <div className="flex items-center gap-3 border-b pb-3 justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-gray-400" />{" "}
                {/* Replace with group size icon */}
                <span className="text-gray-600 font-medium ">
                  Taille du groupe
                </span>
              </div>

              <span className="text-gray-800">{tour.groupSizeMax}</span>
            </div>

            {/* Detail Item */}
            <div className="flex items-center gap-3 border-b pb-3 justify-between">
              <div className="flex items-center gap-2">
                <Hotel className="w-6 h-6 text-gray-400" />{" "}
                {/* Replace with accommodation icon */}
                <span className="text-gray-600 font-medium w-24">
                  Hébergement
                </span>
              </div>
              <span className="text-gray-800">{tour.accommodationType}</span>
            </div>

            {/* Detail Item */}
            <div className="flex items-center gap-3 pb-3 justify-between">
              <div className="flex items-center justify-between gap-2">
                <Boxes className="w-6 h-6 text-gray-400" />{" "}
                {/* Replace with services icon */}
                <span className="text-gray-600 font-medium w-24">Services</span>
              </div>
              <div className="flex flex-col gap-2">
                {tour.services?.map((ser: any, index: any) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
                  >
                    {ser.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Reserve Button */}
            <button
              className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors mt-4"
              onClick={() => {
                const el = document.getElementById("reservation-form");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Réserver
            </button>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:py-4 py-2 px-2 lg:px-12 ">
          {/* Left Column (Video & Itinerary) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Section */}
            {tour.videoUrl && (
              <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
                {/* Placeholder for video player - replace with actual video embed */}
                <img
                  src="/home/ubuntu/upload/image.png"
                  alt="Video placeholder showing pool area"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={tour.videoUrl || ""}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {/* Add controls overlay if needed */}
              </div>
            )}

            {/* Itinerary Section */}
            <div className="mt-8">
              <h1 className="text-2xl font-bold">Programme : </h1>
            </div>
            <Accordion
              type="multiple" // Allows multiple items to stay open
              className="space-y-3"
              defaultValue={[programss[0]?.id]} // Initial open item (as array)
            >
              {programss.map((prog: Program) => (
                <AccordionItem value={prog.id} key={prog.id}>
                  <AccordionTrigger className="bg-[#8ebd21] text-left rounded-t-lg cursor-pointer px-4 py-3 text-white">
                    {prog.title}
                  </AccordionTrigger>
                  <AccordionContent className="p-2 border border-slate-200 shadow-xs rounded-b-lg">
                    <div className="grid lg:grid-cols-3 grid-cols-1 lg:p-4 p-2 gap-2">
                      <div className="col-span-2">
                        <SafeHTML html={prog.description || ""} />
                      </div>
                      <div className="col-span-1">
                        {prog.imageUrl && (
                          <img
                            src={prog.imageUrl || ""}
                            alt={prog.title || "Program image"}
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="bg-white p-6 lg:px-12 md:p-8 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Included Section */}
                {tour.inclus !== "" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      Ce qui est inclus dans le voyage
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 pb-2 border-b border-gray-200">
                      Les éléments qui sont inclus dans le tarif du voyage.
                    </p>
                    <ul className="list-none p-0 m-0">
                      {includes.map((item: any, index: any) => (
                        <div
                          key={`inc-${index}`}
                          className="flex items-center gap-2 mt-2"
                        >
                          <span className="pt-1 text-green-600">
                            <BadgeCheck className="w-6.5 h-6.5 min-w-[20px] min-h-[20px] bg-green-100 rounded-full p-1" />
                          </span>
                          <p className="break-words">{item}</p>
                        </div>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Excluded Section */}
                {tour.exclus !== "" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      Ce qui est n&apos;est pas inclus dans le voyage
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 pb-2 border-b border-gray-200">
                      Les éléments qui ne sont pas inclus dans le
                      tarif du voyage.
                    </p>
                    <ul className="list-none p-0 m-0">
                      {excludes.map((item: any, index: any) => (
                        <div
                          key={`exc-${index}`}
                          className="flex items-center gap-2 mt-2"
                        >
                          <span className="pt-1 text-red-600">
                            <BadgeX className="w-6.5 h-6.5 min-w-[20px] min-h-[20px] bg-red-100 rounded-full p-1" />
                          </span>
                          <p className="break-words">{item}</p>
                        </div>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {tour.showChecklist &&
                tour.titleCkecklist &&
                tour.descriptionCkecklist && (
                  <div>
                    <h2 className="text-xl font-bold mt-6 text-gray-800 mb-2 pb-2 border-b border-gray-200">
                      {tour.titleCkecklist ||
                        "Liste de vérification pour ce voyage"}
                    </h2>
                    <div className="bg-white p-4  ">
                      <SafeHTML html={tour.descriptionCkecklist || ""} />
                    </div>
                  </div>
                )}
              {tour?.checklist?.length > 0 && (
                <div className="">
                  {/* Steps Section */}
                  <div className="space-y-2 mb-10">
                    {tour?.checklist.map((ste: any) => (
                      <div key={ste.orderIndex}>
                        <h2 className="text-xl font-bold mt-6 text-gray-800 mb-2 pb-2 border-b border-gray-200">
                          {ste.title}
                        </h2>
                        <div className="bg-white p-4  ">
                          <SafeHTML html={ste.description || ""} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tour.extracts !== "" && (
                <div>
                  <h2 className="text-xl font-bold mt-3 text-gray-800 mb-1">
                    Les suppléments ou les extras pour ce voyage.
                  </h2>
                  <p className="text-sm text-gray-500 mb-4 pb-2 border-b border-gray-200">
                    Les éléments optionnels ou les frais supplémentaires qui
                    peuvent s&apos;ajouter au prix du voyage.
                  </p>
                  <ul className="list-none p-0 m-0">
                    {extract.map((item: any, index: any) => (
                      <div
                        key={`exc-${index}`}
                        className="flex items-center gap-2 mt-2"
                      >
                        <span className="pt-1 text-blue-600">
                          <BadgePlus className="w-6.5 h-6.5 min-w-[20px] min-h-[20px] bg-red-100 rounded-full p-1" />
                        </span>
                        <p className="break-words">{item}</p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 space-y-2 ">
            <div className="bg-[#F6F3F2] rounded-lg shadow border lg:block hidden border-slate-200 p-4 space-y-4">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4  border-b pb-2">
                Voyage Details
              </h3>

              {/* Detail Item */}
              {tour.showDifficulty && (
                <div className="flex items-center gap-3 border-b pb-3 justify-between">
                  <div className="flex items-center gap-2">
                    <ChartNoAxesColumnDecreasing className="w-6 h-6 text-gray-400" />{" "}
                    {/* Replace with level icon */}
                    <span className="text-gray-600 font-medium w-24">
                      Niveau
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <img
                        src="/boot.png"
                        alt=""
                        key={i}
                        className={
                          i < tour.difficultyLevel
                            ? "bg-[#8ebd21] w-8 rounded-md p-1 h-8"
                            : "bg-gray-300 w-8 rounded-md p-1 h-8"
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Detail Item */}
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with destination icon */}
                  <span className="text-gray-600 font-medium w-24">
                    Destination
                  </span>
                </div>
                <p>
                  {tour.destinations.map((des: any, index: any) => (
                    <span className="text-gray-800" key={index}>
                      {des.name}
                    </span>
                  ))}
                </p>
              </div>

              {/* Detail Item */}
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <MountainSnow className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with theme icon */}
                  <span className="text-gray-600 font-medium w-24">
                    Thématique
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tour.natures.map((des: any, index: any) => (
                    <div
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                      key={index}
                    >
                      {des.name}{" "}
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Item */}
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with group size icon */}
                  <span className="text-gray-600 font-medium ">
                    Taille du groupe
                  </span>
                </div>

                <span className="text-gray-800">{tour.groupSizeMax}</span>
              </div>

              {/* Detail Item */}
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <Hotel className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with accommodation icon */}
                  <span className="text-gray-600 font-medium w-24">
                    Hébergement
                  </span>
                </div>
                <span className="text-gray-800">{tour.accommodationType}</span>
              </div>

              {/* Detail Item */}
              <div className="flex items-center gap-3 pb-3 justify-between">
                <div className="flex items-center gap-2 justify-between">
                  <Boxes className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with services icon */}
                  <span className="text-gray-600 font-medium w-24">
                    Services
                  </span>
                </div>
                <div className="gap-2 flex flex-col">
                  {tour.services?.map((ser: any, index: any) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
                    >
                      {ser.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reserve Button */}
              <button
                className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors mt-4"
                onClick={() => {
                  const el = document.getElementById("reservation-form");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Réserver
              </button>
            </div>

            {landing?.reviews && (
              <div className="bg-[#F6F3F2] my-4 p-6 md:p-8 rounded-xl border border-slate-200 shadow-lg max-w-2xl mx-auto font-sans">
                <div className="flex items-center justify-center mb-4 gap-3">
                  {/* Reviews Section <img
                    src="/icons/google-logo-Photoroom.png"
                    alt=""
                    className="w-6 h-6"
                  />*/}
                  <h2 className="text-xl font-bold text-gray-800  flex items-center justify-center text-center">
                    Ce que disent nos voyageurs sur Happy Trip
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
                      <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-[#8ebd21] rounded-full shadow-lg hover:bg-[#8ebd21] hover:text-white transition-all border border-gray-200 opacity-0 group-hover:opacity-100 z-10" />
                      <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-[#8ebd21] rounded-full shadow-lg hover:bg-[#8ebd21] hover:text-white transition-all border border-gray-200 opacity-0 group-hover:opacity-100 z-10" />
                    </div>

                    {/* Mobile Navigation */}
                    <div className="sm:hidden flex justify-center gap-4 mt-6">
                      <CarouselPrevious className="static w-10 h-10 bg-white text-[#8ebd21] rounded-full shadow hover:bg-[#8ebd21] hover:text-white transition-all border border-gray-200">
                        <ChevronLeft className="w-5 h-5" />
                      </CarouselPrevious>
                      <CarouselNext className="static w-10 h-10 bg-white text-[#8ebd21] rounded-full shadow hover:bg-[#8ebd21] hover:text-white transition-all border border-gray-200">
                        <ChevronRight className="w-5 h-5" />
                      </CarouselNext>
                    </div>
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
                {landing?.googleAvie && (
                  <div className="text-center ">
                    <a
                      href={`https://www.google.com/maps/place/Happy+Trip/@34.0202687,-6.8372415,722m/data=!3m2!1e3!4b1!4m6!3m5!1s0xda76de9c8728317:0x46dc98bb0096920e!8m2!3d34.0202687!4d-6.8372415!16s%2Fg%2F11r8xd0s0x?entry=ttu&g_ep=EgoyMDI1MDcxMy4wIKXMDSoASAFQAw%3D%3D`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#8ebd21] text-white rounded-lg hover:bg-[#6db05e] transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <Star className="w-5 h-5" />
                      <span>Voir tous les avis sur Google Maps</span>
                    </a>
                  </div>
                )}
              </div>
            )}
            {tour.showReviews && (
              <div className="bg-[#F6F3F2]  p-6 md:p-8 rounded-xl border border-slate-200 shadow-lg max-w-2xl mx-auto font-sans">
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
                      {approvedReviews.map((review: Review, index: number) => (
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
                      ))}
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
              <div className="w-full max-w-4xl mx-auto p-6 md:p-8 font-sans bg-[#F6F3F2] rounded-lg shadow border border-slate-200">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
                  Comment faire la réservation
                </h2>
                <p className="text-center text-sm text-gray-600 mb-8">
                  La réservation est ouverte à la limite des places disponibles.
                </p>
                {/* Steps Section */}
                <div className="space-y-2 mb-10">
                  {tour?.bookinSteps.map((ste: any) => (
                    <div
                      key={ste.orderIndex}
                      className="flex items-start space-x-2 p-4 bg-white rounded-lg border border-blue-100"
                    >
                      <div className="flex items-center justify-center w-4 h-4 p-3 rounded-full text-white bg-[#8ebd21] font-semibold text-xs shadow">
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
                    GSM/Whatsapp: 0628324880
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: happy.trip.voyage@gmail.com
                  </p>
                </div>
                <div className="text-center mt-2">
                  <CombinedButtons
                    whatsappProps={{
                      phoneNumber: "212628324880",
                      message: "Bonjour je souhaite faire une réservation",
                    }}
                    reservationFormId="reservation-form"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="reservation-form">
        <ReservationsForm
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
      <div className="bg-[#F6F3F2] p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center">
          <CalendarIcon />
          Dates & prix
        </h2>
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-5 gap-4 mb-2 text-sm font-semibold text-gray-600 px-4">
          <span>De</span>
          <span>Au</span>
          <span>Statut du voyage</span>
          <span>Prix</span>
          <span>Réservez votre aventure</span>
        </div>
        {/* Data Rows */}
        <div className="space-y-2">
          {availableDates?.map((item: any, index: any) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center p-3 md:px-4 rounded border-b-2 border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-sm text-gray-700">
                <span className="md:hidden font-semibold">De: </span>
                {formatDate(item.startDate)}
              </div>
              <div className="text-sm text-gray-700">
                <span className="md:hidden font-semibold">Au: </span>
                {formatDate(item.endDate)}
              </div>
              <div className="text-sm font-bold text-gray-800">
                <span className="md:hidden font-semibold">Prix: </span>
                {item?.description}
              </div>
              <div className="text-sm font-bold text-gray-800">
                <span className="md:hidden font-semibold">Prix: </span>
                {item.price !== 0 ? item.price : tour.priceDiscounted}DH
              </div>
              <div className="mt-2 md:mt-0">
                <button
                  className="w-full md:w-auto bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                  onClick={() => {
                    const el = document.getElementById("reservation-form");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Réserver
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {tour.googleMapsUrl && (
        <div className="bg-white p-6 lg:px-12 rounded-lg shadow-sm">
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
      {/*<TravelImageGallery tour={tour.programs}/>*/}
      <FaqSection faqData={sampleFaqData} />
    </div>
  );
};

export default TourDetails;
import { Rating } from "react-simple-star-rating";
import WhatsappShare from "./whatsappShare";
import ReservationsForm from "./reservationsForm";
import clsx from "clsx";
import TravelImageGallery from "./gallery";
import { GetFAQ, getLanding } from "@/actions/saveLandingConfig";
import { ca } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { getGoogleReview } from "@/actions/googleReviews";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getForProductDetails } from "@/actions/toursActions";

const StarRatingDisplay = ({ averageRating }: { averageRating: number }) => {
  return (
    <div className="flex items-center">
      <Rating
        readonly
        initialValue={averageRating}
        size={20}
        allowFraction
        SVGstyle={{ display: "inline-block" }}
        fillColor="#facc15" // Tailwind's yellow-400
        emptyColor="#d1d5db" // Tailwind's gray-300
      />
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
      <Card className="mx-2 border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
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
                className="text-[#8ebd21] hover:text-blue-800 text-sm font-medium mt-1"
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
            <AlertDialogCancel className="bg-[#8EBD22] text-white px-4 py-1 rounded-lg cursor-pointer">
              Fermer
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
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
                className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden"
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

interface CombinedButtonsProps {
  whatsappProps: any;
  reservationFormId: string; // ID of your reservation form element
}

const CombinedButtons: React.FC<CombinedButtonsProps> = ({
  whatsappProps,
  reservationFormId,
}) => {
  const [showReservationButton, setShowReservationButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const formElement = document.getElementById(reservationFormId);
      if (formElement) {
        const formPosition = formElement.getBoundingClientRect().top;
        // Hide reservation button when form is in view (with some threshold)
        setShowReservationButton(formPosition > window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reservationFormId]);

  const scrollToReservation = () => {
    const formElement = document.getElementById(reservationFormId);
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-6 right-24 flex flex-col gap-4 items-end z-[1000]">
      <WhatsappShare {...whatsappProps} />
      {showReservationButton && (
        <button
          onClick={scrollToReservation}
          className="reservation-btn bg-gradient-to-r from-[#9fe300] cursor-pointer to-[#7bc200] text-white font-medium rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100 group"
          aria-label="Scroll to reservation form"
        >
          <span className="relative flex items-center justify-center gap-2">
            <span>Réservation</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      )}

      <style jsx>{`
        .reservation-scroll-btn {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .reservation-scroll-btn {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
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
      "bg-green-500",
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
        className="bg-white h-full text-slate-700 border border-gray-100 p-4 rounded-lg mb-4 shadow-lg mx-auto max-w-md"
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
            <AlertDialogCancel className="bg-[#8EBD22] text-white px-4 py-1 rounded-lg cursor-pointer">
              Fermer
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CarouselItem>
  );
};
