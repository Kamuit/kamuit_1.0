'use client'

import Talk from 'talkjs'
import { useEffect, useRef, useState } from 'react'

export default function MessagesPage() {
  const inboxRef = useRef(null)
  const [talkLoaded, setTalkLoaded] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (!userData) return

    const currentUser = JSON.parse(userData)

    Talk.ready.then(() => {
      const me = new Talk.User({
        id: currentUser.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
        ...(currentUser.photoUrl ? { photoUrl: currentUser.photoUrl } : {}), // ✅ only adds it if it's valid
        welcomeMessage: 'Hey there!',
      })

      const session = new Talk.Session({
        appId: process.env.NEXT_PUBLIC_TALKJS_APP_ID!,
        me,
      })

      const inbox = session.createInbox({ theme: 'default_dark' })
      inbox.mount(inboxRef.current)

      setTalkLoaded(true)
    })
  }, [])

  return (
    <div className="pt-16 px-4 text-white">
      {!talkLoaded ? <p>Loading inbox...</p> : null}
      <div ref={inboxRef} style={{ height: '80vh' }} />
    </div>
  )
}

