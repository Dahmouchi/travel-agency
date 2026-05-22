// app/chat/route-v5.ts (Mise à jour pour corriger l'hallucination géographique)

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { cosine } from "ml-distance/lib/similarities";
import * as fs from "fs";
import * as path from "path";

// --- 1. CONFIGURATION ET CHARGEMENT DES DONNÉES ---

interface TourChunk {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    tourId: string;
    title: string;
    type: string; // Contient 'NATIONAL' ou 'INTERNATIONAL'
    destination: string;
    chunkType: "description" | "program" | "dates" | "service";
  };
}

const embeddedChunksPath = path.join(
  process.cwd(),
  "data",
  "tours_with_embeddings_v4.json"
);
const embeddedChunks: TourChunk[] = JSON.parse(
  fs.readFileSync(embeddedChunksPath, "utf-8")
);

const GENERATION_MODEL = "gemini-2.5-flash";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- 2. FONCTIONS DE CORRECTION ORTHOGRAPHIQUE, EMBEDDING, RETRIEVAL, RE-RANKING (Inchangées) ---
// ... (Les fonctions correctSpelling, getQueryEmbeddingBGE, searchChunks, reRankChunks restent les mêmes que dans v4)

async function correctSpelling(query: string): Promise<string> {
  const correctionPrompt = `Corrige uniquement les fautes d'orthographe et de frappe dans la phrase suivante. Ne réponds qu'avec la phrase corrigée, sans aucune explication ou ponctuation supplémentaire.
    
    Phrase à corriger : "${query}"
    
    Phrase corrigée :`;

  try {
    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: correctionPrompt,
      config: {
        temperature: 0.0,
      },
    });

    if (!response.text) {
      throw new Error("Failed to generate response");
    }

    const correctedText = response.text.trim();
    if (correctedText.length > 0 && correctedText.length < query.length * 2) {
      return correctedText;
    }
    return query;
  } catch (error) {
    console.error("Spelling correction failed, using original query:", error);
    return query;
  }
}

async function getQueryEmbeddingBGE(query: string): Promise<number[]> {
  console.log("Simulating BGE-M3 embedding for query...");
  const vectorDimension = embeddedChunks[0]?.embedding.length || 1024;
  return Array(vectorDimension)
    .fill(0)
    .map(() => Math.random());
}

function searchChunks(queryVector: number[], k: number = 20): TourChunk[] {
  const scores = embeddedChunks.map((chunk) => {
    const chunkVector = chunk.embedding;
    if (!chunkVector || chunkVector.length !== queryVector.length) {
      return { chunk, similarity: -Infinity };
    }
    const similarity = 1 - cosine(queryVector, chunkVector);
    return { chunk, similarity };
  });
  scores.sort((a, b) => b.similarity - a.similarity);
  return scores.slice(0, k).map((item) => item.chunk);
}

function reRankChunks(
  query: string,
  chunks: TourChunk[],
  n: number = 5
): TourChunk[] {
  console.log("Simulating Re-ranking by taking the top N chunks...");
  return chunks.slice(0, n);
}

// --- 3. FONCTION DE GÉNÉRATION (Generation) - PROMPT ANTI-HALLUCINATION ---

async function generateResponseWithLLM(
  userQuery: string,
  context: string
): Promise<string> {
  // PROMPT MIS À JOUR pour renforcer l'instruction anti-hallucination
  const prompt = `Tu es HappyTrips, un agent de voyage IA amical et expert. Ta mission est de répondre à la question de l'utilisateur en te basant **STRICTEMENT** sur les informations fournies dans le CONTEXTE ci-dessous.

**Règles Impératives :**
1.  Réponds en français.
2.  **ANTI-HALLUCINATION CRITIQUE :** Tu ne dois **JAMAIS** faire d'hypothèses sur la limitation géographique de nos offres. Si le CONTEXTE contient des voyages INTERNATIONAUX (comme l'Azerbaïdjan, la Turquie, etc.), tu dois les proposer. **NE DÉCLARE JAMAIS que les voyages sont limités au Maroc ou à une autre région, sauf si le CONTEXTE le dit explicitement.**
3.  **QUALITÉ DE LA RÉPONSE :** Fournis une réponse **détaillée et complète**. Si tu recommandes un voyage, élabore sur ses caractéristiques (prix, durée, destination, activités) en utilisant les informations du contexte. Évite les réponses trop courtes.
4.  Ne réponds **JAMAIS** avec des informations qui ne sont pas dans le CONTEXTE.
5.  Si le CONTEXTE ne contient pas la réponse, dis poliment que tu ne peux pas répondre à cette question avec les informations disponibles.
6.  **LIENS :** Lorsque tu mentionnes un voyage, utilise le lien fourni dans le contexte pour créer un lien Markdown. Le format du lien est : \`[Nom du Voyage](/voyage/[ID du voyage])\`.

---
CONTEXTE (Informations Pertinentes) :
${context}
---

QUESTION DE L'UTILISATEUR : ${userQuery}

Réponse de HappyTrips :`;

  const response = await ai.models.generateContent({
    model: GENERATION_MODEL,
    contents: prompt,
    config: {
      temperature: 0.3,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate response");
  }

  return response.text.trim();
}

// --- 4. NEXT.JS ROUTE HANDLER (Inchangé, utilise la nouvelle fonction generateResponseWithLLM) ---

export async function POST(req: NextRequest) {
  const { userQuery: rawUserQuery } = (await req.json()) as {
    userQuery: string;
  };

  try {
    const userQuery = await correctSpelling(rawUserQuery);
    console.log(`Query: "${rawUserQuery}" -> Corrected: "${userQuery}"`);

    const queryVector = await getQueryEmbeddingBGE(userQuery);
    const topKChunks = searchChunks(queryVector, 20);

    if (topKChunks.length === 0) {
      return NextResponse.json({
        answer:
          "Je n'ai trouvé aucune information pertinente pour répondre à votre question. Pourriez-vous reformuler ou essayer une autre requête ?",
        sources: [],
      });
    }

    const finalChunks = reRankChunks(userQuery, topKChunks, 5);

    const context = finalChunks
      .map(
        (chunk) =>
          `Voyage: ${chunk.metadata.title} (ID: ${chunk.metadata.tourId})\nLien: /voyage/${chunk.metadata.tourId}\nType de Contenu: ${chunk.metadata.chunkType}\nContenu:\n${chunk.content}`
      )
      .join("\n\n--- Séparateur de Contexte ---\n\n");

    const llmResponse = await generateResponseWithLLM(userQuery, context);

    const uniqueSources = Array.from(
      new Set(finalChunks.map((chunk) => chunk.metadata.tourId))
    ).map((tourId) => {
      const chunk = finalChunks.find((c) => c.metadata.tourId === tourId);

      if (!chunk) {
        return null;
      }

      return {
        title: chunk.metadata.title,
        tourId: tourId,
        link: `/voyage/${tourId}`,
      };
    });

    return NextResponse.json({
      answer: llmResponse,
      sources: uniqueSources,
    });
  } catch (error) {
    console.error("RAG Process Error:", error);
    return NextResponse.json(
      {
        message:
          "Une erreur interne est survenue lors de la recommandation de voyage.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
