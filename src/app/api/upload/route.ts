// app/api/upload/route.ts
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const maxDuration = 60; // optional: increase timeout limit if needed
export const dynamic = "force-dynamic"; // optional: avoid caching issues

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();

  const compressedBuffer = await sharp(arrayBuffer)
    .resize(1200)
    .jpeg({ quality: 80 })
    .toBuffer();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${timestamp}-${file.name}`;

  const fileContent = Buffer.from(compressedBuffer);

  await uploadFile(fileContent, fileName, file.type);
  const url = getFileUrl(fileName);

  return NextResponse.json({ url }, { status: 200 });
}
