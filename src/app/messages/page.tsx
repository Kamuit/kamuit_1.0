'use client'
import React, { useEffect, useState } from 'react'
import { StreamChat } from 'stream-chat'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!

export default function MessagesPage() {
  const router = useRouter()
  const [channels, setChannels] = useState<any[]>([])
  const [client, setClient] = useState<StreamChat | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const userData = localStorage.getItem('currentUser')
      if (!userData) return

      const parsed = JSON.parse(userData)
      setCurrentUser(parsed)

      const tokenRes = await fetch(`/api/stream/token?userId=${parsed.id}`)
      const { token } = await tokenRes.json()

      const chatClient = StreamChat.getInstance(apiKey)
      await chatClient.connectUser(
        {
          id: parsed.id,
          name: `${parsed.firstName} ${parsed.lastName}`,
        },
        token
      )

      const userChannels = await chatClient.queryChannels({ members: { $in: [parsed.id] } }, { last_message_at: -1 })
      setChannels(userChannels)
      setClient(chatClient)
    }

    init()

    return () => {
      if (client) client.disconnectUser()
    }
  }, [])

  if (!currentUser) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-2xl p-4 md:p-8 bg-[#16181c] rounded-2xl shadow border border-[#222327]">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        {channels.length === 0 ? (
          <div className="text-gray-400 text-center py-12">No conversations yet. Connect with a ride to start chatting!</div>
        ) : (
          <ul className="divide-y divide-[#222327]">
            {channels.map((ch) => {
              const lastMsg = ch.state.messages[ch.state.messages.length - 1]
              const otherMember = Object.values(ch.state.members).find((m: any) => m.user.id !== currentUser.id)

              return (
                <li key={ch.id}>
                  <Link
                      href={`/messages/${ch.id}?userA=${currentUser.id}&userB=${otherMember.user.id}&rideId=${ch.data.rideId}`}
                    className="flex items-center gap-4 py-4 hover:bg-zinc-900 rounded-lg px-2 transition"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg">
                        {console.log(otherMember)}
                        {otherMember?.user?.name || 'Unknown User'}
                      </div>
                      <div className="text-gray-400 text-sm truncate max-w-xs">
                        {lastMsg?.text || 'No messages yet'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 min-w-[90px] text-right">
                      {lastMsg?.created_at
                        ? new Date(lastMsg.created_at).toLocaleString()
                        : ''}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
