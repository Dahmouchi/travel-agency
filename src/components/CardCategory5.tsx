import { TCategory } from "@/data/categories";
import convertNumbThousand from "@/utils/convertNumbThousand";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface CardCategory5Props {
  className?: string;
  category: any;
}

const CardCategory5: FC<CardCategory5Props> = ({
  className = "",
  category,
}) => {
  const { id, name, imageUrl, type, tours } = category;
  return (
    <div className={`group relative flex flex-col ${className}`}>
      <div
        className={`aspect-w-4 relative h-[30vh] w-full shrink-0 overflow-hidden rounded-2xl aspect-h-3`}
      >
        <Image
          fill
          alt={name}
          src={imageUrl || ""}
          className="rounded-2xl object-cover"
          sizes="(max-width: 400px) 100vw, 400px"
        />
        <span className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100"></span>
      </div>
      <div className="mt-3.5 px-2">
        <h2
          className={`text-base font-medium text-neutral-900 dark:text-neutral-100`}
        >
          <Link
            href={`/destination/${type === "NATIONAL" ? "national" : "international"}/t/${id}`}
            className="absolute inset-0"
          ></Link>
          <span className="line-clamp-1">{name}</span>
          <span className="line-clamp-1">{type}</span>
        </h2>
        <span
          className={`mt-1.5 block text-sm text-neutral-600 dark:text-neutral-400`}
        >
          {convertNumbThousand(tours.length || 20)}+ properties
        </span>
      </div>
    </div>
  );
};

export default CardCategory5;
