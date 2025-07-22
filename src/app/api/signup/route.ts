// /app/api/signup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { StreamChat } from 'stream-chat';

const prisma = new PrismaClient();

const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function POST(req: NextRequest) {
  const {
    firstName,
    lastName,
    email,
    password,
    homeCity,
    isStudent,
    university,
    gender
  } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashed,
      homeCity: homeCity || null,
      isStudent: Boolean(isStudent),
      university: university || null,
      gender
    },
  });

  try {
    await streamClient.upsertUser({
      id: user.id,
      name: `${firstName} ${lastName}`,
    });
  } catch (err) {
    console.error('[Stream Upsert Error]', err);
    return NextResponse.json({ error: 'Failed to create chat user' }, { status: 500 });
  }

  const token = streamClient.createToken(user.id);

  return NextResponse.json({
    message: 'User created',
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      homeCity: user.homeCity,
      isStudent: user.isStudent,
      university: user.university,
    },
    chatToken: token,
    streamApiKey: process.env.STREAM_API_KEY,
  });
}
