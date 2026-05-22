// lib/vector-db-setup.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Pinecone } from "@pinecone-database/pinecone";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import fs from "fs";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

// FREE HuggingFace embedding model (384 dimensions)
const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2",
  apiKey: process.env.HUGGINGFACE_API_KEY || "", // Get free key from huggingface.co
});

export async function initializeVectorStore() {
  try {
    const indexName = "travel-tours";

    // Check if index exists
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some((idx) => idx.name === indexName);

    if (!indexExists) {
      // Create index with 384 dimensions for MiniLM model
      await pinecone.createIndex({
        name: indexName,
        dimension: 384, // Changed from 1536 to 384 for MiniLM
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });

      console.log("✅ Pinecone index created");

      // Wait for index to be ready (45 seconds is safer)
      console.log("⏳ Waiting 45 seconds for index to initialize...");
      await new Promise((resolve) => setTimeout(resolve, 45000));
    }

    const index = pinecone.Index(indexName);

    return { index, embeddings, indexName };
  } catch (error) {
    console.error("Error initializing vector store:", error);
    throw error;
  }
}

export async function uploadToursToVectorDB() {
  try {
    const { index, embeddings, indexName } = await initializeVectorStore();

    // Load prepared training data
    const dataPath = "./data/tours-training-data.json";

    if (!fs.existsSync(dataPath)) {
      throw new Error(
        `Training data file not found at ${dataPath}. Run 'npm run prepare-data' first.`,
      );
    }

    const trainingData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    if (!trainingData || trainingData.length === 0) {
      throw new Error(
        "No training data found. Make sure your database has tours.",
      );
    }

    console.log(`📦 Processing ${trainingData.length} tours...`);

    // Convert to LangChain documents
    const documents = trainingData.map(
      (tour: any) =>
        new Document({
          pageContent: tour.content,
          metadata: {
            ...tour.metadata,
            tourId: tour.id,
          },
        }),
    );

    console.log("🚀 Uploading to Pinecone...");

    // Upload to Pinecone in batches to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);

      await PineconeStore.fromDocuments(batch, embeddings, {
        pineconeIndex: index,
        namespace: "tours",
      });

      console.log(
        `✅ Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)}`,
      );

      // Small delay between batches
      if (i + batchSize < documents.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `✅ Successfully uploaded ${documents.length} tours to vector database`,
    );
  } catch (error) {
    console.error("❌ Error uploading to vector DB:", error);
    throw error;
  }
}

// Alternative: Supabase Vector approach (if you prefer)
export async function setupSupabaseVector() {
  // If you want to use Supabase instead of Pinecone:
  // 1. Enable pgvector extension in Supabase
  // 2. Create embeddings table
  // 3. Use @supabase/supabase-js

  const setupSQL = `
    -- Enable pgvector extension
    create extension if not exists vector;

    -- Create embeddings table
    create table tour_embeddings (
      id uuid primary key default gen_random_uuid(),
      tour_id text not null,
      content text not null,
      embedding vector(1536),
      metadata jsonb,
      created_at timestamp default now()
    );

    -- Create index for faster similarity search
    create index on tour_embeddings 
    using ivfflat (embedding vector_cosine_ops)
    with (lists = 100);

    -- Function for similarity search
    create or replace function match_tours (
      query_embedding vector(1536),
      match_threshold float,
      match_count int
    )
    returns table (
      id uuid,
      tour_id text,
      content text,
      metadata jsonb,
      similarity float
    )
    language sql stable
    as $$
      select
        tour_embeddings.id,
        tour_embeddings.tour_id,
        tour_embeddings.content,
        tour_embeddings.metadata,
        1 - (tour_embeddings.embedding <=> query_embedding) as similarity
      from tour_embeddings
      where 1 - (tour_embeddings.embedding <=> query_embedding) > match_threshold
      order by similarity desc
      limit match_count;
    $$;
  `;

  return setupSQL;
}
