'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import BottomNav from '@/components/BottomNav'
import TopBar from '@/components/TopBar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password'

  const currentUser = { name: 'Jane Doe' }

  return (
    <>
      {!isAuthPage && <TopBar />}
      {!isAuthPage && <Sidebar currentUser={currentUser} />}
      {!isAuthPage && <BottomNav />}
      <div className="min-h-screen flex justify-center bg-black">
        <main className={`min-h-screen w-full ${!isAuthPage ? 'max-w-6xl px-4 sm:px-6 md:px-8 ml-0 lg:ml-60 lg:mr-[20rem]' : 'px-4'}`}>
          {children}
        </main>
        {!isAuthPage && <RightSidebar />}
      </div>
    </>
  )
}