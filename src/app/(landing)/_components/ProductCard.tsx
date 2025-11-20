/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Review } from "@prisma/client";
import { CalendarDays, Eye } from "lucide-react";
import React from "react";
import DiscountBadge from "./DiscountBadge";
import { Rating } from "react-simple-star-rating";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function NationalCard({ tour }: { tour: any }) {
  const router = useRouter();

  const approvedReviews =
    tour.reviews?.filter((review: Review) => review.status === true) ?? [];

  const reviewCount = approvedReviews.length;
  const averageRating =
    reviewCount > 0
      ? approvedReviews.reduce(
          (sum: any, review: any) => sum + review.rating,
          0
        ) / reviewCount
      : 0;
  return (
    <div
      onClick={() => router.push(`/voyage/${tour?.id}`)}
      className="w-full h-full cursor-pointer flex flex-col justify-between rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white"
    >
      <div className="w-full lg:h-[40vh] h-[30vh] bg-green-500 relative bg-cover bg-center group">
        <div
          className="absolute inset-0 bg-cover bg-center  "
          style={{
            backgroundImage: `url("${tour?.imageUrl || "/images/product.jpg"}")`,
          }}
        ></div>
        {tour.showDiscount &&
          tour.priceOriginal !== tour.priceDiscounted &&
          tour.discountEndDate && (
            <DiscountBadge endDate={tour.discountEndDate.toString()} />
          )}
        <div className="w-full h-1/3 bg-gradient-to-t from-white to-white/0 absolute bottom-0 z-0"></div>
        {tour.showReviews && (
          <div className="z-50 absolute left-3 -bottom-2 lg:block hidden ">
            <div className="flex items-center">
              <StarRatingDisplay averageRating={averageRating} />
              <span className="text-gray-500 text-xs ml-2 mt-2 font-medium">
                ({reviewCount ?? 0} {(reviewCount ?? 0) === 1 ? "avis" : "avis"}
                )
              </span>
            </div>
          </div>
        )}
        <div
          className={`items-baseline mb-4 text-right absolute ${tour.showDiscount && tour.priceOriginal !== tour.priceDiscounted ? "py-1" : "py-2"} z-50 -bottom-8 bg-[#4FA8FF] cardd w-fit rounded-l-full px-8 right-0`}
        >
          {tour.showDiscount && tour.priceOriginal !== tour.priceDiscounted && (
            <h1 className="text-white line-through mr-2 text-xs">
              {tour?.priceOriginal} MAD
            </h1>
          )}
          <h1 className="text-xl font-bold text-white">
            {tour?.priceDiscounted} MAD
          </h1>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-end bg-white relative">
        {/* Tour? Info */}
        <div className="absolute top-4 w-full">
          <div className="w-full flex items-center justify-between">
            <div className="bg-[#8EBD22] w-fit flex items-center gap-2 text-white p-1 px-2 rounded-sm shadow-lg">
              <CalendarDays className="w-5 h-5" />
              <div className="text-xs">
                {tour?.durationDays}J / {tour?.durationNights}N
              </div>
            </div>
            {tour.showReviews && (
              <div className="z-50 pr-6 lg:hidden">
                <div className="flex items-center">
                  <StarRatingDisplay averageRating={averageRating} />
                  <span className="text-gray-400 text-xs ml-2 mt-2 font-medium">
                    ({reviewCount ?? 0}{" "}
                    {(reviewCount ?? 0) === 1 ? "avis" : "avis"})
                  </span>
                </div>
              </div>
            )}
          </div>
          <h3 className="font-bold text-lg mt-2 line-clamp-2 pr-4 lg:pr-8">
            {tour?.title}
          </h3>
        </div>
        <div className="mb-4 space-y-2 mt-4 min-h-[150px] relative">
          <div className="absolute -bottom-2">
            {tour?.showHebergement && (
              <div className="flex items-center gap-2">
                <img src="/hotel.png" alt="" className="w-6 h-6 " />
                <p className="text-gray-700 mb-1 line-clamp-1">
                  {tour?.accommodationType}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <img src="/calendrier.png" alt="" className="w-6 h-6 " />
              <div>
                <p className="text-gray-700 line-clamp-1">{tour?.dateCard}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div>
          <div className="border-t border-gray-200 my-4"></div>

          {/* Program Rating */}
          <div className="flex justify-between items-center w-full gap-2">
            <Link
              href={`/voyage/${tour?.id}`}
              className="bg-[#8EBD22] carddd rounded-lg cursor-pointer shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex itce justify-between px-4 py-3 w-full text-white"
            >
              <Eye className="w-6 h-6" />
              <span className="text-white w-full text-center select-none">
                Programme
              </span>
            </Link>
            {tour.showDifficulty && (
              <div className="w-16 h-full flex items-center justify-center flex-col rounded-lg text-white p-1 cardd">
                <img src="/boot.png" alt="" className="w-4 h-4 -rotate-12" />
                <h1>{tour?.difficultyLevel}/5</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const StarRatingDisplay = ({ averageRating }: { averageRating: number }) => {
  return (
    <div className="flex items-center">
      <Rating
        readonly
        initialValue={averageRating}
        size={20}
        allowFraction
        SVGstyle={{ display: "inline-block" }}
        fillColor="#facc15" // Tailwind's yellow-400
        emptyColor="#bfc2c7" // Tailwind's gray-300
      />
    </div>
  );
};
