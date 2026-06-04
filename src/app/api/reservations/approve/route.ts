import { NextRequest, NextResponse } from "next/server";
import { PaymentStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const { reservationId } = body;

    const reservation = await prisma.reservations.update({
      where: {
        id: reservationId,
      },
      data: {
        paymentStatus: PaymentStatus.CONFIRMED,
      },
    });

    return NextResponse.json({
      success: true,
      reservation,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Update failed",
      },
      { status: 500 }
    );
  }
}