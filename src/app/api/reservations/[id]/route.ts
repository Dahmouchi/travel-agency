// ── GET /api/venues/[id] ──────────────────────────────────────────────────────

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {

  const { id } = await params;

  const reservation = await prisma.reservations.findFirst({
    where: {
      id,
    }
  });

  return NextResponse.json({ reservation });
}