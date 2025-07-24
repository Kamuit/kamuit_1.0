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
      <body className={inter.className + " bg-black text-white"}>
        <TopBar />
        <Sidebar currentUser={currentUser}  />
        <BottomNav />
        <div className="min-h-screen flex justify-center bg-black">
        <main className="w-full max-w-6xl min-h-screen bg-black ml-0 md:ml-60 transition-all px-4 sm:px-6 md:px-8 mx-auto">
              {children}
          </main>
          <RightSidebar />
        </div>
      </body>
    </html>
  )
} 