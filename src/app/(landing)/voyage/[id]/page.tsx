/* eslint-disable @typescript-eslint/no-explicit-any */
// app/voyage/[id]/page.tsx
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import TourDetails from "@/app/(landing)/_components/ProductDetails";
import TourDetailsModern from "@/app/(landing)/_components/TourDetailsModern";
import { safeHtmlToText } from "@/lib/safeHTML";
import { Metadata } from "next";
import TourDetailsAr from "../../_components/OmraSection";
import TourDetailsRedesigned from "../../_components/lavabelTourDetails";

// 1. Dynamic Metadata Function
export async function generateMetadata(params: any): Promise<Metadata> {
  const tour = await prisma.tour.findUnique({
    where: { id: params.params.id },
  });

  if (!tour) {
    return {
      title: "Voyage non trouvé - HappyTrip",
      description: "Ce voyage n'existe pas ou a été supprimé.",
    };
  }

  const plainDescription = tour.description
    ? safeHtmlToText(tour.description).slice(0, 160)
    : "Découvrez ce voyage avec HappyTrip.";

  const imageUrl = tour.imageUrl || "https://happytrip.ma/horizontal1.png"; // 👈 use absolute URL

  return {
    title: `${tour.title} - HappyTrip`,
    description: plainDescription,
    openGraph: {
      title: `${tour.title} - HappyTrip`,
      description: plainDescription,
      url: `https://happytrip.ma/voyage/${params.params.id}`,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: tour.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tour.title} - HappyTrip`,
      description: plainDescription,
      images: [imageUrl],
    },
  };
}

// 2. Page Component
const TourDetailsMain = async (params: any) => {
  const tour = await prisma.tour.findUnique({
    where: {
      id: params.params.id,
    },
    include: {
      dates: {
        where: { visible: true },
        orderBy: { startDate: "asc" },
      },
      bookinSteps: {
        orderBy: { orderIndex: "asc" },
      },
      checklist: {
        orderBy: { orderIndex: "asc" },
      },
      reservationForm: true,
      natures: true,
      destinations: true,
      images: true,
      categories: true,
      reviews: true,
      services: true,
    },
  });

  const programs = await prisma.program.findMany({
    where: {
      tourId: tour?.id,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });
  if (!tour) return <div>Tour not found</div>;

  return (
    <div>
      {tour.id === "omra" ? (
        <TourDetailsAr tour={tour} programss={programs} />
      ) : (
        <TourDetailsRedesigned tour={tour} programss={programs} />
      )}
    </div>
  );
};

export default TourDetailsMain;
