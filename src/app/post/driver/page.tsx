"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RidePostForm from '@/components/RidePostForm'

export default function DriverPostPage() {
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

  const handlePostRide = async (data) => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}')

  console.log(3)
    console.log('[handlePostRide] submitting ride with type:', data.type); // ✅ LOG HERE
  if (!user?.id) {
    alert('User not logged in. Please login again.')
    router.push('/login')
    return
  }

  try {
    const response = await fetch('/api/driver/addPost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        type: data.type,
        userId: user.id,  // required in backend
      }),
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.error || 'Failed to post ride.')

    router.push('/home')
  } catch (err) {
    console.error('Failed to post ride:', err)
    alert(err.message || 'Something went wrong while posting your ride.')
  }
}

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-2xl p-4 md:p-8 bg-[#16181c] rounded-2xl shadow border border-[#222327]">
        <h1 className="text-2xl font-bold mb-4">Offer a Ride</h1>
        <RidePostForm
          initialData={{
            type: 'OFFER',
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