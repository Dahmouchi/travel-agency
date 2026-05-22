// components/ToursDisplay.tsx
"use client";

import { Tour } from "@prisma/client";

import { NationalCard } from "./ProductCard";
import { SwiperCarousel } from "@/components/swiper-carousel";
import { SwiperSlide } from "@/components/swiper-slide";
import { TourCard } from "./TourCard";

export function ToursDisplay({
  tours,
  title,
  titleText,
  displayMode = "grid",
  subtitle,
}: {
  tours: Tour[];
  title: boolean;
  titleText?: string;
  displayMode?: "grid" | "carousel";
  subtitle?: string;
}) {
  return (
    <div className="relative mt-10 min-h-screen">
      <div className="absolute inset-0 " style={{ opacity: 0.1, zIndex: 0 }} />

      <div className="z-20">
        {title && (
          <div className="w-full text-center flex items-center justify-center flex-col gap-2">
            <h1 className="lg:text-4xl text-xl font-bold">{titleText}</h1>
            <h1 className="lg:w-1/2 text-sm lg:text-lg text-gray-700">
              {subtitle}
            </h1>
          </div>
        )}
        <div className="w-full relative">
          {displayMode === "carousel" ? (
            <div className=" relative  lg:px-28 px-4 py-8">
              <SwiperCarousel>
                {tours.map((tour, index) => (
                  <SwiperSlide key={tour.id}>
                    <div className="py-8 px-2">
                      <TourCard tour={tour} index={index} />
                    </div>
                  </SwiperSlide>
                ))}
              </SwiperCarousel>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-3 lg:px-24">
              {tours.map((tour, index) => (
                <div
                  key={tour.id}
                  className="flex items-center justify-center w-full "
                >
                  <TourCard tour={tour} index={index} />
                </div>
              ))}
            </div>
          )}

          {tours.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun voyage trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
