import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { postId } = await req.json()

  const post = await prisma.ridePost.findUnique({
    where: { id: postId },
    include: { savedBy: true }, // savedBy is the relation to User[]
  })

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  const sendMailPromises = post.savedBy.map(user =>
    transporter.sendMail({
      from: '"Kamuit" <kamuit@app.com>',
      to: user.email,
      subject: `A ride post you saved has been removed`,
      text: `Hi ${user.firstName},\n\nThe ride from ${post.from} to ${post.to} on ${post.date} has been deleted by the user.\n\n– Kamuit Team`,
    })
  )

  await Promise.allSettled(sendMailPromises)

  return NextResponse.json({ success: true })
}