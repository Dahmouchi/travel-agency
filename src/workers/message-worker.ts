// workers/message-worker.ts
import { Worker } from "bullmq";
import OpenAI from "openai";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import prisma from "@/lib/prisma";
import Redis from "ioredis";
import { m } from "framer-motion";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const redisConnection = new Redis("process.env._URL");

const worker = new Worker(
  "message-processing",
  async (job) => {
    const { reservationId, customerMessage, phone } = job.data;

    // Fetch reservation with history
    const reservation = await prisma.reservations.findUnique({
      where: { id: reservationId },
      include: {
        tour: true,
        messages: { orderBy: { createdAt: "asc" }, take: 10 },
      },
    });

    if (!reservation) return;

    // Build conversation history for AI
    const messages = [
      {
        role: "system",
        content: `You are a travel booking assistant for a tour company. 
Current reservation:
- Customer: ${reservation.prenom} ${reservation.nom}
- Tour: ${reservation.tour.title}
- Dates: ${reservation.startDate.toLocaleDateString()} to ${reservation.endDate.toLocaleDateString()}
- Price: ${reservation.finalPrice} MAD
- Status: ${reservation.status}

Your tasks:
1. Answer questions about the tour
2. When customer confirms interest, say you'll send payment link
3. Keep responses concise (max 2 sentences)
4. Speak in French or Arabic based on customer language
5. Be friendly and professional`,
      },
      ...reservation.messages.map((m) => ({
        role: m.direction === "INBOUND" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: customerMessage },
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cheaper option
      messages: [],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_payment_link",
            description: "Generate payment link when customer wants to pay",
            parameters: { type: "object", properties: {} },
          },
        },
      ],
    });

    const aiMessage = completion.choices[0].message;

    // Handle payment intent detection
    const lowerMsg = customerMessage.toLowerCase();
    const paymentIntent = [
      "pay",
      "payment",
      "payer",
      "confirm",
      "oui",
      "yes",
      "ok",
      "d'accord",
    ].some((word) => lowerMsg.includes(word));

    if (paymentIntent || aiMessage.tool_calls) {
      // Generate Stripe payment link
      const paymentUrl = "https//:buildalettlebiz.com";

      const paymentMessage = `Parfait! Voici votre lien de paiement sécurisé:\n${paymentUrl}\n\nUne fois le paiement reçu, notre équipe validera votre réservation sous 24h.`;

      await sendWhatsAppMessage(phone, paymentMessage);

      // Update status
      await prisma.reservations.update({
        where: { id: reservationId },
        data: { status: "AWAITING_PAYMENT" },
      });

      // Log message
      await prisma.messageLog.create({
        data: {
          reservationId,
          direction: "OUTBOUND",
          content: paymentMessage,
          channel: "WHATSAPP",
          status: "SENT",
        },
      });

      return;
    }

    // Send normal AI response
    await sendWhatsAppMessage(phone, aiMessage.content!);

    // Log AI response
    await prisma.messageLog.create({
      data: {
        reservationId,
        direction: "OUTBOUND",
        content: aiMessage.content!,
        channel: "WHATSAPP",
        status: "SENT",
        aiGenerated: true,
      },
    });
  },
  { connection: redisConnection },
);

console.log("Message worker started");
