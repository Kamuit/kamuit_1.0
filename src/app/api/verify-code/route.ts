// /app/api/verify-code/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: 'Missing email or code' }, { status: 400 });
  }

  const record = await prisma.verificationCode.findUnique({
    where: { email },
  });

  if (!record) {
    return NextResponse.json({ error: 'No code found. Please request a new one.' }, { status: 404 });
  }

  if (record.code !== code) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  if (new Date() > record.expiresAt) {
    return NextResponse.json({ error: 'Code expired' }, { status: 410 });
  }

  // Optionally: delete the code after use
  await prisma.verificationCode.delete({ where: { email } });

  return NextResponse.json({ message: 'Email verified' });
}