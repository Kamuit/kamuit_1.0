import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      from,
      to,
      date,
      timeOfDay,
      seats,
      contactInfo,
      notes,
      hashtags = [],
    } = body;

    // Validate required fields
    if (!userId || !from || !to || !date || !seats || !contactInfo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create ride post of type 'OFFER'
    const ridePost = await prisma.ridePost.create({
      data: {
        userId,
        type: body.type === 'REQUEST' ? 'REQUEST' : 'OFFER',
        from,
        to,
        date: new Date(date),
        timeOfDay,
        seats,
        seatsAvailable: seats,
        contactInfo,
        notes,
        hashtags: {
          create: hashtags.map((hashtagId: string) => ({
            hashtag: {
              connect: { id: hashtagId },
            },
          })),
        },
      },
    });

    return NextResponse.json({ message: 'Ride post created successfully', ridePost }, { status: 201 });
  } catch (error) {
    console.error('[DRIVER ADD POST ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}