import { NextRequest, NextResponse } from "next/server";
import { uploadFile, getFileUrl } from "@/lib/cloudeFlare";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const fileName = `payment-receipts/${Date.now()}-${file.name}`;

    await uploadFile(
      buffer,
      fileName,
      file.type
    );

    const url = getFileUrl(fileName);

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}