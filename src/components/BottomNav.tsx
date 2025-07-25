"use client"

import { usePathname, useRouter } from 'next/navigation'
import { Home, PlusCircle, MessageCircle, User, Heart, Info, LifeBuoy, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const links = [
  { href: '/home', icon: Home, label: 'Home', aria: 'Home' },
  { href: '/saved', icon: Heart, label: 'Saved', aria: 'Saved' },
  { href: '/messages', icon: MessageCircle, label: 'Messages', aria: 'Messages' },
  { href: '/about', icon: Info, label: 'About Kamuit', aria: 'About Kamuit' },
  { href: '/contact', icon: LifeBuoy, label: 'Contact / Help', aria: 'Contact / Help' },
  // { href: '/profile', icon: User, label: 'Profile', aria: 'Profile' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<{ name?: string, firstName?: string, lastName?: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentUser')
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored))
        } catch {}
      }
    }
  }, [])

  return (
    <>
      {/* Desktop Sidebar */}
      {/* <aside className="hidden md:flex fixed left-0 top-0 h-screen bg-gray-950 flex-col items-center px-2 py-6 w-20 md:w-72 ml-2 md:ml-8 transition-all z-40 border-r border-[#222327]">
        <div className="mb-8 flex items-center justify-center w-full">
          <div className="rounded-full bg-emerald-500 w-12 h-12 flex items-center justify-center text-2xl font-extrabold text-white">K</div>
        </div>
        <nav className="flex flex-col gap-2 flex-1 w-full items-center justify-center">
          {links.map(({ href, icon: Icon, label, aria }) => (
            <Link
              key={label}
              href={href}
              aria-label={aria}
              className={`flex items-center gap-5 rounded-full px-4 py-3 text-white hover:text-emerald-400 hover:bg-gray-800/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-16 md:w-60 mx-auto ${pathname === href ? 'bg-gray-800/70 text-emerald-400 font-bold' : ''}`}
            >
              <Icon className="h-8 w-8 flex-shrink-0" />
              <span className="hidden md:inline text-lg font-semibold tracking-wide">
                {label === 'Profile' && currentUser ? (currentUser.firstName || currentUser.name) + (currentUser.lastName ? ` ${currentUser.lastName}` : '') : label}
              </span>
            </Link>
          ))}
        </nav>
      </aside> */}

      {/* Mobile Bottom Nav */}
      <nav className="fixed lg:hidden bottom-0 left-0 right-0 bg-gray-950 border-t border-[#222327] flex justify-around items-center py-2 z-50">
        {links.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className={`flex flex-col items-center text-xs ${pathname === href ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}>
            <Icon className="w-6 h-6 mb-1" />
            {label === 'Profile' && currentUser ? (currentUser.firstName || currentUser.name) : label.replace('Kamuit', '')}
          </Link>
        ))}
      </nav>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            const win = window as any;
            if (window.location.pathname !== '/home') {
              router.push('/home');
              setTimeout(() => {
                if (win.openNewRideModal) win.openNewRideModal();
              }, 300);
            } else {
              if (win.openNewRideModal) win.openNewRideModal();
            }
          }
        }}
        className="fixed bottom-16 right-5 z-50 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg text-white p-4 md:hidden"
      >
        <PlusCircle className="w-7 h-7" />
      </button>
    </>
  )
}
