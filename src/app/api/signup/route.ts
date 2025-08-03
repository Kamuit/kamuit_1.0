// /app/api/signup/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  let { firstName, lastName, email, password, homeCity, isStudent, university, gender } = await req.json()

  email = email.toLowerCase()

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashed,
      homeCity: homeCity || null,
      isStudent: Boolean(isStudent),
      university: university || null,
      gender,
    },
  })

  return NextResponse.json({
    message: 'User created',
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      homeCity: user.homeCity,
      isStudent: user.isStudent,
      university: user.university,
    },
  })
}