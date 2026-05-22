import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import StayCard2 from "@/components/StayCard2";
import { authOptions } from "@/lib/nextAuth";
import Link from "next/link";

export default async function LikedToursPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">You must be logged in</h2>
      </div>
    );
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      tour: {
        include: {
          reviews: true,
          categories: true,
          destinations: true,
        },
      },
    },
  });

  const tours = favorites.map((f) => f.tour);

  return (
    <div className="relative min-h-screen">
      <div className="absolute z-50 top-0  left-1/2 -translate-x-1/2 lg:hidden bg-white w-full py-1">
        <Link
          href="/"
          className="flex items-center justify-center w-full space-x-2 z-50"
        >
          <img
            src="/horizontal1.png"
            alt="Happy Trip"
            className="h-14  w-auto object-fit"
          />
        </Link>
      </div>
      <div className="mt-[10vh] lg:mt-[18vh] px-4 lg:px-24">
        <h1 className="text-3xl font-bold mb-8">Your Liked Tours</h1>

        {tours.length === 0 && (
          <p className="text-gray-600">You haven&apos;t liked any tours yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <StayCard2 key={tour.id} data={tour} iLiked={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
