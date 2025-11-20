export const dynamic = "force-dynamic";
export const revalidate = 0;

import Hero from "./_components/Hero";
import { ToursDisplay } from "./_components/National";
import International from "./_components/International";
import Mesure from "./_components/Mesure";
import ReviewsSection from "./_components/Reviews";
import Meeting from "./_components/Meeting";
import Expert from "./_components/Expert";
import Trust from "./_components/Trust";
import { Landing, Tour } from "@prisma/client";
import prisma from "@/lib/prisma";
import { endOfMonth, startOfMonth } from "date-fns";
import MonthlyFeaturedTours from "./_components/thisMount";
import { OmraSection } from "./_components/omra-section";
import { DiscoverMoroccoSection } from "./_components/Discover-section";

//import GoogleReviewsSection from "./_components/GoogleAvis";

const LandigPage = async () => {
  const now = new Date();

  const firstDay = startOfMonth(now);
  const lastDay = endOfMonth(now);
  const sections: Landing | null = await prisma.landing.findFirst({});
  const allTours = await prisma.tour.findMany({});
  const tourForThisMount = await prisma.tour.findMany({
    where: {
      dates: {
        some: {
          startDate: {
            gte: firstDay,
            lte: lastDay,
          },
        },
      },
    },
    include: {
      reviews: true,
      dates: true, // include matching TourDate entries
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const tourNational: Tour[] | null = await prisma.tour.findMany({
    where: {
      type: "NATIONAL",
      isDiscover:false,
      active:true,
    },
    include: {
      reviews: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });
  const tourInternational: Tour[] | null = await prisma.tour.findMany({
    where: {
      type: "INTERNATIONAL",
      isDiscover:false,
      active:true,
    },
    include: {
      reviews: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });
  const discoverTours: Tour[] | null = await prisma.tour.findMany({
    where: {
      isDiscover:true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });
  return (
    <div>
     
      {/*{(sections?.navbar ?? true) && 
        <div className="lg:px-6 w-full px-3">
          <div className="bg-[#8EBD22] lg:rounded-b-2xl rounded-b-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex items-center justify-center py-4">
            <h1 className="text-white text-xs lg:text-lg text-center">
              Nos packs SUMMER 2025 sont disponibles Dés Maintenant!
            </h1>
          </div>
        </div>
      } */}
      {(sections?.hero ?? true) && <Hero inp={sections} tours={allTours}/>}  
      {(sections?.omrah ?? true) && <OmraSection imageUrl={sections?.imageOmrah}/>}  
            
   
      {(sections?.thisMount ?? true) && (
        <MonthlyFeaturedTours tours={tourForThisMount} subtitle={sections?.thisMountText || ""} />
      )}
      {(sections?.national ?? true) && (
        <ToursDisplay
          tours={tourNational}
          displayMode={"carousel"}
          title={true}
          titleText={sections?.nationalTitle || ""}
          subtitle={sections?.nationalText || ""}
        />
      )}
      {(sections?.international ?? true) && (
        <International tour={tourInternational} subtitle={sections?.internationalText || ""} title={sections?.internationalTitle || ""}/>
      )}
      {(sections?.mesure ?? true) && <Mesure />}
      {(sections?.discover ?? true) && <DiscoverMoroccoSection discoverSubtitle={sections?.discoverSubtitle || ""} title={sections?.discoverTitle || ""} discoverItems={discoverTours || []}/>}
      {/*<GoogleReviewsSection/>*/}
      {(sections?.meeting ?? true) && <Meeting />}
      {(sections?.expert ?? true) && <Expert />}
       {(sections?.reviews ?? true) && <ReviewsSection  googleAvie={sections?.googleAvie}/>}
      {(sections?.trust ?? true) && <Trust />}
    </div>
  );
};

export default LandigPage;
