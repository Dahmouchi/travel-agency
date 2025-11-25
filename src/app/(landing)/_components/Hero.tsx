"use client";
import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { OptimizedSearchInput } from "./Search";
import Link from "next/link";

const heroImages = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80",
  "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1920&q=80",
];

export default function HeroSection({ inp, tours }: { inp: any; tours: any }) {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <div className="absolute z-50 top-0  left-1/2 -translate-x-1/2 lg:hidden bg-white w-full py-1">
        <Link
          href="/"
          className="flex items-center justify-center w-full space-x-2 z-50"
        >
          <img
            src="/horizontal.png"
            alt="Happy Trip"
            className="h-14  w-auto object-fit"
          />
        </Link>
      </div>
      {/* Background Carousel */}
      <Carousel
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="absolute inset-0"
      >
        <CarouselContent>
          {heroImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-screen w-full">
                <img
                  src={image}
                  alt={`Travel destination ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            {inp?.titleHero}
            <span className="block text-white">{inp?.subTitleHero}</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
            {inp?.subTitleHero1}
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full max-w-5xl animate-scale-in">
          {/* Quick Search */}
          {inp?.search === true && (
            <div className="flex items-center justify-center lg:px-0 w-full p-4 z-50">
              <OptimizedSearchInput
                className="text-xs lg:text-lg"
                tours={tours}
                placeholder="Trouvez votre voyage idéal..."
                maxResults={5}
                searchFields={["title", "description"]}
                showImages={false}
              />
            </div>
          )}
          {/* Popular Destinations */}
        </div>
      </div>
    </section>
  );
}
