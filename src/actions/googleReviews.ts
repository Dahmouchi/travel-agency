/* eslint-disable @typescript-eslint/no-unused-vars */
// app/actions/googleReviews.ts
"use server";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export async function createGoogleReview(formData: FormData) {
  try {
    const authorName = formData.get("authorName") as string;
    const text = formData.get("text") as string;
    const rating = formData.get("rating") as string;
     const originalText = formData.get("originalText") as string;
    const time = formData.get("time") as string;
    const status = formData.get("status") === "true"; // Convert string to boolean
    const image1 = formData.get("profilePhotoUrl") as File;
    const image2 = formData.get("language") as File;
    
    const quality = 80;

    async function processAndUploadImage(image: File): Promise<string | null> {
      if (!image || image.size === 0) return null;

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${timestamp}-${image.name}`;
      const arrayBuffer = await image.arrayBuffer();

      const compressedBuffer = await sharp(arrayBuffer)
        .resize(1200)
        .jpeg({ quality })
        .toBuffer();

      const fileContent = Buffer.from(compressedBuffer);

      await uploadFile(fileContent, filename, image.type);
      return getFileUrl(filename); // e.g. https://your-s3-bucket.com/filename
    }

    const image1Url = await processAndUploadImage(image1);
    const image2Url = await processAndUploadImage(image2);

    const blog = await prisma.googleReview.create({
      data: {
        authorName: authorName,
        text: text || "null",
        originalText:originalText || "1",
        rating: parseInt(rating) || 5,
        time: new Date(time),
        status: status,
        profilePhotoUrl: image1Url,
        language: image2Url,
      },
    });

    revalidatePath("/");
    return { success: true, data: blog };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateGoogleReview(id: string, formData: FormData) {
  try {
    const authorName = formData.get("authorName") as string;
    const text = formData.get("text") as string;
    const rating = formData.get("rating") as string;
    const time = formData.get("time") as string;
    const status = formData.get("status") === "true"; // Convert string to boolean
    const imageFile = formData.get("profilePhotoUrl") as File | null;

    // Get current blog data to check for existing image
    const currentBlog = await prisma.googleReview.findUnique({
      where: { id },
    });
    let imageUrl = currentBlog?.profilePhotoUrl || null;

    // Only process image if a new file was uploaded
    if (imageFile && imageFile.size > 0) {
      const quality = 80;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${timestamp}-${imageFile.name}`;

      const arrayBuffer = await imageFile.arrayBuffer();
      const optimizedImage = await sharp(arrayBuffer)
        .resize(1200)
        .jpeg({ quality })
        .toBuffer();

      await uploadFile(optimizedImage, filename, imageFile.type);
      imageUrl = getFileUrl(filename);

      // TODO: Add logic to delete old image if needed
    }
    const updatedBlog = await prisma.googleReview.update({
      where: { id },
      data: {
        authorName,
        text: text || null,
        rating: parseInt(rating) || 5,
        time: new Date(time),
        profilePhotoUrl: imageUrl,
        status,
      },
    });

    revalidatePath("/");
    return { success: true, data: updatedBlog };
  } catch (error) {
    console.error("Error updating blog:", error);
    return { success: false, error: "Failed to update blog" };
  }
}

export async function deleteGoogleReview(id: string) {
  try {
    await prisma.googleReview.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function getGoogleReview() {
  try {
    const blogs = await prisma.googleReview.findMany({
      orderBy: { createdAt: "asc" },
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getGoogleReviews(placeId: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json"
  );
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "reviews,rating,user_ratings_total");
  url.searchParams.set("key", apiKey!);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch Google Places");
  const json = await res.json();
  console.log(json);
  if (json.status !== "OK") throw new Error(json.status);
  return json.result;
}
