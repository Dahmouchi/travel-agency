// scripts/prepare-training-data-v3.ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface TourChunk {
  id: string;
  content: string;
  metadata: {
    tourId: string;
    title: string;
    type: string;
    destination: string;
    chunkType: "description" | "program" | "dates" | "service";
    // Added more metadata for better filtering
    price?: number;
    duration?: string;
    category?: string;
  };
}

async function prepareTrainingDataV3() {
  console.log("📊 Fetching tours and preparing chunks...");

  try {
    const tours = await prisma.tour.findMany({
      include: {
        destinations: true,
        categories: true,
        services: true,
        programs: { orderBy: { orderIndex: "asc" } },
        dates: { where: { visible: true } },
      },
    });

    const allChunks: TourChunk[] = [];

    for (const tour of tours) {
      // Enhanced metadata with more useful information
      const baseMetadata = {
        tourId: tour.id,
        title: tour.title,
        type: tour.type,
        destination: tour.destinations.map((d) => d.name).join(", "),
        price: tour.priceDiscounted ?? tour.priceOriginal ?? undefined,
        duration: `${tour.durationDays || 0} days / ${tour.durationNights || 0} nights`,
        category: tour.categories.map((c) => c.name).join(", "),
      };

      // Chunk 1: Description générale et services
      const descriptionContent = `
Titre: ${tour.title}
Type: ${tour.type}
Destination: ${tour.destinations.map((d) => d.name).join(", ")}
Description: ${tour.description || "Pas de description"}
Services Inclus: ${tour.services.map((s) => s.name).join(", ") || "Non spécifié"}
Ce qui est inclus: ${tour.inclus || "Non spécifié"}
Ce qui est exclu: ${tour.exclus || "Non spécifié"}
Durée: ${tour.durationDays || 0} days / ${tour.durationNights || 0} nights
Prix: ${tour.priceDiscounted || tour.priceOriginal || "Prix non défini"} MAD
      `.trim();

      allChunks.push({
        id: `${tour.id}-desc`,
        content: descriptionContent,
        metadata: { ...baseMetadata, chunkType: "description" },
      });

      // Chunk 2: Programme Journalier (each day as a separate chunk)
      tour.programs.forEach((program, index) => {
        const programContent = `
Titre du Voyage: ${tour.title}
Destination: ${tour.destinations.map((d) => d.name).join(", ")}
Jour ${index + 1}: ${program.title}
Détails du Jour: ${program.description || "Pas de détails"}
        `.trim();

        allChunks.push({
          id: `${tour.id}-prog-${index + 1}`,
          content: programContent,
          metadata: { ...baseMetadata, chunkType: "program" },
        });
      });

      // Chunk 3: Dates et Prix
      if (tour.dates.length > 0) {
        const datesContent = `
Titre du Voyage: ${tour.title}
Destination: ${tour.destinations.map((d) => d.name).join(", ")}
Prix: ${tour.priceDiscounted || tour.priceOriginal || "Prix non défini"} MAD
Dates Disponibles:
 ${tour.dates
   .map((d) => {
     const start = d.startDate
       ? new Date(d.startDate).toLocaleDateString("fr-FR")
       : "TBD";
     const end = d.endDate
       ? new Date(d.endDate).toLocaleDateString("fr-FR")
       : "TBD";
     return `${start} au ${end} - ${d.price || "Prix non défini"} MAD`;
   })
   .join("\n")}
        `.trim();

        allChunks.push({
          id: `${tour.id}-dates`,
          content: datesContent,
          metadata: { ...baseMetadata, chunkType: "dates" },
        });
      }
    }

    // Save the chunks
    const outputPath = path.join(
      process.cwd(),
      "data",
      "tours-chunks-for-embedding-v3.json"
    );
    fs.writeFileSync(outputPath, JSON.stringify(allChunks, null, 2));

    console.log(`✅ Prepared ${allChunks.length} chunks for embedding.`);
    console.log(`💾 Saved to: ${outputPath}`);

    // Generate a summary of the chunks
    const chunkSummary = {
      totalChunks: allChunks.length,
      chunkTypes: {
        description: allChunks.filter(
          (c) => c.metadata.chunkType === "description"
        ).length,
        program: allChunks.filter((c) => c.metadata.chunkType === "program")
          .length,
        dates: allChunks.filter((c) => c.metadata.chunkType === "dates").length,
      },
      tours: tours.length,
    };

    const summaryPath = path.join(process.cwd(), "data", "chunk-summary.json");
    fs.writeFileSync(summaryPath, JSON.stringify(chunkSummary, null, 2));
    console.log(`📊 Chunk summary saved to: ${summaryPath}`);

    await prisma.$disconnect();
    return allChunks;
  } catch (error) {
    console.error("❌ Error preparing data:", error);
    await prisma.$disconnect();
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  prepareTrainingDataV3()
    .then(() => {
      console.log("✅ Data preparation complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Data preparation failed:", error);
      process.exit(1);
    });
}

export { prepareTrainingDataV3 };
