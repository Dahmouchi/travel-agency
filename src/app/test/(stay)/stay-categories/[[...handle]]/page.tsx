/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTourFilterOptionsForUI } from "@/actions/tour-filter-actions";
import { getFilteredTours } from "@/actions/tour-filter-actions";
import HeroSectionWithSearchForm1 from "@/components/hero-sections/HeroSectionWithSearchForm1";
import { StaySearchForm } from "@/components/HeroSearchForm/StaySearchForm";
import TourListingFilterTabs from "@/components/TourListingFilterTabs";
import StayCard2 from "@/components/StayCard2";
import { Divider } from "@/shared/divider";
import convertNumbThousand from "@/utils/convertNumbThousand";
import { House04Icon, MapPinpoint02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import { parseFilterParams } from "@/lib/tour-filters";
import { getStayCategoryByHandle } from "@/data/categories";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Landing } from "@prisma/client";
import Hero from "@/app/(landing)/_components/Hero";

export const metadata: Metadata = {
  title: "Tours",
  description: "Browse our available tours",
};

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
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
  const category = await getStayCategoryByHandle(params.handle?.[0]);

  const filterParams = parseFilterParams(urlSearchParams);
  const listings = await getFilteredTours(filterParams);
  const filterOptions = await getTourFilterOptionsForUI();
  const sections: Landing | null = await prisma.landing.findFirst({});
  const allTours = await prisma.tour.findMany({});

  if (!category?.id) {
    return redirect("/stay-categories/all");
  }
  return (
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
          <>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing: any) => (
                <StayCard2 key={listing.id} data={listing} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">
              No tours match your current filters. Try adjusting your search
              criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
