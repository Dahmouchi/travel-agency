import React from "react";
import { Tour } from "@prisma/client";
import { NationalCard } from "./ProductCard";
import { SwiperCarousel } from "@/components/swiper-carousel";
import { SwiperSlide } from "@/components/swiper-slide";
import { TourCard } from "./TourCard";

const International = ({
  tour,
  subtitle,
  title,
}: {
  tour: Tour[];
  subtitle?: string;
  title?: string;
}) => {
  return (
    <div className="relative mt-10 min-h-screen">
      <div
        className="absolute inset-0 bg-[url('/international.png')] bg-cover bg-center"
        style={{ opacity: 0.1, zIndex: 0 }}
      />{" "}
      <div className="z-20">
        <div className="w-full text-center flex items-center justify-center flex-col gap-2">
          <h1 className="lg:text-4xl text-xl font-bold">{title}</h1>
          <h1 className="lg:w-1/2 text-sm lg:text-lg text-gray-500">
            {subtitle}
          </h1>
        </div>
        <div className=" relative  lg:px-28 px-4 py-8">
          <SwiperCarousel>
            {tour.map((tour, index) => (
              <SwiperSlide key={tour.id}>
                <div className="py-8 px-2">
                  <TourCard tour={tour} index={index} />
                </div>
              </SwiperSlide>
            ))}
          </SwiperCarousel>
        </div>
      </div>
    </div>
  );
};

export default International;
