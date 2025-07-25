import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, MessageType } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, contact, message, type } = await req.json();

  if (!contact || !message || !type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const entry = await prisma.contactMessage.create({
    data: {
      userId,
      contact,
      message,
      type: type.toUpperCase() === 'CONTACT' ? 'CONTACT' : 'FEEDBACK',
    },
  });

  return NextResponse.json({ success: true, entry });
}