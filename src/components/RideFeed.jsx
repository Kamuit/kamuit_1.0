import React, { useState, useEffect } from 'react'
import {
  Car, Users, MapPin, Calendar, Clock, User, MessageCircle, Heart
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createHash } from 'crypto'

export default function RideFeed({ posts = [], setPosts, handleConnect, showFilters, setShowFilters }) {
  const [filters, setFilters] = useState({ from: '', to: '', date: '', type: 'ALL' })
  const [sortBy, setSortBy] = useState('latest')
  const [savedRides, setSavedRides] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser')
      if (user) {
        try {
          const parsed = JSON.parse(user)
          setSavedRides(parsed.savedRides || [])
        } catch {}
      }
    }
  }, [])

  const filteredPosts = (posts || []).filter(post => {
    if (filters.from && !post.from.toLowerCase().includes(filters.from.toLowerCase())) return false
    if (filters.to && !post.to.toLowerCase().includes(filters.to.toLowerCase())) return false
    if (filters.date && post.date !== filters.date) return false
    if (filters.type !== 'ALL' && post.type !== filters.type) return false
    return true
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'upcoming': return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'seats': return (b.seatsAvailable || b.seatsNeeded || 0) - (a.seatsAvailable || a.seatsNeeded || 0)
      default: return 0
    }
  })

  const getTimeOfDayLabel = (timeOfDay) => {
    switch (timeOfDay) {
      case 'MORNING': return 'Morning'
      case 'NOON': return 'Noon'
      case 'EVENING': return 'Evening'
      case 'FLEXIBLE': return 'Flexible'
      default: return timeOfDay
    }
  }

  const toggleSaveRide = async (rideId) => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!user?.id) {
      alert('Please log in to save rides.')
      router.push('/login')
      return
    }

    try {
      const res = await fetch('/api/saved-rides/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ridePostId: rideId }),
      })

      const data = await res.json()
      if (res.ok) {
        const updated = data.saved
          ? [rideId, ...savedRides]
          : savedRides.filter(id => id !== rideId)
        setSavedRides(updated)

        const userData = JSON.parse(localStorage.getItem('currentUser') || '{}')
        userData.savedRides = updated
        localStorage.setItem('currentUser', JSON.stringify(userData))
      }
    } catch (err) {
      console.error('Error toggling save:', err)
    }
  }

  const getRoleLabel = (post) => post.type === 'OFFER' ? 'Offering' : 'Requesting'

  const getRoleIcon = (post) => (
    post.type === 'OFFER'
      ? <Car className="h-5 w-5 text-emerald-600" />
      : <Users className="h-5 w-5 text-blue-600" />
  )

  const getSeatsText = (post) => {
    const seatCount = post.seatsAvailable || post.seats || 1
    return post.type === 'OFFER'
      ? `${seatCount} seat${seatCount !== 1 ? 's' : ''} available`
      : `${seatCount} seat${seatCount !== 1 ? 's' : ''} needed`
  }

  const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser')
      if (user) return JSON.parse(user)
    }
    return null
  }

  const getConversationId = (userA, userB, rideId) => {
    const ids = [userA.id, userB.id].sort()
    const raw = `${ids[0]}_${ids[1]}_${rideId}`
    const hash = createHash('sha256').update(raw).digest('hex').slice(0, 40)
    return `c_${hash}`
  }

  const handleConnectClick = (post) => {
    const currentUser = getCurrentUser()
    const otherUser = post.user
    const rideId = post.id

    if (!currentUser || !otherUser?.id) {
      console.error('Missing user data:', { currentUser, otherUser })
      return
    }

    if (currentUser.id === otherUser.id) {
      console.warn('Cannot message yourself')
      return
    }

    const conversationId = getConversationId(currentUser, otherUser, rideId)
    const conversations = JSON.parse(localStorage.getItem('conversations') || '{}')

    if (!conversations[conversationId]) {
      conversations[conversationId] = {
        id: conversationId,
        userIds: [currentUser.id, otherUser.id],
        rideId,
        messages: [{
          sender: currentUser.id,
          content: "Hey, I’m interested in your ride!",
          timestamp: Date.now(),
        }],
        lastMessage: "Hey, I’m interested in your ride!",
        lastTimestamp: Date.now(),
        otherUser,
        ride: post,
      }
      localStorage.setItem('conversations', JSON.stringify(conversations))
    }

    router.push(
      `/messages/${conversationId}?userA=${currentUser.id}&userB=${otherUser.id}&rideId=${rideId}`
    )
  }

  return (
  <div className="bg-black min-h-screen w-full overflow-x-hidden px-4 sm:px-6 md:px-8 py-6">
      {/* Filter Toggle */}
   <div className="mb-8 mt-2 text-left w-full">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 my-4 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold"
        >
          <svg className="px-1 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          Filters
        </button>
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4 items-center justify-center">
            {/* your filter UI here if needed */}
          </div>
        )}
      </div>

      {/* Feed */}
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto gap-6 px-4 sm:px-6 md:px-8">
    {sortedPosts.map((post) => (
    <div
      key={post.id}
      className="w-full max-w-7xl text-white px-2 sm:px-4"
    >
      {/* User and Post Type */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-1">
          {getRoleIcon(post)}
        </div>
        <span className="font-semibold text-base sm:text-lg">
          {post.user.firstName} {post.user.lastName}
        </span>
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${post.role === 'driver' ? 'text-emerald-400' : 'text-blue-400'}`}>
          {getRoleLabel(post)}
        </span>
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-2">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{getTimeOfDayLabel(post.timeOfDay)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{post.from} → {post.to}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{getSeatsText(post)}</span>
        </div>
      </div>

      {/* Notes */}
      {post.notes && (
        <p className="text-sm text-gray-300 mb-2 whitespace-pre-line">{post.notes}</p>
      )}

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {post.hashtags.map((hashtag) => (
            <span
              key={hashtag}
              className="px-3 py-1 bg-[#111] text-twitterBlue text-xs font-semibold rounded-full"
            >
              #{hashtag}
            </span>
          ))}
        </div>
      )}

      {/* Contact + Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2">
        <span className="text-xs text-gray-500 truncate">
          Contact: {post.contactInfo}
        </span>
        {post.user.id !== getCurrentUser()?.id && (
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => toggleSaveRide(post.id)}
              className={`flex items-center justify-center w-full sm:w-auto space-x-2 px-4 py-1 text-sm rounded-md transition-colors ${savedRides.includes(post.id) ? 'bg-emerald-900 text-emerald-400' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'}`}
            >
              <Heart className={`h-4 w-4 ${savedRides.includes(post.id) ? 'fill-emerald-400' : 'stroke-2'}`} fill={savedRides.includes(post.id) ? '#34d399' : 'none'} />
              <span>{savedRides.includes(post.id) ? 'Saved' : 'Interested'}</span>
            </button>
            <button
              onClick={() => handleConnectClick(post)}
              className="bg-blue-700 text-white hover:bg-blue-600 flex items-center space-x-2 px-4 py-1 text-sm rounded-md w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Connect</span>
            </button>
          </div>
        )}
      </div>

<div className="w-[100vw] border-t border-zinc-800 my-6 ml-[-50vw] left-1/2 relative" />    </div>
  ))}

  {sortedPosts.length === 0 && (
    <div className="text-center py-12 text-gray-400">
      <p>No rides found matching your criteria.</p>
      <button
        onClick={() => setFilters({ from: '', to: '', date: '', type: 'ALL' })}
        className="mt-4 px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600"
      >
        Clear Filters
      </button>
    </div>
  )}
</div>
    </div>
  )
}