import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }
  try {
    await prisma.ridePost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }
  const data = await req.json();

  // Only allow fields that exist in the schema
  const allowedFields = [
    'from', 'to', 'date', 'timeOfDay', 'seats', 'contactInfo', 'notes'
  ];
  const updateData: Record<string, any> = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  try {
    const updated = await prisma.ridePost.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ post: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}