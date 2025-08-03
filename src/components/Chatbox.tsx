// components/Chatbox.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import Talk from 'talkjs'

export default function Chatbox({ currentUser, otherUser }: { currentUser: any, otherUser: any }) {
  const chatboxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Talk.ready.then(() => {
      const me = new Talk.User({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        photoUrl: currentUser.avatarUrl,
        role: 'default',
      })

      const other = new Talk.User({
        id: otherUser.id,
        name: otherUser.name,
        email: otherUser.email,
        photoUrl: otherUser.avatarUrl,
        role: 'default',
      })

      const session = new Talk.Session({
        appId: 'YOUR_TALKJS_APP_ID', // replace this
        me: me,
      })

      const conversation = session.getOrCreateConversation(
        Talk.oneOnOneId(me, other)
      )
      conversation.setParticipant(me)
      conversation.setParticipant(other)

      const inbox = session.createInbox({ selected: conversation })
      inbox.mount(chatboxRef.current!)
    })
  }, [currentUser, otherUser])

  return <div className="h-[500px]" ref={chatboxRef} />
}