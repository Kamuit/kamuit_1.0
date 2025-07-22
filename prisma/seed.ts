// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const hashtags = [
    { id: 'PetFriendly', name: 'Pet Friendly' },
    { id: 'SmokeFree', name: 'Smoke Free' },
    { id: 'WomenOnly', name: 'Women Only' },
    { id: 'MusicOK', name: 'Music OK' },
    { id: 'QuietRide', name: 'Quiet Ride' },
    { id: 'FlexibleTiming', name: 'Flexible Timing' },
    { id: 'RoundTrip', name: 'Round Trip' },
    { id: 'SameCollege', name: 'Same College' },
  ]

  for (const tag of hashtags) {
    await prisma.hashtag.upsert({
      where: { id: tag.id },
      update: {},
      create: {
        id: tag.id,
        name: tag.name,
      },
    })
  }

  console.log('✅ Seeded hashtags')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
