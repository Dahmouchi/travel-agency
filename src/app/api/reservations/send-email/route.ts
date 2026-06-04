import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const phone =
    req.nextUrl.searchParams.get('phone')

  if (!phone) {
    return NextResponse.json({
      found: false
    })
  }

  const reservation =
    await prisma.reservations.findFirst({
      where: {
        phone: {
          contains: phone.replace(
            'whatsapp:',
            ''
          )
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

  return NextResponse.json({
    found: !!reservation,
    reservation
  })
}