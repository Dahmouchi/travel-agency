import { NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function GET() {
  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER!,
      to: 'whatsapp:+212714603892',

      body: 'Bonjour 👋 Test Twilio WhatsApp'
    })

    return NextResponse.json({
      success: true,
      sid: message.sid
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({
      success: false,
      error
    })
  }
}