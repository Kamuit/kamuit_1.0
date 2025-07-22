// /app/api/send-verification-code/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const code = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8-digit

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await prisma.verificationCode.upsert({
    where: { email },
    update: { code, createdAt: new Date(), expiresAt },
    create: { email, code, expiresAt },
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL!,
      pass: process.env.SMTP_PASSWORD!,
    },
  });

  await transporter.sendMail({
    from: `"Kamuit" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Kamuit Verification Code',
    text: `Here is your verification code: ${code}`,
    html: `<p>Here is your <strong>Kamuit</strong> verification code:</p><h2>${code}</h2><p>This code will expire in 15 minutes.</p>`,
  });

  return NextResponse.json({ message: 'Code sent' });
}