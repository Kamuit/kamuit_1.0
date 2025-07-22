import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
const mockRides = [
  {
    id: '1',
    type: 'OFFER',
    from: 'Chicago',
    to: 'Milwaukee',
    date: '2024-01-15',
    timeOfDay: 'MORNING',
    seats: 3,
    seatsAvailable: 2,
    contactInfo: 'john@example.com',
    notes: 'Leaving early morning, flexible on time',
    hashtags: ['PetFriendly', 'SmokeFree'],
    user: { firstName: 'John', lastName: 'Doe' },
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    type: 'REQUEST',
    from: 'Milwaukee',
    to: 'Chicago',
    date: '2024-01-16',
    timeOfDay: 'EVENING',
    seats: 1,
    seatsAvailable: 1,
    contactInfo: 'jane@example.com',
    notes: 'Need a ride back to Chicago',
    hashtags: ['WomenOnly', 'QuietRide'],
    user: { firstName: 'Jane', lastName: 'Smith' },
    createdAt: '2024-01-10T11:00:00Z',
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const type = searchParams.get('type')
  const date = searchParams.get('date')

  let filteredRides = mockRides

  if (from) {
    filteredRides = filteredRides.filter(ride => 
      ride.from.toLowerCase().includes(from.toLowerCase())
    )
  }

  if (to) {
    filteredRides = filteredRides.filter(ride => 
      ride.to.toLowerCase().includes(to.toLowerCase())
    )
  }

  if (type && type !== 'ALL') {
    filteredRides = filteredRides.filter(ride => ride.type === type)
  }

  if (date) {
    filteredRides = filteredRides.filter(ride => ride.date === date)
  }

  return NextResponse.json(filteredRides)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // TODO: Validate with Prisma schema
    // TODO: Save to database
    
    const newRide = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newRide, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create ride post' },
      { status: 500 }
    )
  }
} 