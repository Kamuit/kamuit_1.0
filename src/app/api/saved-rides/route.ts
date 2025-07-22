import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const saved = await prisma.savedRide.findMany({
      where: { userId },
      include: {
        ridePost: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            hashtags: {
              select: {
                hashtag: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    const formatted = saved.map(entry => ({
      ...entry.ridePost,
      hashtags: entry.ridePost.hashtags.map(h => h.hashtag.name),
      role: entry.ridePost.type === 'OFFER' ? 'driver' : 'passenger',
    }));

    return NextResponse.json({ posts: formatted }, { status: 200 });
  } catch (error) {
    console.error('[GET_SAVED_RIDES_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch saved rides' }, { status: 500 });
  }
}
