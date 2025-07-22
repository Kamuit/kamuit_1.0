import { StreamChat } from 'stream-chat'
import { NextRequest, NextResponse } from 'next/server'

const apiKey = process.env.STREAM_API_KEY!
const apiSecret = process.env.STREAM_API_SECRET!

const serverClient = StreamChat.getInstance(apiKey, apiSecret)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const token = serverClient.createToken(userId)
  return NextResponse.json({ token })
}
