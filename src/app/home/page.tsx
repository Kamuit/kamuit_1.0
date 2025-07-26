"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import RideFeed from '@/components/RideFeed'
import RidePostForm from '@/components/RidePostForm'

declare global {
  interface Window { openNewRideModal?: () => void }
}

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState<'find' | 'offer'>('offer')
  const [filters, setFilters] = useState({ from: '', to: '', date: '', type: 'ALL' })
  const [sortBy, setSortBy] = useState('latest')
  const [showWarning, setShowWarning] = useState(false)
  const [savedRides, setSavedRides] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/ride-posts')
        const data = await res.json()
        setPosts(data.posts)
      } catch (err) {
        console.error('Failed to load ride posts', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    const user = localStorage.getItem('currentUser')
    if (!user) router.replace('/login')

    window.openNewRideModal = () => {
      setShowModal(true)
      setModalTab('offer')
    }

    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser')
      if (user) {
        try {
          const parsed = JSON.parse(user)
          setSavedRides(parsed.savedRides || [])
        } catch {}
      }
    }

    return () => {
      window.openNewRideModal = undefined
    }
  }, [router])

  const handlePostRide = async (data: any) => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')

    if (!user?.id) {
      alert('Please login again.')
      router.push('/login')
      return
    }

    try {
      const res = await fetch('/api/driver/addPost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          type: data.type,
          userId: user.id,
        }),
      })

      if (!res.ok) throw new Error('Failed to create ride post')
      setShowModal(false)

      const refreshed = await fetch('/api/ride-posts/')
      const refreshedData = await refreshed.json()
      setPosts(refreshedData.posts)
    } catch (err) {
      console.error('Error posting ride:', err)
      alert('Something went wrong. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    )
  }

return (
<div className="min-h-screen bg-black text-white px-2 sm:px-4 py-6 flex justify-center">

  <div className="w-full max-w-6xl">
    <RideFeed
      posts={posts}
      setPosts={setPosts}
      handleConnect={() => {}}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
    />

{showModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-90 px-4 overflow-y-auto">
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="bg-black text-white w-full max-w-md p-6 relative border border-zinc-800 rounded-xl text-sm sm:text-base">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          onClick={() => setShowModal(false)}
        >
          &times;
        </button>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-zinc-800 rounded-full p-1">
            <button
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${modalTab === 'find' ? 'bg-emerald-500 text-white shadow' : 'text-gray-300 hover:text-white'}`}
              // onClick={() => setModalTab('find')}
              onClick={() => {
                setShowWarning(true) // Show funny modal first
              }}
            >
              Request a Ride
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${modalTab === 'offer' ? 'bg-emerald-500 text-white shadow' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setModalTab('offer')}
            >
              Offer a Ride
            </button>
          </div>
        </div>

        {/* Form */}
        {(modalTab === 'offer' || modalTab === 'find') && (
          <RidePostForm
            key={modalTab}
            initialData={{
              type: modalTab === 'offer' ? 'OFFER' : 'REQUEST',
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
            onBack={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  </div>
)}
{showWarning && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center px-4">
    <div className="bg-zinc-900 border border-zinc-800 text-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center text-sm sm:text-base">
      <h2 className="text-lg font-bold mb-2 text-emerald-400">Whoa there, traveler! 🧳</h2>
      <p className="mb-4">
        Before requesting a ride... maybe check if someone’s already offering one? <br /> You might save yourself a text.
      </p>
      <button
        onClick={() => {
          setShowWarning(false)
          setModalTab('find')
        }}
        className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-md"
      >
        Okay okay, I’ll check!
      </button>
    </div>
  </div>
)}
</div>
    </div>
  )
}