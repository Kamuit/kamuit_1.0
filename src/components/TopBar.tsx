'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { User } from 'lucide-react'

export default function TopBar() {
  const [currentUser, setCurrentUser] = useState<{ firstName?: string, lastName?: string, name?: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored))
      } catch {}
    }
  }, [])

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-black border-b border-zinc-800 px-4 flex items-center justify-between z-50">
      {/* Logo */}
      <img
        src="/assets/b2.svg"
        alt="kamuit logo"
        className="w-8 h-12"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />

      {/* Profile icon - green only, no background */}
      <Link href="/profile">
        <User className="w-6 h-6 text-emerald-400" />
      </Link>
    </div>
  )
}