"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma"; // Your prisma client import

// 1. Setup the AI Client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function generateTravelContent(formData: FormData) {
  const file = formData.get("image") as File;

  if (!file) {
    throw new Error("No image provided");
  }

  // 2. Convert Image to Base64 so AI can read it
  const arrayBuffer = await file.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  // 3. Prepare the AI Model (Gemini 1.5 Flash is fast and cheap)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 4. The Magic Prompt
  const prompt = `
    You are a travel copywriter. Look at this travel image.
    Generate a catchy title, an engaging marketing description (approx 3 sentences), 
    guess the location (country/city), and generate 5 SEO tags.
    
    IMPORTANT: Return ONLY raw JSON without markdown formatting.
    Structure:
    {
      "title": "String",
      "description": "String",
      "location": "String",
      "tags": ["String", "String"]
    }
  `;

  // 5. Call AI
  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    },
  ]);

  const responseText = result.response.text();

  // 6. Clean and Parse JSON
  // Sometimes AI adds \`\`\`json blocks, so we clean it
  const cleanJson = responseText.replace(/```json|```/g, "").trim();
  const data = JSON.parse(cleanJson);

  // 7. Save to Postgres via Prisma
  // (Assuming you upload the image to S3/Cloudinary separately and get a URL.
  // Here we just save the text data for demonstration)

  const savedPackage = {};
  return savedPackage;
}
