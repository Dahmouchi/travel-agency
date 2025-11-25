"use server";

import prisma from "@/lib/prisma";
import {
  buildTourFilterWhere,
  type TourFilterParams,
} from "@/lib/tour-filters";

export async function getFilteredTours(filterParams: TourFilterParams) {
  const where = buildTourFilterWhere(filterParams);

  const tours = await prisma.tour.findMany({
    where,
    include: {
      destinations: true,
      categories: true,
      natures: true,
      programs: true,
      images: true,
      reviews: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return tours;
}

export async function getTourFilterOptions() {
  // Fetch all unique filter options from the database
  const [categories, natures, destinations] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.nature.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.destination.findMany({
      where: { visible: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Get unique accommodation types and travel types from tours
  const tours = await prisma.tour.findMany({
    where: { active: true, archive: false },
    select: {
      type: true,
      accommodationType: true,
      difficultyLevel: true,
      priceOriginal: true,
      priceDiscounted: true,
      durationDays: true,
    },
  });

  const accommodationTypes = Array.from(
    new Set(tours.map((t) => t.accommodationType).filter(Boolean))
  ) as string[];

  const travelTypes = Array.from(new Set(tours.map((t) => t.type)));

  // Calculate min/max for price and duration
  const prices = tours
    .map((t) => t.priceDiscounted || t.priceOriginal)
    .filter((p): p is number => p !== null);
  const durations = tours
    .map((t) => t.durationDays)
    .filter((d): d is number => d !== null);

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000;
  const maxDuration = durations.length > 0 ? Math.max(...durations) : 30;

  return {
    categories,
    natures,
    destinations,
    accommodationTypes,
    travelTypes,
    priceRange: { min: minPrice, max: maxPrice },
    durationRange: { min: 0, max: maxDuration },
  };
}

export async function getTourFilterOptionsForUI() {
  const options = await getTourFilterOptions();

  const filterOptions = [
    {
      name: "type",
      label: "Travel Type",
      tabUIType: "checkbox" as const,
      options: options.travelTypes.map((type) => ({
        name: type.charAt(0) + type.slice(1).toLowerCase().replace("_", " "),
        value: type,
      })),
    },

    {
      name: "destinations",
      label: "Destinations",
      tabUIType: "checkbox" as const,
      options: options.destinations.map((dest) => ({
        name: dest.name,
        value: dest.id,
      })),
    },
    {
      label: "Price Range",
      name: "price",
      tabUIType: "price-range" as const,
      min: options.priceRange.min,
      max: options.priceRange.max,
    },
    {
      label: "Duration (Days)",
      name: "duration",
      tabUIType: "select-number" as const,
      options: [
        { name: "Min Days", max: options.durationRange.max },
        { name: "Max Days", max: options.durationRange.max },
      ],
    },
    {
      name: "difficultyLevel",
      label: "Difficulty Level",
      tabUIType: "checkbox" as const,
      options: [
        { name: "Easy (1)", value: "1" },
        { name: "Moderate (2)", value: "2" },
        { name: "Challenging (3)", value: "3" },
        { name: "Difficult (4)", value: "4" },
        { name: "Expert (5)", value: "5" },
      ],
    },
  ];

  return filterOptions;
}
