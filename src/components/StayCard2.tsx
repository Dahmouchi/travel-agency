/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import BtnLikeIcon from "@/components/BtnLikeIcon";
import GallerySlider from "@/components/GallerySlider";
import SaleOffBadge from "@/components/SaleOffBadge";
import StartRating from "@/components/StartRating";
import { Badge } from "@/shared/Badge";
import { Location06Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface TourCardProps {
  className?: string;
  data: any;
  size?: "default" | "small";
  auth?: boolean;
  session?: any;
  iLiked?: boolean;
}

const TourCard: FC<TourCardProps> = ({
  size = "default",
  className = "",
  data,
  auth,
  session,
  iLiked,
}) => {
  const {
    id,
    title,
    ville,
    villeDepart,
    destinations,
    priceOriginal,
    priceDiscounted,
    categories,
    images,
    reviews,
    showDiscount,
    showReviews,
    discountPercent,
  } = data;

  const listingHref = `/voyage/${id}`;
  const averageRating =
    reviews && reviews.length > 0
      ? parseFloat(
          (
            reviews.reduce((sum: any, r: any) => sum + r.rating, 0) /
            reviews.length
          ).toFixed(2),
        )
      : 0;

  const renderSliderGallery = () => {
    return (
      <div className="relative h-[30vh] w-full ">
        <Image
          src={data.imageUrl || ""}
          fill
          alt="listing card gallery"
          className={clsx(`rounded-2xl  object-cover `)}
          sizes="(max-width: 1025px) 100vw, 25vw"
        />
        <BtnLikeIcon
          isLiked={iLiked}
          userId={session?.user?.id}
          tourId={data.id}
          isAuthenticated={auth || false}
          className="absolute top-3 end-3"
        />

        {!!showDiscount && (
          <SaleOffBadge
            desc={discountPercent}
            className="absolute start-3 top-3"
          />
        )}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div
        className={clsx(
          size === "default" ? "mt-3 gap-y-3" : "mt-2 gap-y-2",
          "flex flex-col",
        )}
      >
        <div className="flex flex-col gap-y-2">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {categories[0]?.name || "Tour"}
          </span>

          <div className="flex items-center gap-x-2">
            <h2 className="text-base font-semibold text-neutral-900 capitalize dark:text-white">
              <span className="line-clamp-1">{title}</span>
            </h2>
          </div>

          <div className="flex items-center gap-x-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {size === "default" && (
              <HugeiconsIcon
                className="mb-0.5"
                icon={Location06Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.5}
              />
            )}
            <span>{destinations[0].name || villeDepart || "Destination"}</span>
          </div>
        </div>

        <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-semibold">
              {priceDiscounted ?? priceOriginal} DH
            </span>

            {priceOriginal > priceDiscounted && (
              <span className="ml-2 line-through text-sm text-neutral-400">
                {priceOriginal} DH
              </span>
            )}
          </div>

          {showReviews && (
            <StartRating reviewCount={reviews?.length} point={averageRating} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`group relative ${className}`}>
      <Link href={listingHref} className="cursor-pointer">
        {renderSliderGallery()}
        {renderContent()}
      </Link>
    </div>
  );
};

export default TourCard;
