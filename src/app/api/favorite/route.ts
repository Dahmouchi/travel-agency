import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, tourId } = await req.json();

    if (!userId || !tourId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Check if already liked
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_tourId: {
          userId,
          tourId,
        },
      },
    });

    if (existing) {
      // UNLIKE → remove it
      await prisma.favorite.delete({
        where: {
          userId_tourId: {
            userId,
            tourId,
          },
        },
      });

      return NextResponse.json({ liked: false });
    }

    // LIKE → add it
    await prisma.favorite.create({
      data: {
        userId,
        tourId,
      },
    });

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        tour: true, // fetch the tour linked to each favorite
      },
    });

    // Return only tours
    const tours = favorites.map((f) => f.tour);

    return NextResponse.json(tours);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
