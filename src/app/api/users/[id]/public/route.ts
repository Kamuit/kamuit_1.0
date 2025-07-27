import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        location: true,
        website: true,
        createdAt: true, // instead of joinDate
        ridePosts: {
          orderBy: { date: 'desc' },
          select: {
            id: true,
            from: true,
            to: true,
            date: true,
            timeOfDay: true,
            type: true,
            seats: true,
            contactInfo: true,
            notes: true,
            hashtags: {
              select: {
                hashtag: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Flatten hashtags so frontend can read easily
    const ridePosts = user.ridePosts.map(post => ({
      ...post,
      hashtags: post.hashtags.map(h => h.hashtag.name),
    }));

    return NextResponse.json({ user: { ...user, ridePosts } }, { status: 200 });
  } catch (err) {
    console.error('❌ Failed to fetch user:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}