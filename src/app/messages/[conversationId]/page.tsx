'use client'

import { useSearchParams, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Window,
  ChannelHeader,
  Thread,
} from 'stream-chat-react'
import { StreamChat } from 'stream-chat'
import 'stream-chat-react/dist/css/v2/index.css'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!

export default function ConversationPage() {
  const { conversationId } = useParams()
  const searchParams = useSearchParams() // ✅ move outside useEffect

  const userA = searchParams.get('userA')
  const userB = searchParams.get('userB')
  const rideId = searchParams.get('rideId')

  const [chatClient, setChatClient] = useState<StreamChat | null>(null)
  const [channel, setChannel] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      console.log('[Init] Starting Stream Chat setup...')

      const userData = localStorage.getItem('currentUser')
      if (!userData) {
        console.warn('[Init] No currentUser found in localStorage')
        return
      }

      const parsed = JSON.parse(userData)
      setCurrentUser(parsed)
      console.log('[Init] Current user:', parsed)

      if (!conversationId) {
        console.error('[Init] No conversationId found in URL params')
        return
      }
      console.log('[Init] conversationId:', conversationId)

      if (!userA || !userB || !rideId) {
        console.error('[Init] Missing userA, userB or rideId in URL params')
        return
      }
      console.log('[Init] Parsed conversationId:', { userA, userB, rideId })

      const tokenRes = await fetch(`/api/stream/token?userId=${parsed.id}`)
      const { token } = await tokenRes.json()
      console.log('[Init] Received token:', token)

      const client = StreamChat.getInstance(apiKey)
      console.log('[Init] Created Stream client')

      await client.connectUser(
        {
          id: parsed.id,
          name: `${parsed.firstName} ${parsed.lastName}`,
        },
        token
      )
      console.log('[Init] Connected user to Stream:', parsed.id)
      console.log('Creating channel with members:', [userA, userB])
      console.log('Ride ID:', rideId)

      const uniqueMembers = [...new Set([userA, userB])]
      if (uniqueMembers.length < 2) {
        console.warn('[Init] Cannot create conversation with only one unique user.')
        return
      }

      const channel = client.channel('messaging', {
        members: [userA, userB],
        rideId,
        distinct: true, // 🔑 tells Stream to auto-create a unique channel for these 2
      })


      await channel.watch()
      console.log('[Init] Watched channel:', channel.id)
      console.log('[Init] Current messages:', channel.state.messages)

      setChatClient(client)
      setChannel(channel)
    }

    init().catch((err) => {
      console.error('[Init] Failed to initialize chat:', err)
    })

    return () => {
      if (chatClient) {
        console.log('[Cleanup] Disconnecting user...')
        chatClient.disconnectUser()
      }
    }
  }, [conversationId, userA, userB, rideId])

  if (!channel || !chatClient || !currentUser) {
    return <div className="text-white p-4">Loading chat...</div>
  }

  return (
    <div className="h-screen bg-black text-white">
      <Chat client={chatClient} theme="messaging light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}
