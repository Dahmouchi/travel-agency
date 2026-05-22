// scripts/upload-vectors.ts

import { uploadToursToVectorDB } from "@/lib/vector-db-setup";

async function main() {
  console.log("🚀 Starting vector upload process...");

  try {
    await uploadToursToVectorDB();
    console.log("✅ Upload completed successfully!");
  } catch (error) {
    console.error("❌ Upload failed:", error);
    process.exit(1);
  }
}

main();
