// /src/app/api/profile/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, bio, location, website } = body

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { email },
    data: {
      bio,
      location,
      website,
    },
  })

  return NextResponse.json({ user })
}