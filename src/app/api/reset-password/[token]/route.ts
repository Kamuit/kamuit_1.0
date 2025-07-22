import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;
  const { password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: 'Missing token or password' }, { status: 400 });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: token },
      data: { password: hashed },
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('[Reset Password Error]', err);
    return NextResponse.json({ error: 'User not found or update failed' }, { status: 404 });
  }
}