"use server";

import prisma from "@/lib/prisma";

export async function archiveTourDiscover(tourId: string) {
  try {
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        archive: true,
        active: false,
        updatedAt: new Date() // Optional: update timestamp
      }
    });

    return {
      success: true,
      data: updatedTour,
      message: "Tour archived successfully"
    };
  } catch (error) {
    console.error("Error archiving tour:", error);
    return {
      success: false,
      error: "Failed to archive tour",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function unarchiveTourDiscover(tourId: string) {
  try {
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        archive: false,
        active: true, // Optionally reactivate
        updatedAt: new Date()
      }
    });

    return {
      success: true,
      data: updatedTour,
      message: "Tour désarchivé avec succès"
    };
  } catch (error) {
    console.error("Error unarchiving tour:", error);
    return {
      success: false,
      error: "Échec du désarchivage",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function getAllToursDiscover() {
  try {
    const tours = await prisma.tour.findMany({
      where:{
        isDiscover:true,
        archive:false,
      },
      include: {
        destinations: true,
        categories: true,
        natures: true,
        programs: true,
        images: true,
      },
      orderBy:{
        updatedAt:"desc",
      }
    });
    return { success: true, data: tours };
  } catch (error) {
    console.error("Error fetching tours:", error);
    return { success: false, error: "Failed to fetch tours" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllToursDiscoverArchiver() {
  try {
    const tours = await prisma.tour.findMany({
      where:{
        isDiscover:true,
        archive:true,
        active:false,
      },
      include: {
        destinations: true,
        categories: true,
        natures: true,
        programs: true,
        images: true,
      },
      orderBy:{
        updatedAt:"desc",
      }
    });
    return { success: true, data: tours };
  } catch (error) {
    console.error("Error fetching tours:", error);
    return { success: false, error: "Failed to fetch tours" };
  } finally {
    await prisma.$disconnect();
  }
}
export async function getDiscoverToursNonArchiver() {
  return prisma.tour.findMany({
    where: {isDiscover:true },
    orderBy: { orderIndex: 'asc' },
  });
}
interface UpdateOrderInput {
  id: string;
  orderIndex: number;
}
export async function updateTourOrderDiscover(tours: UpdateOrderInput[]) {
  const transaction = tours.map(tour =>
    prisma.tour.update({
      where: { id: tour.id },
      data: { orderIndex: tour.orderIndex },
    })
  );

  await prisma.$transaction(transaction);
}