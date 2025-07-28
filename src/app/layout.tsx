import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import BottomNav from '@/components/BottomNav'
import TopBar from '@/components/TopBar'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kamuit 1.0 - Ride Sharing Community',
  description: 'Connect with fellow travelers and share rides in your community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = { name: 'Jane Doe' }

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/b2.svg" />
      </head>
      <body className={inter.className + " bg-black text-white"}>
        <TopBar />
        <Sidebar currentUser={currentUser} />
        <BottomNav />
        <div className="min-h-screen flex justify-center bg-black">
          <main className="min-h-screen w-full max-w-6xl px-4 sm:px-6 md:px-8 transition-all ml-0 lg:ml-60 lg:mr-[20rem]">
            {children}
          </main>
          <RightSidebar />
        </div>
      </body>
    </html>
  )
}