"use client"
import React, { useEffect, useState } from 'react'
import RideFeed from '@/components/RideFeed'

export default function SavedRidesPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) return

    try {
      const parsed = JSON.parse(user)
      const userId = parsed.id

      fetch(`/api/saved-rides?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          setPosts(data.posts || [])
          setLoading(false)
        })
        .catch(err => {
          console.error('Failed to load saved rides:', err)
          setLoading(false)
        })
    } catch (err) {
      console.error('Invalid currentUser in localStorage')
      setLoading(false)
    }
  }, [])

  if (loading) return <div className="text-white">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-4xl p-4 md:p-8 bg-[#16181c] rounded-2xl shadow border border-[#222327]">
        <h1 className="text-2xl font-bold mb-4">Saved Rides</h1>
        <RideFeed
          posts={posts}
          setPosts={setPosts}
          handleConnect={() => {}}
          showFilters={false}
          setShowFilters={() => {}}
        />
      </div>
    </div>
  )
}
