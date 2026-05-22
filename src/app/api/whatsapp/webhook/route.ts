// app/api/webhooks/whatsapp/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { messageQueue } from "@/lib/queue";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Meta WhatsApp webhook payload structure
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return NextResponse.json({ status: "no_message" });

    const from = message.from; // Customer phone number
    const text = message.text?.body || "";
    const messageId = message.id;

    // Find reservation by phone number (most recent active one)
    const reservation = await prisma.reservations.findFirst({
      where: {
        phone: `+${from}`,
        status: {
          in: ["PENDING", "AWAITING_CONFIRMATION", "AWAITING_PAYMENT"],
        },
      },
      orderBy: { createdAt: "desc" },
      include: { tour: true },
    });

    if (!reservation) {
      console.log("No active reservation found for:", from);
      return NextResponse.json({ status: "no_reservation" });
    }

    // Store incoming message
    await prisma.messageLog.create({
      data: {
        reservationId: reservation.id,
        direction: "INBOUND",
        content: text,
        channel: "WHATSAPP",
        status: "RECEIVED",
      },
    });

    // Queue for AI processing
    await messageQueue.add("process-reply", {
      reservationId: reservation.id,
      customerMessage: text,
      phone: from,
    });

    return NextResponse.json({
      status: "queued",
      reservationId: reservation.id,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

// Required for Meta webhook verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Verification failed", { status: 403 });
}
