import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.ridePost.findMany({
      where: {
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            id: true,
          },
        },
        hashtags: {
          select: {
            hashtag: {
              select: { name: true },
            },
          },
        },
      },
    });

    const formatted = posts.map((post) => ({
      ...post,
      hashtags: post.hashtags.map((h) => h.hashtag.name),
      role: post.type === 'OFFER' ? 'driver' : 'passenger',
    }));

    const res = NextResponse.json({ posts: formatted }, { status: 200 });
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');

    return res;
  } catch (error) {
    console.error('[GET_RIDE_POSTS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch ride posts' }, { status: 500 });
  }
}