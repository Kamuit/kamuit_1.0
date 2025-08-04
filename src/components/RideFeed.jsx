'use client'
import React, { useState, useEffect } from 'react'
import {
  Car, Users, MapPin, Calendar, Clock, User, MessageCircle, Heart
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createHash } from 'crypto'
import RidePostForm from './RidePostForm'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'

export default function RideFeed({ posts = [], setPosts, handleConnect, showFilters, setShowFilters }) {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    date: '',
    type: 'ALL',
    timeOfDay: '',
    hashtags: [],
  })
  const [sortBy, setSortBy] = useState('latest')
  const [savedRides, setSavedRides] = useState([])
  const router = useRouter()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, postId: null });
  const [editDialog, setEditDialog] = useState({ open: false, post: null });
  const [funnyModal, setFunnyModal] = useState(false);

  const isOldPost = (postDate) => new Date(postDate) < new Date()


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
  if (filters.from && !post.from?.toLowerCase().includes(filters.from.toLowerCase())) return false
  if (filters.to && !post.to?.toLowerCase().includes(filters.to.toLowerCase())) return false
  if (
    filters.date &&
    new Date(post.date).toISOString().split('T')[0] !==
    new Date(filters.date).toISOString().split('T')[0]
  ) return false
  if (filters.type !== 'ALL' && post.type !== filters.type) return false
  if (filters.timeOfDay && post.timeOfDay !== filters.timeOfDay) return false
  if (filters.hashtags.length > 0) {
    const postTags = Array.isArray(post.hashtags) ? post.hashtags : []
    if (!filters.hashtags.every(tag => postTags.includes(tag))) return false
  }
  return true
})

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'upcoming': return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'seats': return (b.seats || b.seatsNeeded || 0) - (a.seats || a.seatsNeeded || 0)
      default: return 0
    }
  })

  const now = new Date()
  const sortedPostsWithExpiry = [...sortedPosts].sort((a, b) => {
    const aIsPast = new Date(a.date) < now
    const bIsPast = new Date(b.date) < now
    return aIsPast === bIsPast ? 0 : aIsPast ? 1 : -1
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
    console.log('Current user:', user)
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

  const getSeatsText = (post) => {
    const seatCount = post.seats || 1
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

  if (!currentUser || !otherUser?.id) return
  if (currentUser.id === otherUser.id) return

  const conversationId = `c_${[currentUser.id, otherUser.id].sort().join('_')}`

  router.push(
    `/messages/${conversationId}?userA=${currentUser.id}&userB=${otherUser.id}&rideId=${rideId}` +
    `&firstName=${encodeURIComponent(otherUser.firstName)}` +
    `&lastName=${encodeURIComponent(otherUser.lastName || '')}` +
    (otherUser.photoUrl ? `&photoUrl=${encodeURIComponent(otherUser.photoUrl)}` : '')
  )
}

  return (
    <>
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#16181c] rounded-2xl shadow-xl border border-[#222327] w-full max-w-sm p-8 relative flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-white">Delete Post</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={async () => {
                const res = await fetch(`/api/ride-posts/${deleteDialog.postId}`, { method: 'DELETE' });
                if (res.ok) setPosts(prev => prev.filter(p => p.id !== deleteDialog.postId));
                else alert('Failed to delete post.')
                setDeleteDialog({ open: false, postId: null });
              }}>Delete</button>
              <button className="px-6 py-2 rounded-full bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition" onClick={() => setDeleteDialog({ open: false, postId: null })}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 overflow-y-auto">
          <div className="bg-[#16181c] rounded-2xl shadow-xl border border-[#222327] w-full max-w-md p-8 relative my-10">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setEditDialog({ open: false, post: null })}>&times;</button>
            <RidePostForm
              initialData={{
                type: editDialog.post.type,
                from: editDialog.post.from,
                to: editDialog.post.to,
                date: editDialog.post.date.split('T')[0],
                timeOfDay: editDialog.post.timeOfDay,
                seats: editDialog.post.seats,
                contactInfo: editDialog.post.contactInfo,
                notes: editDialog.post.notes || '',
                hashtags: editDialog.post.hashtags || [],
              }}
              readOnlyFields={['from', 'to', 'date', 'timeOfDay', 'notes', 'hashtags', 'type']}
              onFieldClick={(field) => {
                if (['from', 'to', 'date', 'timeOfDay', 'notes', 'hashtags', 'type'].includes(field)) {
                  setFunnyModal(true)
                }
              }}
              onComplete={async (data) => {
                const allowed = ['seats', 'contactInfo']
                const updateData = {}
                for (const key of allowed) if (data[key] !== undefined) updateData[key] = data[key]
                if (typeof updateData.seats === 'string') updateData.seats = parseInt(updateData.seats, 10)
                const res = await fetch(`/api/ride-posts/${editDialog.post.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updateData),
                })
                if (res.ok) {
                  const updated = await res.json()
                  setPosts(prev => prev.map(p => p.id === editDialog.post.id ? { ...p, ...updated.post } : p))
                  setEditDialog({ open: false, post: null })
                } else alert('Failed to update post.')
              }}
              onBack={() => setEditDialog({ open: false, post: null })}
            />
          </div>
        </div>
      )}

      <div className="mb-6">
<div className="bg-black min-h-screen w-full max-w-2xl mx-auto overflow-x-hidden px-4 sm:px-6 md:px-8 py-6">
            <div className="mb-8 mt-2 text-left w-full">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 my-4 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold">
              <svg className="px-1 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
              Filters
            </button>
          </div>

          {showFilters && (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 w-full">
    {/* FROM / TO */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm text-white mb-1">From</label>
        <input
          type="text"
          value={filters.from}
          onChange={e => setFilters({ ...filters, from: e.target.value })}
          className="input-field w-full"
          placeholder="Origin city"
        />
      </div>
      <div>
        <label className="block text-sm text-white mb-1">To</label>
        <input
          type="text"
          value={filters.to}
          onChange={e => setFilters({ ...filters, to: e.target.value })}
          className="input-field w-full"
          placeholder="Destination city"
        />
      </div>
    </div>

    {/* DATE / TIME */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div className="relative">
        <label className="block text-sm text-white mb-1">Date</label>
        <input
          type="date"
          value={filters.date}
          onChange={e => setFilters({ ...filters, date: e.target.value })}
          className="input-field w-full pr-10 text-left appearance-none [&::-webkit-datetime-edit]:text-left"
        />
        <CalendarDaysIcon className="w-5 h-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>
      <div>
        <label className="block text-sm text-white mb-1">Time of Day</label>
        <select
          value={filters.timeOfDay || ''}
          onChange={e => setFilters({ ...filters, timeOfDay: e.target.value })}
          className="input-field w-full"
        >
          <option value="">Any</option>
          <option value="MORNING">Morning</option>
          <option value="NOON">Noon</option>
          <option value="EVENING">Evening</option>
          <option value="FLEXIBLE">Flexible</option>
        </select>
      </div>
    </div>

<div className="flex justify-end mt-4">
  <button
    onClick={() =>
      setFilters({
        from: '',
        to: '',
        date: '',
        type: 'ALL',
        timeOfDay: '',
        hashtags: [],
      })
    }
    className="px-4 py-1 text-sm rounded-full bg-emerald-700 text-white hover:bg-emerald-800 transition font-semibold"
  >
    Clear All Filters
  </button>
</div>
  </div>
  
)}

          <div className="flex flex-col gap-8 items-start w-full">
            {sortedPostsWithExpiry.map((post) => (
              <div key={post.id} className={`w-full ${isOldPost(post.date) ? 'opacity-50 grayscale pointer-events-none select-none' : ''}`}>
<div className="mb-2 flex items-center justify-between">
  <div>
<button
  onClick={() => router.push(`/profile/${post.user.id}`)}
  className="text-white font-semibold text-lg sm:text-xl hover:underline"
>
  {post.user.firstName} {post.user.lastName}
</button>
  </div>
  <div>
    {post.type === 'OFFER' ? (
      <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-semibold">
        🛻 Offer
      </span>
    ) : (
      <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-yellow-400 text-xs font-semibold">
        🙋‍♂️ Request
      </span>
    )}
  </div>
</div>
                {isOldPost(post.date) && (
                  <span className="inline-block bg-red-900 text-red-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                    Expired Ride
                  </span>
                )}
                <div className="text-xs text-gray-400 mb-2 flex flex-wrap gap-4">
                  <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>{new Date(post.date).toLocaleDateString()}</span></div>
                  <div className="flex items-center gap-1"><Clock className="h-4 w-4" /><span>{getTimeOfDayLabel(post.timeOfDay)}</span></div>
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /><span>{post.from} → {post.to}</span></div>
                  <div className="flex items-center gap-1"><User className="h-4 w-4" /><span>{getSeatsText(post)}</span></div>
                </div>

                {post.notes && <p className="text-sm text-gray-300 mb-2 whitespace-pre-line">{post.notes}</p>}
                {post.hashtags?.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-2">
    {post.hashtags.map((hashtag) => (
      <span
        key={hashtag}
        className="px-3 py-1 bg-[#111] text-twitterBlue text-xs font-semibold rounded-full"
      >
        #{hashtag?.replace('hashtag-', '')}
      </span>
    ))}
  </div>
)}

<div className="flex justify-between items-center flex-wrap mt-2 gap-2">
  <div className="text-xs text-emerald-400 font-normal break-words max-w-full">
  📧 {post.user.email}
</div>
  {/* Left: Interested count or empty for spacing */}
  <div className="text-xs text-emerald-400 min-w-[120px]">
    {typeof post.saveCount === 'number' && post.saveCount > 1
      ? `${post.saveCount - 1}+ interested`
      : ''}
  </div>

  {/* Right: Action buttons */}
  <div className="flex gap-2 w-full sm:w-auto justify-end">
    {post.user.id === getCurrentUser()?.id ? (
      <>
<button
  onClick={() => setDeleteDialog({ open: true, postId: post.id })}
  className="min-w-[110px] px-4 py-1 text-sm rounded-md bg-red-700 text-white hover:bg-red-800 flex items-center justify-center"
>
  Delete
</button>
<button
  onClick={() => setEditDialog({ open: true, post })}
  className="min-w-[110px] px-4 py-1 text-sm rounded-md bg-blue-700 text-white hover:bg-blue-800 flex items-center justify-center"
>
  Edit
</button>
      </>
    ) : (
      <>
        <button
  onClick={() => toggleSaveRide(post.id)}
  className={`min-w-[110px] flex items-center justify-center space-x-2 px-4 py-1 text-sm rounded-md transition-colors ${
    savedRides.includes(post.id)
      ? 'bg-emerald-900 text-emerald-400'
      : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
  }`}
>
  <Heart
    className={`h-4 w-4 ${
      savedRides.includes(post.id) ? 'fill-emerald-400' : 'stroke-2'
    }`}
    fill={savedRides.includes(post.id) ? '#34d399' : 'none'}
  />
  <span>{savedRides.includes(post.id) ? 'Saved' : 'Interested'}</span>
</button>
        <button
  onClick={() => handleConnectClick(post)}
  className="min-w-[110px] bg-blue-700 text-white hover:bg-blue-600 flex items-center justify-center space-x-2 px-4 py-1 text-sm rounded-md"
>
  <MessageCircle className="h-4 w-4" />
  <span>Connect</span>
</button>
      </>
    )}
  </div>
</div>
                <hr className="border-zinc-800 my-6" />
              </div>
            ))}

            {sortedPostsWithExpiry.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No rides found matching your criteria.</p>
                {/* <button onClick={() => setFilters({ from: '', to: '', date: '', type: 'ALL' })} className="mt-4 px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600">Clear Filters</button> */}
              </div>
            )}
          </div>

          {funnyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
              <div className="bg-[#16181c] rounded-2xl shadow-xl border border-[#222327] max-w-sm w-full p-6 text-center">
                <h2 className="text-xl font-bold text-white mb-2">Whoa there! 🛑</h2>
                <p className="text-gray-300 mb-4">This field can`t be edited. If you really want to change it, just create a new ride post. Don`t be lazy 😛</p>
                <button
                  onClick={() => setFunnyModal(false)}
                  className="mt-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}