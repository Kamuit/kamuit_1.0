'use client'

import Talk from 'talkjs'
import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

export default function ConversationPage() {
  const chatboxRef = useRef(null)
  const { conversationId } = useParams()
  const searchParams = useSearchParams()

  const userBId = searchParams.get('userB')
  const rideId = searchParams.get('rideId')

  const [talkLoaded, setTalkLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const userData = localStorage.getItem('currentUser')
    if (!userData || !userBId || !rideId) return

    const currentUser = JSON.parse(userData)

    let session: Talk.Session

    Talk.ready.then(() => {
      const me = new Talk.User({
        id: currentUser.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
        ...(currentUser.photoUrl ? { photoUrl: currentUser.photoUrl } : {}),
        welcomeMessage: 'Hey there 👋',
      })

      const otherUser = new Talk.User({
  id: userBId,
  name: `${searchParams.get('firstName') || 'User'} ${searchParams.get('lastName') || ''}`.trim(),
  email: `${userBId}@kamuit.app`, // dummy
  photoUrl: searchParams.get('photoUrl') || undefined,
  welcomeMessage: 'Hi!',
})

      session = new Talk.Session({
        appId: process.env.NEXT_PUBLIC_TALKJS_APP_ID!,
        me,
      })

      const conversationId = Talk.oneOnOneId(me, otherUser)
      const conversation = session.getOrCreateConversation(conversationId)
      conversation.setParticipant(me)
      conversation.setParticipant(otherUser)

      const chatbox = session.createChatbox({ theme: 'default_dark' })
      chatbox.select(conversation)
      chatbox.mount(chatboxRef.current)

      setTalkLoaded(true)
    })

    return () => {
      if (session) session.destroy()
    }
  }, [conversationId, userBId, rideId])

  return (
    <div className="pt-16 px-4 min-h-screen text-white">
      {!talkLoaded ? <p>Loading chat...</p> : null}
      <div ref={chatboxRef} style={{ height: '80vh' }} />
    </div>
  )
}