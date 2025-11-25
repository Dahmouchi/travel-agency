/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { uploadImage } from "@/utils/uploadImage";
import prisma from "@/lib/prisma";
import { Landing } from "@prisma/client"; // Optional, if you want type support

export async function saveLandingConfig(
  sections: Record<string, boolean>,
  cardImage: File[] | null
) {
  // Get current landing config
  const current = await prisma.landing.findFirst();

  // Upload new image if provided, else keep current
  const mainImageUrl = cardImage
    ? await uploadImage(cardImage[0])
    : current?.imageHero || "";

  if (!current) {
    // Create new landing config
    await prisma.landing.create({
      data: {
        ...sections,
        imageHero: mainImageUrl,
      },
    });
  } else {
    // Update existing landing config
    await prisma.landing.update({
      where: { id: current.id },
      data: {
        ...sections,
        imageHero: mainImageUrl,
      },
    });
  }
}
export async function saveOmrahImage(
  sections: Record<string, boolean>,
  cardImage: File[] | null
) {
  // Get current landing config
  const current = await prisma.landing.findFirst();

  // Upload new image if provided, else keep current
  const mainImageUrl = cardImage
    ? await uploadImage(cardImage[0])
    : current?.imageHero || "";

  if (!current) {
    // Create new landing config
    await prisma.landing.create({
      data: {
        ...sections,
        imageOmrah: mainImageUrl,
      },
    });
  } else {
    // Update existing landing config
    await prisma.landing.update({
      where: { id: current.id },
      data: {
        ...sections,
        imageOmrah: mainImageUrl,
      },
    });
  }
}
export async function saveCondition(
  id: string,
  type: "condition" | "plitique",
  content: string
) {
  try {
    await prisma.landing.update({
      where: { id },
      data: {
        [type]: content,
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`Error saving ${type}:`, error);
    return { success: false, error: "Failed to save content" };
  }
}
export async function saveGoogleAvieButton(googleAvie: boolean) {
  try {
    const landing = await prisma.landing.findFirst();
    await prisma.landing.update({
      where: { id: landing?.id },
      data: {
        googleAvie: googleAvie,
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`Error saving :`, error);
    return { success: false, error: "Failed to save content" };
  }
}
export async function saveNavbarItems(navbarItems: any) {
  await prisma.$transaction(
    navbarItems.map((item: any) =>
      prisma.navbarItem.update({
        where: { id: item.id },
        data: {
          label: item.label,
          isVisible: item.isVisible,
          order: item.order,
        },
      })
    )
  );

  return { success: true };
}
// lib/landing.ts or wherever you define helpers

export async function getLanding(): Promise<Landing | null> {
  try {
    const current = await prisma.landing.findFirst();
    return current;
  } catch (error) {
    console.error("Error fetching landing config:", error);
    return null;
  }
}
export async function GetAllNews() {
  const reviews = await prisma.newsLetter.findMany({
    orderBy: { createdAt: "desc" },
  });

  return { success: true, data: reviews };
}
export async function GetNavItems() {
  const navbarItem = await prisma.navbarItem.findMany({
    orderBy: { order: "asc" },
  });

  return { success: true, data: navbarItem };
}
export async function GetFAQ() {
  const faq = await prisma.faq.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return { success: true, data: faq };
}
export async function markAllNewsTrue() {
  const reviews = await prisma.newsLetter.updateMany({
    data: {
      statu: true,
    },
  });

  return { success: true, data: reviews };
}
export async function DeleteNews(reviewId: string) {
  if (!reviewId) {
    return { success: false, error: "Review ID is required" };
  }

  const review = await prisma.newsLetter.delete({
    where: { id: reviewId },
  });

  return { success: true, data: review };
}
export async function UpdateNewsStatus(reviewId: string, statu: boolean) {
  if (!reviewId) {
    return { success: false, error: "Review ID is required" };
  }
  const review = await prisma.newsLetter.update({
    where: { id: reviewId },
    data: { statu },
  });

  return { success: true, data: review };
}
export async function createNewsLetter(
  nom: string,
  prenom: string,
  email: string,
  phone: string,
  message: string
) {
  // First get the current landing page config
  try {
    const res = await prisma.newsLetter.create({
      data: {
        nom,
        prenom,
        email,
        phone,
        message,
      },
    });
    return res;
  } catch (error) {
    console.error("Error creating newsletter:", error);
    return { success: false, error: "Failed to create destination" };
  }
}
export async function createFaq(
  question: string,
  answer: string,
  orderIndex: number
) {
  // First get the current landing page config
  try {
    const res = await prisma.faq.create({
      data: {
        question,
        orderIndex,
        answer,
      },
    });
    return { success: true, data: res };
  } catch (error) {
    console.error("Error creating newsletter:", error);
    return { success: false, error: "Failed to create destination" };
  }
}
export async function updateFaq(
  faqId: string,
  data: { question?: string; answer?: string; orderIndex?: number }
) {
  if (!faqId) {
    return { success: false, error: "FAQ ID is required for update" };
  }

  try {
    const updatedFaq = await prisma.faq.update({
      where: { id: faqId },
      data: data,
    });
    return { success: true, data: updatedFaq };
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return { success: false, error: "Failed to update FAQ" };
  }
}

export async function DeleteFaq(reviewId: string) {
  if (!reviewId) {
    return { success: false, error: "Review ID is required" };
  }

  const review = await prisma.faq.delete({
    where: { id: reviewId },
  });

  return { success: true, data: review };
}
