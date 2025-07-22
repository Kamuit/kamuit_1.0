"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RidePostForm from '@/components/RidePostForm'

export default function PassengerPostPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setLoading(false), 300)
    // Load posts from localStorage
    const stored = localStorage.getItem('ridePosts')
    if (stored) setPosts(JSON.parse(stored))
    // Auth check
    const user = localStorage.getItem('currentUser')
    if (!user) router.replace('/login')
  }, [router])

  const handlePostRide = (data) => {
    // Get current user
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    console.log(4)
    console.log('[handlePostRide] submitting ride with type:', data.type); // ✅ LOG HERE
    const newPost = {
      ...data,
      id: Date.now().toString(),
      role: 'passenger',
      type: data.type,
      user: {
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
      },
      createdAt: new Date().toISOString(),
      seatsNeeded: data.seats,
    }
    const updatedPosts = [newPost, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem('ridePosts', JSON.stringify(updatedPosts))
    router.push('/home')
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-2xl p-4 md:p-8 bg-[#16181c] rounded-2xl shadow border border-[#222327]">
        <h1 className="text-2xl font-bold mb-4">Request a Ride</h1>
        <RidePostForm
          initialData={{
            type: 'REQUEST',
            from: '',
            to: '',
            date: '',
            timeOfDay: 'MORNING',
            seats: 1,
            contactInfo: '',
            notes: '',
            hashtags: [],
          }}
          onComplete={handlePostRide}
          onBack={() => router.push('/select-role')}
        />
      </div>
    </div>
  )
} 