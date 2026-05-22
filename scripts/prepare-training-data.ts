// scripts/prepare-training-data.ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface TourTrainingData {
  id: string;
  content: string;
  metadata: {
    tourId: string;
    title: string;
    type: string;
    price: number;
    destination: string;
    duration: string;
    category: string;
  };
}

async function prepareTrainingData() {
  try {
    console.log("📊 Fetching tours from database...");

    // Fetch all active tours with relations
    const tours = await prisma.tour.findMany({
      include: {
        destinations: true,
        categories: true,
        natures: true,
        services: true,
        programs: {
          orderBy: { orderIndex: "asc" },
          take: 1, // Limit program days
        },
        dates: {
          where: { visible: true },
          take: 5, // Limit dates
        },
      },
    });

    console.log(`✅ Found ${tours.length} active tours`);

    if (tours.length === 0) {
      console.warn("⚠️  No active tours found in database!");
      return [];
    }

    // Transform tours into training format
    const trainingData: TourTrainingData[] = tours.map((tour) => {
      // Build comprehensive content for embedding (NO SIZE LIMIT)
      const content = `
Title: ${tour.title}
Type: ${tour.type}
Description: ${tour.description || "No description"}
Price: ${tour.priceDiscounted || tour.priceOriginal || "Price not set"} MAD
${tour.discountPercent ? `Discount: ${tour.discountPercent}% off` : ""}
Duration: ${tour.durationDays || 0} days / ${tour.durationNights || 0} nights
Destinations: ${tour.destinations.map((d) => d.name).join(", ") || "Not specified"}
Categories: ${tour.categories.map((c) => c.name).join(", ") || "Not specified"}
Nature: ${tour.natures.map((n) => n.name).join(", ") || "Not specified"}
Departure City: ${tour.villeDepart || "Not specified"}
City: ${tour.ville || "Not specified"}
Group Type: ${tour.groupType || "Not specified"}
Group Size Max: ${tour.groupSizeMax || "Unlimited"}
Difficulty Level: ${tour.difficultyLevel ? `${tour.difficultyLevel}/5` : "Not specified"}
Accommodation: ${tour.accommodationType || "Not specified"}
Services Included: ${tour.services.map((s) => s.name).join(", ") || "Not specified"}
What's Included: ${tour.inclus || "Not specified"}
What's Excluded: ${tour.exclus || "Not specified"}

Daily Program:
${tour.programs.map((p, idx) => `Day ${idx + 1}: ${p.title}\n${p.description || "No details"}`).join("\n\n")}

Reviews: Average rating ${tour.averageRating}/5 based on ${tour.totalReviews} reviews

Available Dates:
${
  tour.dates
    .map((d) => {
      const start = d.startDate
        ? new Date(d.startDate).toLocaleDateString("fr-FR")
        : "TBD";
      const end = d.endDate
        ? new Date(d.endDate).toLocaleDateString("fr-FR")
        : "TBD";
      return `${start} to ${end} - ${d.price || "Price TBD"} MAD`;
    })
    .join("\n") || "No dates available yet"
}

Special Notes: ${tour.extracts || "None"}
      `.trim();

      // CRITICAL: Keep metadata SMALL (under 40KB)
      // Only essential fields for filtering and display
      return {
        id: tour.id,
        content, // Full content goes here (no size limit)
        metadata: {
          // MINIMAL data only (40KB limit)
          tourId: tour.id,
          title: tour.title.substring(0, 100), // Truncate long titles
          type: tour.type,
          price: tour.priceDiscounted || tour.priceOriginal || 0,
          destination: tour.destinations
            .map((d) => d.name)
            .join(", ")
            .substring(0, 100),
          duration: `${tour.durationDays || 0} days`,
          category: tour.categories
            .map((c) => c.name)
            .join(", ")
            .substring(0, 50),
        },
      };
    });

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save to JSON file
    const outputPath = path.join(dataDir, "tours-training-data.json");
    fs.writeFileSync(outputPath, JSON.stringify(trainingData, null, 2));

    // Calculate and log metadata size for verification
    const avgMetadataSize =
      trainingData.reduce((sum, tour) => {
        return sum + JSON.stringify(tour.metadata).length;
      }, 0) / trainingData.length;

    console.log(`✅ Prepared ${trainingData.length} tours for training`);
    console.log(
      `📊 Average metadata size: ${Math.round(avgMetadataSize)} bytes (limit: 40960 bytes)`
    );
    console.log(`💾 Saved to: ${outputPath}`);

    if (avgMetadataSize > 40000) {
      console.warn("⚠️  Warning: Some metadata might be too large!");
    }

    return trainingData;
  } catch (error) {
    console.error("❌ Error preparing training data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  prepareTrainingData()
    .then(() => {
      console.log("✅ Data preparation complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Data preparation failed:", error);
      process.exit(1);
    });
}

export { prepareTrainingData };
