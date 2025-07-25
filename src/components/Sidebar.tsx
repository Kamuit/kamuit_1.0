"use client"
import { usePathname, useRouter } from 'next/navigation'
import { Home, PlusCircle, MessageCircle, User, Heart, Info, LifeBuoy, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const links = [
  { href: '/home', icon: Home, label: 'Home', aria: 'Home' },
  { href: '/saved', icon: Heart, label: 'Saved', aria: 'Saved' },
  { href: '/messages', icon: MessageCircle, label: 'Messages', aria: 'Messages' },
  // New section
  { href: '/about', icon: Info, label: 'About Kamuit', aria: 'About Kamuit' },
  { href: '/contact', icon: LifeBuoy, label: 'Contact / Help', aria: 'Contact / Help' },
  // { href: '/activity', icon: ClipboardList, label: 'My Activity', aria: 'My Activity' },
  { href: '/profile', icon: User, label: 'Profile', aria: 'Profile' },
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
<aside className="hidden lg:flex fixed left-0 top-0 h-screen bg-gray-950 flex-col items-center px-2 py-6 w-20 md:w-72 ml-2 md:ml-8 transition-all z-40 border-r border-[#222327]">
      {/* Logo placeholder */}
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
            <span className="hidden md:inline text-lg font-semibold tracking-wide">{label === 'Profile' && currentUser ? (currentUser.firstName || currentUser.name) + (currentUser.lastName ? ` ${currentUser.lastName}` : '') : label}</span>
          </Link>
        ))}
      </nav>
      {/* New Ride Button */}
      <div className="w-full flex flex-col items-center mb-4">
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
          className="w-16 md:w-60 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg text-white font-bold py-4 px-0 text-lg transition-all duration-150 mb-2"
          style={{ boxShadow: '0 2px 12px 0 rgba(16,185,129,0.15)' }}
        >
          <span className="hidden md:inline">New Ride</span>
          <PlusCircle className="md:hidden w-7 h-7 mx-auto" />
        </button>
      </div>
      {/* <button
        className="w-16 md:w-60 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full py-3 text-base font-semibold transition mb-2"
        onClick={() => {
          localStorage.removeItem('currentUser');
          window.dispatchEvent(new Event('storage'));
          router.replace('/login');
        }}
      >
        <span className="hidden md:inline">Log Out</span>
        <User className="md:hidden w-7 h-7 mx-auto" />
      </button> */}
    </aside>
  )
} 