import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

async function notifyUsers(postId: string, subject: string, message: string) {
  console.log(`[notifyUsers] Notifying users for post ID: ${postId} with subject: "${subject}"`);

  const saved = await prisma.savedRide.findMany({
    where: { ridePostId: postId },
    include: { user: true },
  });

  console.log(`[notifyUsers] Found ${saved.length} saved users`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await Promise.all(saved.map(({ user }) => {
    console.log(`[notifyUsers] Sending mail to: ${user.email}`);
    return transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject,
      text: message,
    });
  }));
}

// DELETE endpoint
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log(`[DELETE] Request received for post ID: ${id}`);

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const post = await prisma.ridePost.findUnique({ where: { id } });
    if (!post) {
      console.log(`[DELETE] Post not found for ID: ${id}`);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    console.log(`[DELETE] Notifying users before deleting post: ${id}`);
    await notifyUsers(id, 'Ride Post Deleted', `The ride from ${post.from} to ${post.to} on ${post.date.toDateString()} has been deleted.`);

    console.log(`[DELETE] Deleting post: ${id}`);
    await prisma.ridePost.delete({ where: { id } });

    console.log(`[DELETE] Post deleted successfully`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE] ERROR:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

// PATCH endpoint
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log(`[PATCH] Request received for post ID: ${id}`);

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  const data = await req.json();
  console.log('[PATCH] Raw request body:', data);

  const allowedFields = ['from', 'to', 'date', 'timeOfDay', 'seats', 'contactInfo', 'notes'];
  const updateData: Record<string, any> = {};

  for (const key of allowedFields) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  console.log('[PATCH] Sanitized updateData:', updateData);

  if (Object.keys(updateData).length === 0) {
    console.warn('[PATCH] No valid fields found to update');
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  try {
    const original = await prisma.ridePost.findUnique({ where: { id } });
    if (!original) {
      console.log(`[PATCH] Post not found with ID: ${id}`);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updated = await prisma.ridePost.update({
      where: { id },
      data: updateData,
    });

    console.log('[PATCH] Post updated successfully');

    await notifyUsers(id, 'Ride Post Updated', `The ride you saved from ${original.from} to ${original.to} has been updated.`);

    return NextResponse.json({ post: updated });
  } catch (error) {
    console.error('[PATCH] ERROR:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}