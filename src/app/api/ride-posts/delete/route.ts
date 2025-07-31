// /app/api/ride-posts/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { postId } = await req.json();

  try {
    // Get users who saved this ride post
    const savedUsers = await prisma.savedRide.findMany({
      where: { ridePostId: postId },
      include: {
        user: {
          select: { email: true, firstName: true },
        },
        ridePost: {
          select: { from: true, to: true, date: true },
        },
      },
    });

    // Setup nodemailer transporter (use your actual SMTP or provider credentials)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,       // Your email
        pass: process.env.SMTP_PASSWORD,   // App password or real pass
      },
    });

    // Send an email to each user
    for (const entry of savedUsers) {
      const { user, ridePost } = entry;
      await transporter.sendMail({
        from: `"Kamuit" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'A ride you were interested in has been removed',
        text: `Hi ${user.firstName},\n\nA ride from ${ridePost.from} to ${ridePost.to} on ${new Date(ridePost.date).toLocaleDateString()} has been deleted by the poster.\n\nThanks for using Kamuit!`,
      });
    }

    // Delete the ride post
    await prisma.ridePost.delete({ where: { id: postId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE_POST_ERROR]', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}