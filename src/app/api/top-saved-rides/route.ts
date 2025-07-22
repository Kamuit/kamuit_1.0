// File: src/app/api/top-saved-rides/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Count number of times each ride has been saved
    const popularRides = await prisma.ridePost.findMany({
      take: 3,
      where: {
        status: 'ACTIVE',
      },
      orderBy: {
        savedByUsers: {
          _count: 'desc',
        },
      },
      include: {
        savedByUsers: true,
        user: true,
      },
    });

    return NextResponse.json({ rides: popularRides });
  } catch (error) {
    console.error('Error fetching popular rides:', error);
    return NextResponse.json({ error: 'Failed to load rides' }, { status: 500 });
  }
}