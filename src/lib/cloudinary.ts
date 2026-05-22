import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadReceiptFromUrl(
  imageUrl: string,
  reservationId: string,
) {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: "payment-receipts",
    public_id: `receipt-${reservationId}`,
    resource_type: "image",
  });
  return result.secure_url;
}
