import React, { useState, useEffect } from 'react'
import { Car, Users, MapPin, Calendar, Clock, User, MessageCircle, Filter, SortAsc, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createHash } from 'crypto'
import RidePostForm from './RidePostForm';


export default function RideFeed({ posts = [], setPosts, handleConnect, showFilters, setShowFilters }) {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    date: '',
    type: 'ALL',
  })
  const [sortBy, setSortBy] = useState('latest')
  const [savedRides, setSavedRides] = useState([])
  const router = useRouter()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, postId: null });
  const [editDialog, setEditDialog] = useState({ open: false, post: null });

  useEffect(() => {
    // Load saved rides from currentUser
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
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'upcoming':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'seats':
        return (b.seatsAvailable || b.seatsNeeded || 0) - (a.seatsAvailable || a.seatsNeeded || 0)
      default:
        return 0
    }
  })

  // Sort so that expired posts are always at the bottom
  const now = new Date();
  const sortedPostsWithExpiry = [...sortedPosts].sort((a, b) => {
    const aIsPast = new Date(a.date) < now;
    const bIsPast = new Date(b.date) < now;
    if (aIsPast === bIsPast) {
      // If both are expired or both are not, keep original order
      return 0;
    }
    // Non-expired first, expired last
    return aIsPast ? 1 : -1;
  });

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

          // Update in localStorage
          const userData = JSON.parse(localStorage.getItem('currentUser') || '{}')
          userData.savedRides = updated
          localStorage.setItem('currentUser', JSON.stringify(userData))
        }
      } catch (err) {
        console.error('Error toggling save:', err)
      }
    }


  const getRoleLabel = (post) => {
    return post.type === 'OFFER' ? 'Offering' : 'Requesting'
  }

  const getRoleIcon = (post) => {
    return post.type === 'OFFER'
      ? <Car className="h-5 w-5 text-emerald-600" />
      : <Users className="h-5 w-5 text-blue-600" />
  }

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
    const hash = createHash('sha256').update(raw).digest('hex').slice(0, 40) // 40-char hex
    return `c_${hash}` // prefix for clarity
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
      messages: [
        {
          sender: currentUser.id,
          content: "Hey, I’m interested in your ride!",
          timestamp: Date.now(),
        },
      ],
      lastMessage: "Hey, I’m interested in your ride!",
      lastTimestamp: Date.now(),
      otherUser,
      ride: post,
    }
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }

  console.log(`/messages/${conversationId}?userA=${currentUser.id}&userB=${otherUser.id}&rideId=${rideId}`)

  // ✅ push full URL with query params
  router.push(
    `/messages/${conversationId}?userA=${currentUser.id}&userB=${otherUser.id}&rideId=${rideId}`
  )
}




  return (
    <>
      {/* Delete Confirmation Modal */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#16181c] rounded-2xl shadow-xl border border-[#222327] w-full max-w-sm p-8 relative flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-white">Delete Post</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                onClick={async () => {
                  const res = await fetch(`/api/ride-posts/${deleteDialog.postId}`, { method: 'DELETE' });
                  if (res.ok) {
                    setPosts((prev) => prev.filter((p) => p.id !== deleteDialog.postId));
                  } else {
                    alert('Failed to delete post.');
                  }
                  setDeleteDialog({ open: false, postId: null });
                }}
              >
                Delete
              </button>
              <button
                className="px-6 py-2 rounded-full bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
                onClick={() => setDeleteDialog({ open: false, postId: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Post Modal */}
      {editDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#16181c] rounded-2xl shadow-xl border border-[#222327] w-full max-w-md p-8 relative">
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
              onComplete={async (data) => {
                // Only send allowed fields with correct types
                const allowed = ['from', 'to', 'date', 'timeOfDay', 'seats', 'contactInfo', 'notes'];
                const updateData = {};
                for (const key of allowed) {
                  if (data[key] !== undefined) updateData[key] = data[key];
                }
                // Ensure seats is a number
                if (typeof updateData.seats === 'string') {
                  updateData.seats = parseInt(updateData.seats, 10);
                }
                const res = await fetch(`/api/ride-posts/${editDialog.post.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updateData),
                });
                if (res.ok) {
                  const updated = await res.json();
                  setPosts((prev) => prev.map((p) => p.id === editDialog.post.id ? { ...p, ...updated.post } : p));
                  setEditDialog({ open: false, post: null });
                } else {
                  alert('Failed to update post.');
                }
              }}
              onBack={() => setEditDialog({ open: false, post: null })}
            />
          </div>
        </div>
      )}
      {/* Filters and Sorting - toggleable */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold mb-4"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          Filters
        </button>
        {showFilters && (
          <div className="flex flex-row gap-2 md:gap-4 w-full max-w-4xl items-center justify-center mb-4">
            {/* ... filter bar fields ... */}
          </div>
        )}
      </div>
      {/* Feed */}
      <div className="flex flex-col gap-6 items-center w-full">
        {sortedPostsWithExpiry.map((post) => {
          const isPast = new Date(post.date) < new Date();
          return (
            <div
              key={post.id}
              className={`w-full max-w-xl bg-[#16181c] rounded-2xl border border-[#222327] shadow p-5 flex flex-col gap-2 ${isPast ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {/* User and Post Type */}
              <div className="flex items-center gap-3 mb-1">
                <div className={`p-2 rounded-full ${post.role === 'driver' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                  {getRoleIcon(post)}
                </div>
                <button
                  className="font-bold text-lg text-white hover:underline focus:outline-none"
                  onClick={() => {
                    const currentUser = getCurrentUser();
                    console.log('Clicked user:', post.user, 'Current user:', currentUser);
                    if (currentUser && post.user.id === currentUser.id) {
                      router.push('/profile');
                    } else {
                      router.push(`/profile?userId=${post.user.id}`);
                    }
                  }}
                  title="View profile"
                  type="button"
                >
                  {post?.user.firstName} {post.user.lastName}
                </button>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#222327] ${post.role === 'driver' ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {getRoleLabel(post)}
                </span>
              </div>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400 mb-1">
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

              {/* Expired Label */}
              {isPast && (
                <span className="text-xs text-red-400 font-bold mb-1">Expired</span>
              )}

              {/* Notes */}
              {post.notes && (
                <p className="text-sm text-gray-300 mb-1 whitespace-pre-line">{post.notes}</p>
              )}

              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  {post.hashtags.map((hashtag) => (
                    <span
                      key={hashtag}
                      className="px-3 py-1 bg-[#222327] text-twitterBlue text-xs font-semibold rounded-full"
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact and Connect */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500 truncate">
                  Contact: {post.contactInfo}
                </span>
                {post.user.id === getCurrentUser()?.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteDialog({ open: true, postId: post.id })}
                      className="px-4 py-1 text-sm rounded-lg bg-red-700 text-white hover:bg-red-800 transition-colors"
                      title="Delete post"
                      type="button"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setEditDialog({ open: true, post })}
                      className="px-4 py-1 text-sm rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                      title="Edit post"
                      type="button"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSaveRide(post.id)}
                      className={`flex items-center space-x-2 px-4 py-1 text-sm rounded-lg transition-colors ${savedRides.includes(post.id) ? 'bg-emerald-900 text-emerald-400' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'}`}
                      title={savedRides.includes(post.id) ? 'Remove from saved rides' : 'Save for later'}
                      type="button"
                    >
                      <Heart className={`h-4 w-4 ${savedRides.includes(post.id) ? 'fill-emerald-400' : 'stroke-2'}`} fill={savedRides.includes(post.id) ? '#34d399' : 'none'} />
                      <span>{savedRides.includes(post.id) ? 'Saved' : 'Interested'}</span>
                    </button>
                    <button
                      onClick={() => handleConnectClick(post)}
                      className="btn-primary flex items-center space-x-2 px-4 py-1 text-sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Connect</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

          {sortedPostsWithExpiry.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-gray-600">No rides found matching your criteria.</p>
              <button
                onClick={() => setFilters({ from: '', to: '', date: '', type: 'ALL' })}
                className="btn-secondary mt-4"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </>
    )
  }