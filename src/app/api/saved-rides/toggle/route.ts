import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, ridePostId } = await req.json();

    if (!userId || !ridePostId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.savedRide.findFirst({
      where: { userId, ridePostId },
    });

    if (existing) {
      await prisma.savedRide.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.savedRide.create({
        data: { userId, ridePostId },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (err) {
    console.error('[TOGGLE_SAVE_RIDE]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
