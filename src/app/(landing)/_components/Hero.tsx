"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { OptimizedSearchInput } from "./Search";
import Link from "next/link";

const heroImages = [
  "https://images.pexels.com/photos/4763809/pexels-photo-4763809.jpeg",
  "https://images.pexels.com/photos/640781/pexels-photo-640781.jpeg",
  "https://images.pexels.com/photos/914128/pexels-photo-914128.jpeg",
  "https://images.pexels.com/photos/35873260/pexels-photo-35873260.jpeg",
];

export default function HeroSection({ inp, tours }: { inp: any; tours: any }) {
  const handleTourSelect = (tour: any) => {
    console.log("Tour sélectionné:", tour);
  };

  return (
    <section className="relative h-[90vh] w-full">
      {/* Background Wrapper */}
      <div className="absolute inset-0 overflow-hidden">
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
      </div>

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
            <div className="flex items-center zzz justify-center lg:px-0 w-full p-4 z-50">
              <OptimizedSearchInput
                tours={tours}
                placeholder="Rechercher une destination, un pays..."
                maxResults={6}
                showImages={true}
                onSelect={handleTourSelect}
                className="w-full"
              />
            </div>
          )}
          {/* Popular Destinations */}
        </div>
      </div>
    </section>
  );
}
