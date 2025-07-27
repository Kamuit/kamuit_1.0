// src/app/api/universities/search/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  try {
    const results = await prisma.university.findMany({
      where: {
        institution: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 10,
      orderBy: { institution: 'asc' },
    })

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch universities' }, { status: 500 })
  }
}