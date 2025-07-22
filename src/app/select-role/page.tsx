"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Car, User } from 'lucide-react'

export default function SelectRolePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-[#16181c] p-8 rounded-2xl shadow border border-[#222327] w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">What would you like to do?</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/post/driver')}
            className="w-full p-6 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors flex items-center justify-center gap-3"
          >
            <Car className="h-8 w-8" />
            <span className="text-lg font-semibold">Offer a Ride</span>
          </button>
          
          <button
            onClick={() => router.push('/post/passenger')}
            className="w-full p-6 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors flex items-center justify-center gap-3"
          >
            <User className="h-8 w-8" />
            <span className="text-lg font-semibold">Request a Ride</span>
          </button>
        </div>
      </div>
    </div>
  )
} 