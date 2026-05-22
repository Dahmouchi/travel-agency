// lib/queue.ts
import { Queue } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

export const messageQueue = new Queue("message-processing", {
  connection: redisConnection,
});
