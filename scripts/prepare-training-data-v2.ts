// scripts/prepare-training-data-v2.ts (Pseudo-code pour l'implémentation du Chunking)

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Définition du type pour un CHUNK, pas pour un Tour complet
interface TourChunk {
  id: string; // ID unique du chunk (ex: tourId-chunkIndex)
  content: string; // Le petit morceau de texte sémantiquement cohérent
  metadata: {
    tourId: string;
    title: string;
    type: string;
    destination: string;
    chunkType: "description" | "program" | "dates" | "service"; // Pour le re-ranking
    // Autres métadonnées utiles pour le filtrage
  };
}

async function prepareTrainingDataV2() {
  console.log("📊 Fetching tours and preparing chunks...");

  const tours = await prisma.tour.findMany({
    // ... (Même include que dans l'ancien script)
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
    // --- 1. Chunking des informations principales (Description, Services) ---
    const baseMetadata = {
      tourId: tour.id,
      title: tour.title,
      type: tour.type,
      destination: tour.destinations.map((d) => d.name).join(", "),
    };

    // Chunk 1: Description générale et services
    const descriptionContent = `
Titre: ${tour.title}
Type: ${tour.type}
Description: ${tour.description || "Pas de description"}
Services Inclus: ${tour.services.map((s) => s.name).join(", ") || "Non spécifié"}
Ce qui est inclus: ${tour.inclus || "Non spécifié"}
Ce qui est exclu: ${tour.exclus || "Non spécifié"}
    `.trim();

    allChunks.push({
      id: `${tour.id}-desc`,
      content: descriptionContent,
      metadata: { ...baseMetadata, chunkType: "description" },
    });

    // --- 2. Chunking du Programme Journalier ---
    tour.programs.forEach((program, index) => {
      const programContent = `
Titre du Voyage: ${tour.title}
Jour ${index + 1}: ${program.title}
Détails du Jour: ${program.description || "Pas de détails"}
      `.trim();

      allChunks.push({
        id: `${tour.id}-prog-${index + 1}`,
        content: programContent,
        metadata: { ...baseMetadata, chunkType: "program" },
      });
    });

    // --- 3. Chunking des Dates et Prix ---
    const datesContent = `
Titre du Voyage: ${tour.title}
Prix: ${tour.priceDiscounted || tour.priceOriginal || "Prix non défini"} MAD
Dates Disponibles:
${
  tour.dates
    .map((d) => {
      const start = d.startDate
        ? new Date(d.startDate).toLocaleDateString("fr-FR")
        : "TBD";
      const end = d.endDate
        ? new Date(d.endDate).toLocaleDateString("fr-FR")
        : "TBD";
      return `${start} au ${end} - ${d.price || "Prix non défini"} MAD`;
    })
    .join("\n") || "Aucune date disponible pour le moment"
}
    `.trim();

    allChunks.push({
      id: `${tour.id}-dates`,
      content: datesContent,
      metadata: { ...baseMetadata, chunkType: "dates" },
    });
  }

  // --- 4. Sauvegarde des Chunks ---
  const outputPath = path.join(
    process.cwd(),
    "data",
    "tours-chunks-for-embedding.json"
  );
  fs.writeFileSync(outputPath, JSON.stringify(allChunks, null, 2));

  console.log(`✅ Prepared ${allChunks.length} chunks for embedding.`);
  console.log(`💾 Saved to: ${outputPath}`);

  await prisma.$disconnect();
  return allChunks;
}

// ... (Exécution du script)
// export { prepareTrainingDataV2 };

// Run if called directly
if (require.main === module) {
  prepareTrainingDataV2()
    .then(() => {
      console.log("✅ Data preparation complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Data preparation failed:", error);
      process.exit(1);
    });
}

export { prepareTrainingDataV2 };
