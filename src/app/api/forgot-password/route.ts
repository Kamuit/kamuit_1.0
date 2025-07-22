import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return NextResponse.json({ error: 'No user found with that email' }, { status: 404 })
  }

  const resetToken = user.id // Could also be a short-lived JWT or a UUID stored in a separate table

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const mailOptions = {
    from: `"Kamuit Support" <${process.env.SMTP_EMAIL}>`,
    to: user.email,
    subject: 'Reset your Kamuit password',
    html: `
      <div style="font-family: sans-serif; padding: 16px;">
        <h2>Hello ${user.firstName} 👋</h2>
        <p>We heard you've forgotten your password. No worries, it happens to the best of us.</p>
        <a href="${resetUrl}" style="background-color: #10b981; padding: 12px 20px; color: white; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
        <p style="margin-top: 16px;">If you didn't request this, you can safely ignore it.</p>
        <p>Love,<br/>The Kamuit Team ❤️</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ message: 'Reset link sent to email!' })
  } catch (error) {
    console.error('Email sending failed:', error)
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
  }
}