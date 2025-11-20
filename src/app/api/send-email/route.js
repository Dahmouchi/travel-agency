// app/api/send-email/route.js
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// CORS handler
function setCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*') // You can change '*' to 'http://localhost:3000' or your frontend URL
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })
  return setCorsHeaders(response)
}

// Handle actual POST request
export async function POST(request) {
  const data = await request.json()

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
      user: "info@betterbeuz.com",
      pass: "LH75ENJBIaXpGP1W",
    },
  })

  try {
    await transporter.sendMail({
      from: '"BetterBeuz" <contact@betterbeuz.com>',
      to: data.to,
      subject: data.subject,
      html: data.html,
    })

    const response = NextResponse.json({ success: true })
    return setCorsHeaders(response)
  } catch (error) {
    const response = NextResponse.json({ error: error.message }, { status: 500 })
    return setCorsHeaders(response)
  }
}
