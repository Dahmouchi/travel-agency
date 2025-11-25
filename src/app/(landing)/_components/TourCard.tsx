"use client";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Star,
  Users,
  Eye,
  Mountain,
  Timer,
  CalendarDays,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Review } from "@prisma/client";

export const TourCard = ({ tour, index }: { tour: any; index: number }) => {
  const router = useRouter();

  const approvedReviews =
    tour.reviews?.filter((review: Review) => review.status === true) ?? [];

  const reviewCount = approvedReviews.length;
  const averageRating =
    reviewCount > 0
      ? approvedReviews.reduce(
          (sum: any, review: any) => sum + review.rating,
          0
        ) / reviewCount
      : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ y: -6 }}
      className="h-full group"
    >
      <Card className="py-0 overflow-hidden h-full flex flex-col bg-card border-border/40 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500">
        {/* IMAGE */}
        <div className="relative h-64 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.65 }}
            src={tour?.imageUrl || "/images/product.jpg"}
            alt={tour.title}
            className="w-full h-full object-cover"
          />

          {/* gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* DIFFICULTY */}
          {tour.showDifficulty && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold shadow-lg">
              <Mountain className="w-4 h-4" />
              {tour.difficultyLevel}
            </div>
          )}

          {/* REVIEW BADGE */}
          {tour.showReviews && (
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-white/95 backdrop-blur-sm shadow-lg">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-bold text-foreground">
                {averageRating}
              </span>
              {tour.reviews && (
                <span className="text-xs text-muted-foreground">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}

          {/* TITLE */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-display text-xl font-bold text-white leading-tight drop-shadow-lg">
              {tour.title}
            </h3>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col p-4 pt-0">
          {/* DETAILS LIST */}
          <div className="space-y-3 mb-6 grid grid-cols-2">
            {/* ACCOMMODATION */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {tour?.accommodationType}
              </span>
            </div>

            {/* DURATION */}
            {tour.durationDays && tour.durationNights && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Timer className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {tour.durationDays}J / {tour.durationNights}N
                </span>
              </div>
            )}

            {/* GROUP SIZE */}
            {tour.groupSizeMax && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  Up to {tour.groupSizeMax} people
                </span>
              </div>
            )}
            {/* DATE */}
            <div className="flex col-span-2 items-center gap-3 text-muted-foreground">
              <CalendarDays className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{tour?.dateCard}</span>
            </div>
          </div>

          {/* PRICE */}
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-muted-foreground">From</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground font-display">
                    {tour?.priceOriginal} MAD
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    /person
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => router.push(`/voyage/${tour.id}`)}
              className="w-full bg-[#D97D55] hover:bg-[#f35c1c] cursor-pointer tour-gradient text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-11 group/btn"
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
