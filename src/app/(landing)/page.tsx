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
import {
  getFilteredTours,
  getTourFilterOptionsForUI,
} from "@/actions/tour-filter-actions";
import { parseFilterParams } from "@/lib/tour-filters";
import convertNumbThousand from "@/utils/convertNumbThousand";
import { Divider } from "@/shared/divider";
import TourListingFilterTabs from "@/components/TourListingFilterTabs";
import StayCard2 from "@/components/StayCard2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { PaginatedTours } from "./_components/ToursPagination";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
//import GoogleReviewsSection from "./_components/GoogleAvis";

const LandigPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const now = new Date();
  const session = await getServerSession(authOptions);

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
      isDiscover: false,
      active: true,
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
      isDiscover: false,
      active: true,
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
      isDiscover: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });
  const params = await searchParams;

  // Convert searchParams to URLSearchParams format
  const urlSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => urlSearchParams.append(key, v));
    } else if (value) {
      urlSearchParams.append(key, value);
    }
  });

  const filterParams = parseFilterParams(urlSearchParams);
  const listings = await getFilteredTours(filterParams);
  const filterOptions = await getTourFilterOptionsForUI();
  return (
    <div>
      {/*{(sections?.navbar ?? true) && 
        <div className="lg:px-6 w-full px-3">
          <div className="bg-[#D97D55] lg:rounded-b-2xl rounded-b-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex items-center justify-center py-4">
            <h1 className="text-white text-xs lg:text-lg text-center">
              Nos packs SUMMER 2025 sont disponibles Dés Maintenant!
            </h1>
          </div>
        </div>
      } */}
      <div className="pb-28">
        {/* Hero section */}
        {(sections?.hero ?? true) && <Hero inp={sections} tours={allTours} />}

        {/* Content */}
        <div className="relative container lg:px-24 px-4 mt-14 lg:mt-24">
          {/* start heading */}
          <div className="flex flex-wrap items-end justify-between gap-x-2.5 gap-y-5">
            <h2
              id="heading"
              className="scroll-mt-20 text-lg font-semibold sm:text-xl"
            >
              {listings.length > 0
                ? `${convertNumbThousand(listings.length)} tours available`
                : "No tours found"}
            </h2>
          </div>
          <Divider className="my-8 md:mb-12" />
          {/* end heading */}

          <TourListingFilterTabs filterOptions={filterOptions} />

          {listings.length > 0 ? (
            <PaginatedTours tours={listings} session={session} />
          ) : (
            <div className="mt-16 text-center">
              <p className="text-lg text-muted-foreground">
                No tours match your current filters.
              </p>
            </div>
          )}
        </div>
      </div>
      {(sections?.omrah ?? true) && (
        <OmraSection imageUrl={sections?.imageOmrah} />
      )}

      {(sections?.thisMount ?? true) && (
        <MonthlyFeaturedTours
          tours={tourForThisMount}
          subtitle={sections?.thisMountText || ""}
        />
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
        <International
          tour={tourInternational}
          subtitle={sections?.internationalText || ""}
          title={sections?.internationalTitle || ""}
        />
      )}
      {(sections?.mesure ?? true) && <Mesure />}
      {(sections?.discover ?? true) && (
        <DiscoverMoroccoSection
          discoverSubtitle={sections?.discoverSubtitle || ""}
          title={sections?.discoverTitle || ""}
          discoverItems={discoverTours || []}
        />
      )}
      {/*<GoogleReviewsSection/>*/}
      {(sections?.meeting ?? true) && <Meeting />}
      {(sections?.expert ?? true) && <Expert />}
      {(sections?.reviews ?? true) && (
        <ReviewsSection googleAvie={sections?.googleAvie} />
      )}
      {/*<SectionSubscribe2 className="py-24 container lg:py-32" />*/}

      {(sections?.trust ?? true) && <Trust />}
    </div>
  );
};

export default LandigPage;
