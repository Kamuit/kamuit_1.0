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
      // Unsaving: delete savedRide and decrement count
      await prisma.$transaction([
        prisma.savedRide.delete({ where: { id: existing.id } }),
        prisma.ridePost.update({
          where: { id: ridePostId },
          data: { saveCount: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({ saved: false });
    } else {
      // Saving: create savedRide and increment count
      await prisma.$transaction([
        prisma.savedRide.create({
          data: { userId, ridePostId },
        }),
        prisma.ridePost.update({
          where: { id: ridePostId },
          data: { saveCount: { increment: 1 } },
        }),
      ]);

      return NextResponse.json({ saved: true });
    }
  } catch (err) {
    console.error('[TOGGLE_SAVE_RIDE]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}