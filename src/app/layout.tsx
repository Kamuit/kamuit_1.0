// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './ClientLayout'

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
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/b2.svg" />
      </head>
      <body className={inter.className + ' bg-black text-white'}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}