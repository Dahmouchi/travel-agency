/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PrismaClient, type TravelType } from "@prisma/client";
import { getEmbedGoogleMapsUrl } from "@/utils/getEmbedGoogleMapsUrl";
import { getYouTubeEmbedUrl } from "@/utils/getYouTubeEmbedUrl";
import sharp from "sharp";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";

async function uploadImage(imageURL: File): Promise<string> {
  const image = imageURL;
  const quality = 80;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${timestamp}-${image.name}`;

  const arrayBuffer = await image.arrayBuffer();
  const compressedBuffer = await sharp(arrayBuffer)
    .resize(1200)
    .jpeg({ quality })
    .toBuffer();

  const fileContent = Buffer.from(compressedBuffer);
  await uploadFile(fileContent, filename, image.type);

  return getFileUrl(filename);
}

const prisma = new PrismaClient();
function generateId(tag: string) {
  return tag + Date.now().toString();
}
function getCorrectId(id: string) {
  return id
    .normalize("NFD")
    .replace(/œ/g, "oe") // Replace oe ligature
    .replace(/æ/g, "ae") // Replace ae ligature
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s+/g, "-") // Optional: spaces to dashes
    .replace(/[^a-zA-Z0-9-]/g, "") // Keep only allowed chars
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-|-$/g, "") // Trim leading/trailing dash
    .toLowerCase();
}

export async function addTour(
  validatedData: any,
  reservationFormFields: any[],
  imagess: File[]
) {
  try {
    let imgUrl = "";
    if (validatedData.imageURL) {
      imgUrl = await uploadImage(validatedData.imageURL);
    }
    let imagesUrls: string[] = [];
    console.log("Images received:", imagess);
    if (imagess) {
      const imagesToProcess = Array.isArray(imagess) ? imagess : [imagess];
      imagesUrls = await Promise.all(
        imagesToProcess.map((image: File) => uploadImage(image))
      );
    }

    const tour = await prisma.tour.create({
      data: {
        id: getCorrectId(validatedData.id),
        active: validatedData.active,
        title: validatedData.title,
        villeDepart: validatedData.villeDepart,
        ville: validatedData.ville,
        images:
          imagesUrls.length > 0
            ? {
                create: imagesUrls.map((image: string) => ({
                  url: image,
                })),
              }
            : undefined,
        titleCkecklist: validatedData.titleCkecklist,
        descriptionCkecklist: validatedData.descriptionCkecklist,
        reservationForm: {
          create: {
            fields: reservationFormFields,
          },
        },
        description: validatedData.description,
        isDiscover: validatedData.isDiscover,
        type: validatedData.type as TravelType,
        priceOriginal: validatedData.priceOriginal,
        priceDiscounted:
          validatedData.priceDiscounted === 0 ||
          validatedData.priceDiscounted === undefined ||
          validatedData.priceDiscounted === null
            ? validatedData.priceOriginal
            : validatedData.priceDiscounted,
        discountEndDate: validatedData.discountEndDate
          ? new Date(validatedData.discountEndDate)
          : null,
        advancedPrice:
          parseInt(validatedData.advancedPrice) === 0
            ? parseInt(validatedData.priceOriginal)
            : parseInt(validatedData.advancedPrice) ||
              parseInt(validatedData.priceOriginal),
        dateCard: validatedData.dateCard,
        durationDays: parseInt(validatedData.durationDays),
        durationNights: parseInt(validatedData.durationNights),
        googleMapsUrl: validatedData.googleMapsUrl
          ? ((await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? "")
          : "",
        videoUrl: validatedData.videoUrl
          ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || ""
          : "",
        imageUrl: imgUrl,
        inclus: validatedData.inclus,
        exclus: validatedData.exclus,
        extracts: validatedData.extracts,
        groupType: validatedData.groupType,
        groupSizeMax: parseInt(validatedData.groupSizeMax),
        showReviews: validatedData.showReviews,
        showChecklist: validatedData.showChecklist,
        showHebergement: validatedData.showHebergement,
        showDifficulty: validatedData.showDifficulty,
        showDiscount: validatedData.showDiscount,
        difficultyLevel: validatedData.difficultyLevel,
        discountPercent: validatedData.discountPercent,
        accommodationType: validatedData.accommodationType,
        tags: {
          create: validatedData.tags.map((tag: string) => ({
            name: tag,
          })),
        },
        dates: validatedData.dates
          ? {
              create: validatedData.dates.map((dateObj: any) => ({
                startDate: dateObj.startDate,
                endDate: dateObj.endDate,
                description: dateObj.description,
                price: dateObj.price ?? validatedData.priceOriginal,
                visible: dateObj.visible ?? true,
              })),
            }
          : undefined,

        services: validatedData.services
          ? {
              connect: validatedData.services.map((id: any) => ({ id })),
            }
          : undefined,

        destinations: validatedData.destinations
          ? {
              connect: validatedData.destinations.map((id: any) => ({ id })),
            }
          : undefined,

        categories: validatedData.categories
          ? {
              connect: validatedData.categories.map((id: any) => ({ id })),
            }
          : undefined,

        natures: validatedData.natures
          ? {
              connect: validatedData.natures.map((id: any) => ({ id })),
            }
          : undefined,

        programs: validatedData.programs
          ? {
              create: validatedData.programs.map((program: any) => ({
                title: program.title,
                orderIndex: program.orderIndex,
                description: program.description,
              })),
            }
          : undefined,
        bookinSteps: validatedData.bookinSteps
          ? {
              create: validatedData.bookinSteps.map((program: any) => ({
                title: program.title,
                orderIndex: program.orderIndex,
                description: program.description,
              })),
            }
          : undefined,
        checklist: validatedData.checklist
          ? {
              create: validatedData.checklist.map((program: any) => ({
                title: program.title,
                orderIndex: program.orderIndex,
                description: program.description,
              })),
            }
          : undefined,
      },
    });

    return { success: true, data: tour };
  } catch (error) {
    console.error("Prisma error:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: (error as any).code ?? null,
        meta: (error as any).meta ?? null,
        stack: (error as any).stack ?? null,
      },
    };
  }
}

export async function getAllTours() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        destinations: true,
        categories: true,
        natures: true,
        programs: true,
        images: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return { success: true, data: tours };
  } catch (error) {
    console.error("Error fetching tours:", error);
    return { success: false, error: "Failed to fetch tours" };
  } finally {
    await prisma.$disconnect();
  }
}
export async function getNationalTours() {
  return prisma.tour.findMany({
    where: { type: "NATIONAL" },
    orderBy: { orderIndex: "asc" },
  });
}
export async function getNationalToursNonArchiver() {
  return prisma.tour.findMany({
    where: {
      type: "NATIONAL",
      active: true,
      archive: false,
      isDiscover: false,
    },
    orderBy: { orderIndex: "asc" },
  });
}
export async function getInternationalToursNonArchiver() {
  return prisma.tour.findMany({
    where: {
      type: "INTERNATIONAL",
      active: true,
      archive: false,
      isDiscover: false,
    },
    orderBy: { orderIndex: "asc" },
  });
}
export async function getInternationalTours() {
  return prisma.tour.findMany({
    where: { type: "INTERNATIONAL" },
    orderBy: { orderIndex: "asc" },
  });
}
interface UpdateOrderInput {
  id: string;
  orderIndex: number;
}
export async function updateTourOrder(tours: UpdateOrderInput[]) {
  const transaction = tours.map((tour) =>
    prisma.tour.update({
      where: { id: tour.id },
      data: { orderIndex: tour.orderIndex },
    })
  );

  await prisma.$transaction(transaction);
}
export async function deleteTour(tourId: string) {
  try {
    const deletedTour = await prisma.$transaction(async (tx) => {
      // Delete dependent child records (one-to-many)
      await tx.reservations.deleteMany({ where: { tourId } });
      await tx.tourDate.deleteMany({ where: { tourId } });
      await tx.program.deleteMany({ where: { tourId } });
      await tx.file.deleteMany({ where: { tourId } }); // only works if relation is one-to-many

      // Delete join table entries (many-to-many)
      await tx.$executeRaw`DELETE FROM "_TourDestinations" WHERE "A" = ${tourId}`;
      await tx.$executeRaw`DELETE FROM "_CategoryTours" WHERE "A" = ${tourId}`;
      await tx.$executeRaw`DELETE FROM "_NatureTours" WHERE "A" = ${tourId}`;
      await tx.$executeRaw`DELETE FROM "_TourServices" WHERE "A" = ${tourId}`;
      await tx.$executeRaw`DELETE FROM "_HotelTours" WHERE "A" = ${tourId}`;

      // Delete the tour itself
      return await tx.tour.delete({
        where: { id: tourId },
      });
    });

    return { success: true, data: deletedTour };
  } catch (error) {
    console.error("Error deleting tour:", error);
    return { success: false, error: "Failed to delete tour" };
  }
}

export async function archiveTour(tourId: string) {
  try {
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        archive: true,
        active: false,
        updatedAt: new Date(), // Optional: update timestamp
      },
    });

    return {
      success: true,
      data: updatedTour,
      message: "Tour archived successfully",
    };
  } catch (error) {
    console.error("Error archiving tour:", error);
    return {
      success: false,
      error: "Failed to archive tour",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function unarchiveTour(tourId: string) {
  try {
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        archive: false,
        active: true, // Optionally reactivate
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: updatedTour,
      message: "Tour désarchivé avec succès",
    };
  } catch (error) {
    console.error("Error unarchiving tour:", error);
    return {
      success: false,
      error: "Échec du désarchivage",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export async function getTourById(tourId: string) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: {
        destinations: true,
        categories: true,
        natures: true,
        services: true,
        bookinSteps: {
          orderBy: {
            orderIndex: "asc",
          },
        },
        programs: {
          orderBy: {
            orderIndex: "asc",
          },
        },
        reservationForm: true,
        dates: true,
        checklist: true,
      },
    });

    if (!tour) {
      return { success: false, error: "Tour not found" };
    }

    return { success: true, data: tour };
  } catch (error) {
    console.error("Error fetching tour by ID:", error);
    return { success: false, error: "Failed to fetch tour" };
  }
}

export async function updateTour(tourId: string, formData: any) {
  // console.log("prodrams", formData.programs);
  if (!tourId) {
    return { success: false, error: "Tour ID is required" };
  }

  try {
    const existingTour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: { programs: true, dates: true },
    });

    if (!existingTour) {
      return { success: false, error: "Tour not found" };
    }

    const validatedData = formData;

    const mainImageUrl = validatedData.imageURL
      ? await uploadImage(validatedData.imageURL)
      : existingTour.imageUrl;

    const deletableDateIds = existingTour.dates.map((d) => d.id);

    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        active: validatedData.active ?? true,
        title: validatedData.title,
        description: validatedData.description,
        titleCkecklist: validatedData.titleCkecklist,
        descriptionCkecklist: validatedData.descriptionCkecklist,
        showChecklist: validatedData.showChecklist,
        villeDepart: validatedData.villeDepart,
        ville: validatedData.ville,
        type: validatedData.type,
        priceOriginal: validatedData.priceOriginal,
        priceDiscounted:
          validatedData.priceDiscounted === 0 ||
          validatedData.priceDiscounted === undefined ||
          validatedData.priceDiscounted === null
            ? validatedData.priceOriginal
            : validatedData.priceDiscounted,
        discountEndDate: validatedData.discountEndDate
          ? new Date(validatedData.discountEndDate)
          : null,
        advancedPrice:
          parseInt(validatedData.advancedPrice) === 0
            ? parseInt(validatedData.priceOriginal)
            : parseInt(validatedData.advancedPrice) ||
              parseInt(validatedData.priceOriginal),
        dateCard: validatedData.dateCard,
        durationDays: parseInt(validatedData.durationDays),
        durationNights: parseInt(validatedData.durationNights),
        googleMapsUrl: validatedData.googleMapsUrl
          ? ((await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? "")
          : "",
        videoUrl: validatedData.videoUrl
          ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || ""
          : "",
        imageUrl: mainImageUrl,
        inclus: validatedData.inclus,
        exclus: validatedData.exclus,
        extracts: validatedData.extracts,
        groupType: validatedData.groupType,
        groupSizeMax: parseInt(validatedData.groupSizeMax),
        showReviews: validatedData.showReviews,
        showHebergement: validatedData.showHebergement,
        showDifficulty: validatedData.showDifficulty,
        showDiscount: validatedData.showDiscount,
        difficultyLevel: validatedData.difficultyLevel,
        discountPercent: validatedData.discountPercent,
        accommodationType: validatedData.accommodationType,

        dates: validatedData.dates
          ? {
              deleteMany: {
                id: { in: deletableDateIds },
              },
              create: validatedData.dates.map((d: any) => ({
                startDate: d.startDate,
                endDate: d.endDate,
                description: d.description,
                price: d.price ?? 0,
                visible: d.visible ?? true,
              })),
            }
          : undefined,

        destinations: validatedData.destinations
          ? {
              set: [],
              connect: validatedData.destinations.map((id: any) => ({ id })),
            }
          : undefined,

        categories: validatedData.categories
          ? {
              set: [],
              connect: validatedData.categories.map((id: any) => ({ id })),
            }
          : undefined,

        natures: validatedData.natures
          ? {
              set: [],
              connect: validatedData.natures.map((id: any) => ({ id })),
            }
          : undefined,

        services: validatedData.services
          ? {
              set: [],
              connect: validatedData.services.map((id: any) => ({ id })),
            }
          : undefined,
      },
    });

    if (validatedData.programs) {
      const normalizedPrograms = validatedData.programs.map((program: any) => ({
        ...program,
      }));
      await updateProgramsForTour(tourId, normalizedPrograms);
    }
    if (validatedData.bookinSteps) {
      const normalizedPrograms = validatedData.bookinSteps.map(
        (program: any) => ({
          ...program,
        })
      );
      await updateStepsForTour(tourId, normalizedPrograms);
    }
    if (validatedData.checklist) {
      const normalizedPrograms = validatedData.checklist.map(
        (program: any) => ({
          ...program,
        })
      );
      await updateChecklistForTour(tourId, normalizedPrograms);
    }

    return { success: true, data: updatedTour };
  } catch (error) {
    console.error("Prisma error:", error);

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: (error as any).code ?? null,
        meta: (error as any).meta ?? null,
        stack: (error as any).stack ?? null,
      },
    };
  }
}

async function updateProgramsForTour(
  tourId: string,
  programs: {
    id?: string;
    title: string;
    description?: string;
    orderIndex: number; // Add orderIndex to the type
  }[]
) {
  const existingPrograms = await prisma.program.findMany({
    where: { tourId },
    select: { id: true },
  });

  const incomingIds = programs.filter((p) => p.id).map((p) => p.id!);

  const toDelete = existingPrograms
    .filter((p) => !incomingIds.includes(p.id))
    .map((p) => p.id);

  if (toDelete.length > 0) {
    await prisma.program.deleteMany({ where: { id: { in: toDelete } } });
  }

  for (const [index, program] of programs.entries()) {
    if (program.id) {
      await prisma.program.update({
        where: { id: program.id },
        data: {
          title: program.title,
          description: program.description,
          orderIndex: program.orderIndex, // Include orderIndex in update
        },
      });
    } else {
      await prisma.program.create({
        data: {
          title: program.title,
          description: program.description,
          orderIndex: program.orderIndex, // Include orderIndex in create
          tourId,
        },
      });
    }
  }
}
async function updateStepsForTour(
  tourId: string,
  steps: {
    id?: string;
    title: string;
    description?: string;
    orderIndex: number;
  }[]
) {
  // 1. Find existing steps
  const existingPrograms = await prisma.bookingSteps.findMany({
    where: { tourId },
    select: { id: true },
  });

  const incomingIds = steps.filter((p) => p.id).map((p) => p.id!);

  const toDelete = existingPrograms
    .filter((p) => !incomingIds.includes(p.id))
    .map((p) => p.id);

  // 2. Delete removed ones
  if (toDelete.length > 0) {
    await prisma.bookingSteps.deleteMany({
      where: { id: { in: toDelete } },
    });
  }

  // 3. Prepare updates & creates
  const operations = steps.map((program) => {
    if (program.id) {
      return prisma.bookingSteps.update({
        where: { id: program.id },
        data: {
          title: program.title,
          description: program.description,
          orderIndex: program.orderIndex,
        },
      });
    } else {
      return prisma.bookingSteps.create({
        data: {
          tourId,
          title: program.title,
          description: program.description || "",
          orderIndex: program.orderIndex,
        },
      });
    }
  });

  // 4. Run in parallel
  await Promise.all(operations);
}
async function updateChecklistForTour(
  tourId: string,
  steps: {
    id?: string;
    title: string;
    description?: string;
    orderIndex: number;
  }[]
) {
  // 1. Find existing steps
  const existingPrograms = await prisma.checklist.findMany({
    where: { tourId },
    select: { id: true },
  });

  const incomingIds = steps.filter((p) => p.id).map((p) => p.id!);

  const toDelete = existingPrograms
    .filter((p) => !incomingIds.includes(p.id))
    .map((p) => p.id);

  // 2. Delete removed ones
  if (toDelete.length > 0) {
    await prisma.checklist.deleteMany({
      where: { id: { in: toDelete } },
    });
  }

  // 3. Prepare updates & creates
  const operations = steps.map((program) => {
    if (program.id) {
      return prisma.checklist.update({
        where: { id: program.id },
        data: {
          title: program.title,
          description: program.description,
          orderIndex: program.orderIndex,
        },
      });
    } else {
      return prisma.checklist.create({
        data: {
          tourId,
          title: program.title,
          description: program.description || "",
          orderIndex: program.orderIndex,
        },
      });
    }
  });

  // 4. Run in parallel
  await Promise.all(operations);
}

export async function getForProductDetails(tourId: string) {
  try {
    // Run the DB queries in parallel
    const programs = await prisma.program.findMany({
      where: {
        tourId,
      },
      orderBy: {
        orderIndex: "asc",
      },
    });
    return { data: programs };
  } catch (error) {
    console.error("Error fetching related tour data:", error);
    return {
      error: "Failed to fetch data",
    };
  }
}

export async function checkTourIdExists(tourId: string) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });
    return { exists: !!tour };
  } catch (error) {
    console.error("Error checking tour ID:", error);
    return { exists: false, error: "Failed to check tour ID" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateReservationTour(
  reservationId: string,
  updatedFields: any
) {
  try {
    const tour = await prisma.reservationForm.findUnique({
      where: { id: reservationId },
    });
    if (tour) {
      const res = await prisma.reservationForm.update({
        where: { id: reservationId },
        data: {
          fields: updatedFields,
        },
      });
      return { success: true, data: res };
    }
  } catch (error) {
    console.error("Error checking tour ID:", error);
    return { exists: false, error: "Failed to check tour ID" };
  } finally {
    await prisma.$disconnect();
  }
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";

// import { PrismaClient, type TravelType } from "@prisma/client";

// import { getEmbedGoogleMapsUrl } from "@/utils/getEmbedGoogleMapsUrl";
// import { getYouTubeEmbedUrl } from "@/utils/getYouTubeEmbedUrl";
// import { uploadImage } from "@/utils/uploadImage";

// const prisma = new PrismaClient();

// // Schema for validating tour data

// function getCorrectId(id: string) {
//   return id
//     .normalize("NFD")
//     .replace(/œ/g, "oe") // Replace oe ligature
//     .replace(/æ/g, "ae") // Replace ae ligature
//     .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
//     .replace(/\s+/g, "-") // Optional: spaces to dashes
//     .replace(/[^a-zA-Z0-9-]/g, "") // Keep only allowed chars
//     .replace(/-+/g, "-") // Collapse multiple dashes
//     .replace(/^-|-$/g, "") // Trim leading/trailing dash
//     .toLowerCase();
// }

// export async function addTour(
//   formData: any,
//   reservationFormFields: any[],
// ) {
//   try {
//     const validatedData = formData;

//     const tour = await prisma.tour.create({
//       data: {
//         id: getCorrectId(validatedData.id),
//         active: validatedData.active,
//         title: validatedData.title,
//         reservationForm: {
//           create: {
//             fields: reservationFormFields,
//           },
//         },
//         description: validatedData.description,
//         type: validatedData.type as TravelType,
//         priceOriginal: validatedData.priceOriginal,
//         priceDiscounted:
//           validatedData.priceDiscounted === 0 ||
//           validatedData.priceDiscounted === undefined ||
//           validatedData.priceDiscounted === null
//             ? validatedData.priceOriginal
//             : validatedData.priceDiscounted,
//         discountEndDate: validatedData.discountEndDate
//           ? new Date(validatedData.discountEndDate)
//           : null,
//         advancedPrice:
//           validatedData.advancedPrice === 0
//             ? validatedData.priceOriginal
//             : validatedData.advancedPrice || validatedData.priceOriginal,
//         dateCard: validatedData.dateCard,
//         durationDays: parseInt(validatedData.durationDays),
//         durationNights: parseInt(validatedData.durationNights),
//         googleMapsUrl: validatedData.googleMapsUrl
//           ? (await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? ""
//           : "",
//         videoUrl: validatedData.videoUrl
//           ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || ""
//           : "",
//         imageUrl: validatedData.imageURL
//           ? await uploadImage(validatedData.imageURL)
//           : "",
//         inclus: validatedData.inclus,
//         exclus: validatedData.exclus,
//         extracts: validatedData.extracts,
//         groupType: validatedData.groupType,
//         groupSizeMax: parseInt(validatedData.groupSizeMax),
//         showReviews: validatedData.showReviews,
//         showHebergement: validatedData.showHebergement,
//         showDifficulty: validatedData.showDifficulty,
//         showDiscount: validatedData.showDiscount,
//         difficultyLevel: validatedData.difficultyLevel,
//         discountPercent: validatedData.discountPercent,
//         accommodationType: validatedData.accommodationType,

//         dates: validatedData.dates
//           ? {
//               create: validatedData.dates.map((dateObj:any) => ({
//                 startDate: dateObj.startDate,
//                 endDate: dateObj.endDate,
//                 description: dateObj.description,
//                 price: dateObj.price ?? 0,
//                 visible: dateObj.visible ?? true,
//               })),
//             }
//           : undefined,

//         hotels: validatedData.hotels
//           ? {
//               connect: validatedData.hotels.map((id:any) => ({ id })),
//             }
//           : undefined,

//         services: validatedData.services
//           ? {
//               connect: validatedData.services.map((id:any) => ({ id })),
//             }
//           : undefined,

//         destinations: validatedData.destinations
//           ? {
//               connect: validatedData.destinations.map((id:any) => ({ id })),
//             }
//           : undefined,

//         categories: validatedData.categories
//           ? {
//               connect: validatedData.categories.map((id:any) => ({ id })),
//             }
//           : undefined,

//         natures: validatedData.natures
//           ? {
//               connect: validatedData.natures.map((id:any) => ({ id })),
//             }
//           : undefined,

//         images: validatedData.images
//           ? {
//               create: await Promise.all(
//                 validatedData.images.map(async (image:any) => ({
//                   url: image.link ? await uploadImage(image.link) : "",
//                 }))
//               ),
//             }
//           : undefined,

//         programs: validatedData.programs
//           ? {
//               create: await Promise.all(
//                 validatedData.programs.map(async (program:any) => {
//                   let imageUrl = "";

//                   if (program.image instanceof File) {
//                     imageUrl = await uploadImage(program.image);
//                   } else if (typeof program.image === "string") {
//                     imageUrl = program.image;
//                   }

//                   return {
//                     title: program.title,
//                     orderIndex: program.orderIndex,
//                     description: program.description,
//                     imageUrl,
//                   };
//                 })
//               ),
//             }
//           : undefined,
//       },
//     });

//     return { success: true, data: tour };
//   }  catch (error) {
//   console.error("Prisma error:", error);

//   return {
//     success: false,
//     error: {
//       message: error instanceof Error ? error.message : "Unknown error",
//       code: (error as any).code ?? null,
//       meta: (error as any).meta ?? null,
//       stack: (error as any).stack ?? null,
//     },
//   };
// }

// }

// export async function getAllTours() {
//   try {
//     const tours = await prisma.tour.findMany({
//       include: {
//         destinations: true,
//         categories: true,
//         natures: true,
//         programs: true,
//         images: true,
//       },
//       orderBy:{
//         updatedAt:"desc",
//       }
//     });
//     return { success: true, data: tours };
//   } catch (error) {
//     console.error("Error fetching tours:", error);
//     return { success: false, error: "Failed to fetch tours" };
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function deleteTour(tourId: string) {
//   try {
//     const deletedTour = await prisma.$transaction(async (tx) => {
//       // Delete dependent child records (one-to-many)
//       await tx.reservations.deleteMany({ where: { tourId } });
//       await tx.tourDate.deleteMany({ where: { tourId } });
//       await tx.program.deleteMany({ where: { tourId } });
//       await tx.file.deleteMany({ where: { tourId } }); // only works if relation is one-to-many

//       // Delete join table entries (many-to-many)
//       await tx.$executeRaw`DELETE FROM "_TourDestinations" WHERE "A" = ${tourId}`;
//       await tx.$executeRaw`DELETE FROM "_CategoryTours" WHERE "A" = ${tourId}`;
//       await tx.$executeRaw`DELETE FROM "_NatureTours" WHERE "A" = ${tourId}`;
//       await tx.$executeRaw`DELETE FROM "_TourServices" WHERE "A" = ${tourId}`;
//       await tx.$executeRaw`DELETE FROM "_HotelTours" WHERE "A" = ${tourId}`;

//       // Delete the tour itself
//       return await tx.tour.delete({
//         where: { id: tourId },
//       });
//     });

//     return { success: true, data: deletedTour };
//   } catch (error) {
//     console.error("Error deleting tour:", error);
//     return { success: false, error: "Failed to delete tour" };
//   }
// }

// export async function getTourById(tourId: string) {
//   try {
//     const tour = await prisma.tour.findUnique({
//       where: { id: tourId },
//       include: {
//         destinations: true,
//         categories: true,
//         natures: true,
//         services: true,
//         hotels: true,
//         programs: true,
//         images: true,
//         reservationForm:true,
//         dates: true,
//       },
//     });

//     if (!tour) {
//       return { success: false, error: "Tour not found" };
//     }

//     return { success: true, data: tour };
//   } catch (error) {
//     console.error("Error fetching tour by ID:", error);
//     return { success: false, error: "Failed to fetch tour" };
//   }
// }

// export async function updateTour(tourId: string, formData: any) {
//   // console.log("prodrams", formData.programs);
//   if (!tourId) {
//     return { success: false, error: "Tour ID is required" };
//   }

//   try {
//     const existingTour = await prisma.tour.findUnique({
//       where: { id: tourId },
//       include: { images: true, programs: true, dates: true },
//     });

//     if (!existingTour) {
//       return { success: false, error: "Tour not found" };
//     }

//     const validatedData = formData;

//     let newImages: { url: string }[] | undefined;

//     if (validatedData.images && validatedData.images.length > 0) {
//       newImages = await Promise.all(
//         validatedData.images.map(async (image:any) => ({
//           url: image.link ? await uploadImage(image.link) : "",
//         }))
//       );
//     } else if (validatedData.images) {
//       newImages = [];
//     } else {
//       newImages = undefined;
//     }

//     const mainImageUrl = validatedData.imageURL
//       ? await uploadImage(validatedData.imageURL)
//       : existingTour.imageUrl;

//     // Avoid deleting dates used by reservations
//     const usedDateIds = (
//       await prisma.reservations.findMany({
//         where: { tourId },
//         select: { travelDateId: true },
//       })
//     ).map((r) => r.travelDateId);

//     const deletableDateIds = existingTour.dates
//       .map((d) => d.id)
//       .filter((id) => !usedDateIds.includes(id));

//     const updatedTour = await prisma.tour.update({
//       where: { id: tourId },
//       data: {
//         active: validatedData.active ?? true,
//         title: validatedData.title,
//         description: validatedData.description,
//         type: validatedData.type,
//         priceOriginal: validatedData.priceOriginal,
//         priceDiscounted:
//           validatedData.priceDiscounted === 0 || validatedData.priceDiscounted === undefined || validatedData.priceDiscounted === null
//             ? validatedData.priceOriginal
//             : validatedData.priceDiscounted,
//         discountEndDate: validatedData.discountEndDate
//           ? new Date(validatedData.discountEndDate)
//           : null,
//         advancedPrice:
//           validatedData.advancedPrice === 0
//             ? validatedData.priceOriginal
//             : validatedData.advancedPrice || validatedData.priceOriginal,
//         dateCard: validatedData.dateCard,
//         durationDays:  parseInt(validatedData.durationDays),
//         durationNights:  parseInt(validatedData.durationNights),
//         googleMapsUrl: validatedData.googleMapsUrl
//           ? (await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? ""
//           : "",
//         videoUrl: validatedData.videoUrl
//           ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || ""
//           : "",
//         imageUrl: mainImageUrl,
//         inclus: validatedData.inclus,
//         exclus: validatedData.exclus,
//         extracts: validatedData.extracts,
//         groupType: validatedData.groupType,
//         groupSizeMax:  parseInt(validatedData.groupSizeMax),
//         showReviews: validatedData.showReviews,
//         showHebergement: validatedData.showHebergement,
//         showDifficulty: validatedData.showDifficulty,
//         showDiscount: validatedData.showDiscount,
//         difficultyLevel: validatedData.difficultyLevel,
//         discountPercent: validatedData.discountPercent,
//         accommodationType: validatedData.accommodationType,

//         dates: validatedData.dates
//           ? {
//               deleteMany: {
//                 id: { in: deletableDateIds },
//               },
//               create: validatedData.dates.map((d:any) => ({
//                 startDate: d.startDate,
//                 endDate: d.endDate,
//                 description: d.description,
//                 price: d.price ?? 0,
//                 visible: d.visible ?? true, // Default to true if not provided
//               })),
//             }
//           : undefined,

//         destinations: validatedData.destinations
//           ? {
//               set: [],
//               connect: validatedData.destinations.map((id:any) => ({ id })),
//             }
//           : undefined,

//         categories: validatedData.categories
//           ? {
//               set: [],
//               connect: validatedData.categories.map((id:any) => ({ id })),
//             }
//           : undefined,

//         natures: validatedData.natures
//           ? {
//               set: [],
//               connect: validatedData.natures.map((id:any) => ({ id })),
//             }
//           : undefined,

//         services: validatedData.services
//           ? {
//               set: [],
//               connect: validatedData.services.map((id:any) => ({ id })),
//             }
//           : undefined,

//         hotels: validatedData.hotels
//           ? {
//               set: [],
//               connect: validatedData.hotels.map((id:any) => ({ id })),
//             }
//           : undefined,

//         images: validatedData.images
//           ? {
//               deleteMany: {},
//               create: newImages,
//             }
//           : undefined,
//       },
//     });

//     if (validatedData.programs) {
//       const normalizedPrograms = validatedData.programs.map((program:any) => ({
//         ...program,
//         image: program.image === undefined ? null : program.image,
//       }));
//       await updateProgramsForTour(tourId, normalizedPrograms);
//     }

//     return { success: true, data: updatedTour };
//   }  catch (error) {
//     console.error("Prisma error:", error);

//     return {
//       success: false,
//       error: {
//         message: error instanceof Error ? error.message : "Unknown error",
//         code: (error as any).code ?? null,
//         meta: (error as any).meta ?? null,
//         stack: (error as any).stack ?? null,
//       },
//     };
//   }
// }

// async function updateProgramsForTour(
//   tourId: string,
//   programs: {
//     id?: string;
//     title: string;
//     description?: string;
//     image: string | File | null;
//   }[]
// ) {
//   const existingPrograms = await prisma.program.findMany({
//     where: { tourId },
//     select: { id: true },
//   });

//   const incomingIds = programs.filter((p) => p.id).map((p) => p.id!);

//   const toDelete = existingPrograms
//     .filter((p) => !incomingIds.includes(p.id))
//     .map((p) => p.id);

//   if (toDelete.length > 0) {
//     await prisma.program.deleteMany({ where: { id: { in: toDelete } } });
//   }

//   for (const program of programs) {
//     let imageUrl = "";

//     if (program.image instanceof File) {
//       imageUrl = await uploadImage(program.image);
//     } else if (typeof program.image === "string" && program.image !== "") {
//       imageUrl = program.image;
//     } else if (program.id) {
//       const old = await prisma.program.findUnique({
//         where: { id: program.id },
//       });
//       imageUrl = old?.imageUrl || "";
//     }

//     if (program.id) {
//       await prisma.program.update({
//         where: { id: program.id },
//         data: {
//           title: program.title,
//           description: program.description,
//           imageUrl,
//         },
//       });
//     } else {
//       await prisma.program.create({
//         data: {
//           title: program.title,
//           description: program.description,
//           imageUrl,
//           tourId,
//         },
//       });
//     }
//   }
// }

// export async function checkTourIdExists(tourId: string) {
//   try {
//     const tour = await prisma.tour.findUnique({
//       where: { id: tourId },
//     });
//     return { exists: !!tour };
//   } catch (error) {
//     console.error("Error checking tour ID:", error);
//     return { exists: false, error: "Failed to check tour ID" };
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function updateReservationTour(reservationId: string,updatedFields:any) {
//   try {
//     const tour = await prisma.reservationForm.findUnique({
//       where: { id: reservationId },
//     });
//     if(tour){
//        const res = await prisma.reservationForm.update({
//         where: { id: reservationId },
//         data: {
//           fields:updatedFields
//         },
//       });
//        return { success: true ,  data: res };
//     }

//   } catch (error) {
//     console.error("Error checking tour ID:", error);
//     return { exists: false, error: "Failed to check tour ID" };
//   } finally {
//     await prisma.$disconnect();
//   }
// }
