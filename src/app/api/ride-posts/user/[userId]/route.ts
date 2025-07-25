// /app/api/ride-posts/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const posts = await prisma.ridePost.findMany({
      where: { userId: params.userId },
      include: { hashtags: { include: { hashtag: true } }, user: true }
    });
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}