import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'


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
        <Sidebar currentUser={currentUser} />
        <div className="min-h-screen flex justify-center bg-black">
          <main className="w-full max-w-2xl min-h-screen bg-black ml-16 md:ml-60 transition-all">
            {children}
          </main>
          <RightSidebar />
        </div>
      </body>
    </html>
  )
} 