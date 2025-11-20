/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import FlightCard from "@/components/discover/FlightCard";
/* eslint-disable @next/next/no-img-element */
import { MoveRight } from "lucide-react";
import Link from "next/link";

export function DiscoverMoroccoSection({
  title,
  discoverSubtitle,
  discoverItems,
}: {
  title?: string;
  discoverSubtitle?: string;
  discoverItems: any[];
}) {
  return (
    <div className="w-full py-12 px-4">
      <div className="w-full text-center flex items-center justify-center flex-col gap-3 mb-12 ">
        <h2 className="lg:text-4xl text-2xl font-bold text-foreground max-w-2xl">
          {title || ""}
        </h2>
        <p className="lg:w-2/3 text-sm lg:text-base text-muted-foreground max-w-2xl">
          {discoverSubtitle || ""}
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto mb-12">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {discoverItems?.slice(0, 3).map((item) => (
            <FlightCard
              key={item.id}
              img={item.imageUrl}
              name={item.description}
              oneway={item.durationDays}
              ville={item.ville}
              departure={item.villeDepart}
              destination={item.title}
              tourid={item.id}
            />
          ))}
        </div>
      </div>

      <div className="w-full flex items-center justify-center mb-8">
        <Link
          href="/discover-morocco"
          className="carddd rounded-full py-4 cursor-pointer shadow-lg px-6 my-4  flex items-center justify-center text-white gap-2 "
        >
          <span>Explorer Tous les Voyages</span>
          <MoveRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
