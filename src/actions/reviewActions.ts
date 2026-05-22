"use server";

import { Review, ReviewStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
// 1. Define the interfaces for the Hugging Face response
// cardiffnlp/twitter-xlm-roberta-base-sentiment returns lowercase labels
type SentimentLabel = "positive" | "negative" | "neutral";

interface SentimentResult {
  label: SentimentLabel;
  score: number;
}

// 2. Strongly typed fetching function
async function analyzeFrenchSentiment(
  text: string,
): Promise<SentimentResult[] | null> {
  const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
  const MODEL_URL =
    "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-xlm-roberta-base-sentiment";

  try {
    const response = await fetch(MODEL_URL, {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`HuggingFace API error [${response.status}]:`, errorBody);

      // 503 = model is still loading on HF free tier, treat as graceful failure
      if (response.status === 503) {
        console.warn(
          "HuggingFace model is loading, skipping sentiment analysis.",
        );
        return null;
      }

      throw new Error(
        `API responded with status: ${response.status} - ${errorBody}`,
      );
    }

    // Hugging Face text classification returns an array of arrays: [[{label: 'POSITIVE', score: 0.9}, ...]]
    const result = (await response.json()) as SentimentResult[][];
    return result[0] || null;
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    return null; // Fail gracefully so the review can still be saved as PENDING
  }
}
export async function AddReview(
  fullName: string,
  message: string,
  rating: number,
  tourId: string,
) {
  if (!fullName || !message || !rating) {
    return { success: false, error: "Failed to add review" };
  }
  let finalStatus: ReviewStatus = ReviewStatus.PENDING;

  // Run AI Sentiment Analysis
  const sentimentResult = await analyzeFrenchSentiment(message);

  if (sentimentResult) {
    // cardiffnlp model returns lowercase "positive", "negative", "neutral"
    const positiveScoreObj = sentimentResult.find(
      (s) => s.label === "positive",
    );
    const negativeScoreObj = sentimentResult.find(
      (s) => s.label === "negative",
    );
    const positiveScore = positiveScoreObj?.score ?? 0;
    const negativeScore = negativeScoreObj?.score ?? 0;

    const HIGH_CONFIDENCE_POSITIVE = 0.6;
    const HIGH_CONFIDENCE_NEGATIVE = 0.6;

    if (positiveScore >= HIGH_CONFIDENCE_POSITIVE) {
      finalStatus = ReviewStatus.APPROVED;
    } else if (negativeScore >= HIGH_CONFIDENCE_NEGATIVE) {
      finalStatus = ReviewStatus.REJECTED;
    } else {
      finalStatus = ReviewStatus.PENDING;
    }
  }

  const review = await prisma.review.create({
    data: {
      tourId,
      fullName,
      message,
      rating: Number(rating),
      status: finalStatus,
    },
  });
  return { success: true, data: review };
}

export async function GetReviewsByTourId(tourId: string) {
  if (!tourId) {
    return { success: false, error: "Tour ID is required" };
  }
  const reviews = await prisma.review.findMany({
    where: { tourId },
    orderBy: { createdAt: "desc" },
  });
  return { success: true, data: reviews };
}

export async function GetAllReviews() {
  const reviews = await prisma.review.findMany({
    include: {
      tour: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const enrichedReviews = reviews.map((review) => ({
    ...review,
    tourTitle: review.tour?.title || "Tour inconnu",
  }));

  return { success: true, data: enrichedReviews };
}

export async function DeleteReview(reviewId: string) {
  if (!reviewId) {
    return { success: false, error: "Review ID is required" };
  }

  const review = await prisma.review.delete({
    where: { id: reviewId },
  });

  return { success: true, data: review };
}

export async function UpdateReview(reviewId: string, data: Review) {
  if (!reviewId) {
    return { success: false, error: "Review ID is required" };
  }
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: {
      fullName: data.fullName,
      message: data.message,
      rating: Number(data.rating),
      status: data.status,
    },
  });
  return { success: true, data: review };
}

export async function UpdateReviewStatus(
  reviewId: string,
  status: ReviewStatus,
) {
  if (!reviewId) {
    return { success: false, error: "Review ID is required" };
  }

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });

  return { success: true, data: review };
}

import { revalidatePath } from "next/cache";

// Delete Review
export const deleteReview = async (id: string) => {
  try {
    await prisma.googleReview.delete({
      where: { id },
    });
    revalidatePath("/admin/dashboard/reviews");
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: "Failed to delete review" };
  }
};

// Create Review
export const createReviewe = async (data: {
  authorName: string;
  rating: number;
  text?: string;
  profilePhotoUrl?: string;
  time?: Date;
  status: boolean;
}) => {
  try {
    const review = await prisma.googleReview.create({
      data: {
        ...data,
        time: data.time || new Date(),
        status: true, // Default to published
      },
    });
    revalidatePath("/admin/dashboard/reviews");
    return { success: true, data: review };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Failed to create review" };
  }
};
export const createReview = async (data: {
  authorName: string;
  rating: number;
  text?: string;
  time?: string;
  status: boolean;
}) => {
  try {
    const review = await prisma.googleReview.create({
      data: {
        ...data,
        time: data.time ? new Date(data.time) : new Date(),
        status: true, // This always overwrites input!
      },
    });
    revalidatePath("/admin/dashboard/reviews");
    return { success: true, data: review };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Failed to create review" };
  }
};

// Update Review
export const updateReview = async (
  id: string,
  data: {
    authorName?: string;
    rating?: number;
    text?: string;
    authorUrl?: string;
    time?: Date;
    status?: boolean;
  },
) => {
  try {
    const review = await prisma.googleReview.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/dashboard/review-google");
    return { success: true, data: review };
  } catch (error) {
    console.error("Error updating review:", error);
    return { success: false, error: "Failed to update review" };
  }
};

// Toggle Review Status
export const toggleReviewStatus = async (id: string) => {
  try {
    const current = await prisma.googleReview.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!current) throw new Error("Review not found");

    const review = await prisma.googleReview.update({
      where: { id },
      data: { status: !current.status },
    });

    revalidatePath("/admin/dashboard/reviews");
    return { success: true, data: review };
  } catch (error) {
    console.error("Error toggling review status:", error);
    return { success: false, error: "Failed to toggle status" };
  }
};
