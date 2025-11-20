// lib/getTourById.ts
import { cache } from "react";
import prisma from "@/lib/prisma";

export const getTourById = cache(async (id: string) => {
  return prisma.tour.findUnique({
   where: {
      id,
    },
    include: {
      dates: {
        where: {
          visible: true,
        },
        orderBy: {
          startDate: "asc",
        },
      },
      natures: true,
      destinations: true,
      programs: {
        orderBy: {
          orderIndex: "asc",
        },
      },
      categories: true,
      services: true,
    },
  });
});
