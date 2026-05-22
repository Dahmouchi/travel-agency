/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  MapPin,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { getGoogleReview } from "@/actions/googleReviews";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const GoogleReviewsAPI = ({ googleAvie }: { googleAvie: any }) => {
  const [reviews, setReviews] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [selectedReview, setSelectedReview] = useState<{
    text: string;
    authorName: string;
    rating: number;
  } | null>(null);
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getGoogleReview();
        setReviews(response || []);
      } catch (err: any) {
        console.error("Error loading reviews:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse flex justify-center mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            </div>
            <p className="mt-4 text-gray-600">Loading Google reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto border border-red-100">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading Error
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                <p>To use this feature:</p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                    Get a Google Places API key
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                    Set up a backend proxy to avoid CORS
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                    Pass the API key as a prop
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:py-16 bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center lg:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-50 rounded-full">
            <MapPin className="w-5 h-5 text-[#8EBD22]" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Ce que disent nos voyageurs sur Happy Trip
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Avis authentiques récupérés directement depuis Google Maps
          </p>
        </div>

        {/* Reviews Carousel */}
        {reviews.length > 0 ? (
          <div className="relative  lg:px-16 py-4">
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
              <CarouselContent className="-ml-1 space-x-2 lg:px-8 lg:py-4 px-4 py-2">
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
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
              <Star className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Reviews Yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              This location doesn't have any reviews on Google Maps yet.
            </p>
          </div>
        )}

        {/* Google Maps Link */}
        {googleAvie && (
          <div className="text-center mb-12">
            <a
              href={`https://www.google.com/maps/place/?q=place_id:ChIJF4NyyOltpw0RDpKWALuY3EY`}
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
    </section>
  );
};

export default GoogleReviewsAPI;

const StarRating = ({ rating, size = "w-4 h-4" }: any) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-100 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: any) => {
  const getInitials = (name: any) => {
    return name
      .split(" ")
      .map((word: any) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format relative time (e.g., "2 months ago" -> "2mo ago")
  const formatRelativeTime = (timeStr: string) => {
    return timeStr
      .replace(/a month/i, "1mo")
      .replace(/months/i, "mo")
      .replace(/a week/i, "1wk")
      .replace(/weeks/i, "wk")
      .replace(/a day/i, "1d")
      .replace(/days/i, "d")
      .replace(/a year/i, "1yr")
      .replace(/years/i, "yr");
  };

  return (
    <Card className="h-full m-2 hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-11 h-11 border-2 border-white shadow-sm group-hover:border-blue-100 transition-colors">
            <AvatarImage
              src={review.profile_photo_url}
              alt={review.author_name}
              className="group-hover:scale-105 transition-transform"
            />
            <AvatarFallback className="bg-blue-50 text-[#8ebd21] font-medium">
              {getInitials(review.author_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h4 className="font-semibold text-gray-900 truncate">
                {review.author_name}
              </h4>
              <Badge variant="outline" className="text-xs py-1 px-2 bg-gray-50">
                <Calendar className="w-3 h-3 mr-1.5" />
                {formatRelativeTime(review.relative_time_description)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={review.rating} />
              <span className="text-sm font-medium text-gray-600">
                {review.rating.toFixed(1)}/5
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed line-clamp-5">
          {review.text}
        </p>
      </CardContent>
    </Card>
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
    <CarouselItem className="lg:basis-1/3">
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
