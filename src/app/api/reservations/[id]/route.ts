// ── GET /api/venues/[id] ──────────────────────────────────────────────────────

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> },
) {
  const { reservationId } = await params;

  const reservation = await prisma.reservations.findFirst({
    where: {
      id: reservationId,
    },
    include: {
      tour: true,
    },
  });

  return NextResponse.json({ reservation });
}
