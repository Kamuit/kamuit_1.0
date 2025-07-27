import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

type CsvUniversity = {
  'Institution Name': string
  City: string
  State: string
  Website: string
  Domain: string
  'Clearbit Logo URL': string
}

async function seedHashtags() {
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

  console.log(`✅ Seeded ${hashtags.length} hashtags`)
}

async function seedUniversities() {
  console.log('📘 Seeding universities...')
  const csvPath = path.join(process.cwd(), 'prisma', 'US_Universities _masters.csv')
  const file = fs.readFileSync(csvPath)
  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvUniversity[]

  let count = 0
  let skipped = 0

  for (const row of records) {
    if (
      !row['Institution Name'] ||
      !row.City ||
      !row.State ||
      !row.Website ||
      !row.Domain ||
      !row['Clearbit Logo URL']
    ) {
      skipped++
      console.warn(`⚠️ Skipping row with missing fields: ${row['Institution Name']}`)
      continue
    }

    try {
      await prisma.university.create({
        data: {
          institution: row['Institution Name'],
          city: row.City,
          state: row.State,
          website: row.Website,
          domain: row.Domain,
          logoUrl: row['Clearbit Logo URL'],
        },
      })
      count++
    } catch (err: any) {
      skipped++
      console.error(`❌ Failed to insert university: ${row['Institution Name']}`, err.message)
    }
  }

  console.log(`✅ Seeded ${count} universities`)
  if (skipped > 0) console.warn(`⚠️ Skipped ${skipped} rows due to missing/invalid data`)
}

async function main() {
  console.log('🚀 Starting seed script...')
  await seedHashtags()
  await seedUniversities()
  console.log('🌱 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })