"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation';
import { Car, Users, MapPin, Calendar, Clock, User } from 'lucide-react';
import RidePostForm from './RidePostForm';

type UserProfile = {
  id?: string;
  name?: string;
  firstName?: string;
  gender?: 'male' | 'female' | 'neutral';
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string; // Added joinDate to the type
  savedRides?: string[]; // Add this line to fix the linter error
};

export default function ProfilePage() {
  // All hooks at the top!
  const [loading, setLoading] = useState(true)
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false)
  const [bioValue, setBioValue] = useState("")
  const [locationValue, setLocationValue] = useState("")
  const [websiteValue, setWebsiteValue] = useState("")
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [otherUserPosts, setOtherUserPosts] = useState<any[]>([]);
  const router = useRouter()
const [editDialog, setEditDialog] = useState({ open: false, post: null })
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [userPostsLoading, setUserPostsLoading] = useState(true);

 useEffect(() => {
  if (typeof window === 'undefined') return;

  setLoading(true); // Start loading before fetch

  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    router.replace('/login');
    return;
  }

  const parsedCurrentUser = JSON.parse(currentUser);
  setLoggedInUser(parsedCurrentUser);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${userId || parsedCurrentUser.id}`);
      const data = await res.json();
      setProfileUser(data);

      // Save to localStorage only if it's current user
      if (!userId || userId === parsedCurrentUser.id) {
        setLoggedInUser(data);
        localStorage.setItem('currentUser', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setProfileUser(parsedCurrentUser); // fallback
    } finally {
      setLoading(false); // ✅ Done loading
    }
  };

  fetchUser();
}, [router, userId]);

useEffect(() => {
  if (profileUser) {
    setUserPostsLoading(true);
    fetch('/api/ride-posts')
      .then(res => res.json())
      .then(data => {
        const theirPosts = data.posts.filter((post: any) => post.user.id === profileUser.id);
        setUserPosts(theirPosts);
      })
      .catch(err => console.error('Failed to fetch user posts:', err))
      .finally(() => setUserPostsLoading(false));
  }
}, [profileUser, loggedInUser]);

  useEffect(() => {
    // Fetch rides for the profile user
    if (profileUser) {
      fetch('/api/ride-posts')
        .then(res => res.json())
        .then(data => {
          const theirPosts = data.posts.filter((post: any) => post.user.id === profileUser.id);
          setUserPosts(theirPosts);
        })
        .catch(err => console.error('Failed to fetch user posts:', err));
    }
  }, [profileUser, loggedInUser]);

const handleDeletePost = async (postId: string) => {
  const confirmed = window.confirm('Delete this ride?')
  if (!confirmed) return

  try {
    const res = await fetch(`/api/ride-posts/${postId}`, { method: 'DELETE' })
    if (res.ok) {
      setUserPosts(prev => prev.filter(post => post.id !== postId))
    }

    // 🔔 Notify users via backend (see below)
    await fetch('/api/ride-posts/notify-deletion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    })
  } catch (err) {
    console.error('Delete failed:', err)
  }
}

const handleSave = async () => {
  const updatedUser = {
    ...profileUser,
    bio: bioValue,
    location: locationValue,
    website: websiteValue,
  };

  try {
    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: updatedUser.email,
        bio: updatedUser.bio,
        location: updatedUser.location,
        website: updatedUser.website,
      }),
    });

    if (!res.ok) throw new Error('Failed to update profile');

    // ✅ Re-fetch updated profile from backend
    const refreshed = await fetch(`/api/users/${updatedUser.id}`);
    const freshData = await refreshed.json();

    setProfileUser(freshData);
    setLoggedInUser(freshData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(freshData));
    }
  } catch (err) {
    console.error('Failed to save profile to server:', err);
  }

  setEditMode(false);
};

// (Optional) Utility functions from the other branch
const getTimeOfDayLabel = (timeOfDay: string) => {
  switch (timeOfDay) {
    case 'MORNING': return 'Morning'
    case 'NOON': return 'Noon'
    case 'EVENING': return 'Evening'
    case 'FLEXIBLE': return 'Flexible'
    default: return timeOfDay
  }
}

const getRoleLabel = (post: any) => {
  return post.type === 'OFFER' ? 'Offering' : 'Requesting'
}

const getRoleIcon = (post: any) => {
  return post.type === 'OFFER'
    ? <Car className="h-5 w-5 text-emerald-600" />
    : <Users className="h-5 w-5 text-blue-600" />
}

const getSeatsText = (post: any) => {
  const seatCount = post.seatsAvailable || post.seats || 1
  return post.type === 'OFFER'
    ? `${seatCount} seat${seatCount !== 1 ? 's' : ''} available`
    : `${seatCount} seat${seatCount !== 1 ? 's' : ''} needed`
}

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
    </div>
  );
}
  // Remove placeholder data for demo
  const bannerUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"

const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileUser?.name || profileUser?.firstName || "User")}`;
const joinDate = profileUser?.createdAt  ? new Date(profileUser.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })
  : ''

// Optional: use this if you need the username string elsewhere
// const username = user?.name ? user.name.toLowerCase().replace(/\s+/g, "") : "user"

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-24 pb-28 px-4">
      {/* Banner */}
      {/* Banner Container */}
<div className="w-full max-w-2xl h-48 md:h-64 bg-zinc-800 relative rounded-b-2xl overflow-visible">
  <img src={bannerUrl} alt="Banner" className="object-cover w-full h-full rounded-b-2xl" />
</div>

{/* Avatar (outside the banner, not inside) */}
<div className="relative w-full max-w-2xl">
  <div className="absolute left-6 md:left-10 -top-16 md:-top-20 z-20">
    <img
      src={avatarUrl}
      alt="Avatar"
      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black shadow-xl bg-zinc-900"
    />
  </div>
</div>
      {/* Profile Info */}
      <div className="w-full max-w-2xl px-6 md:px-10 pt-20 pb-6 flex flex-col md:flex-row md:justify-between md:items-end">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-white">
            {profileUser?.firstName || profileUser?.name || 'User'} {profileUser?.lastName || ''}
          </h1>
          {!editMode && profileUser.bio && <div className="text-white mt-2">{profileUser.bio}</div>}
          {profileUser?.email && (
            <div className="text-gray-400 text-sm font-medium mb-2">
              📧 {profileUser?.email}
            </div>
          )}
          {editMode ? (
            <>
              <textarea
                className="input-field w-full mb-2"
                value={bioValue}
                onChange={e => setBioValue(e.target.value)}
                rows={2}
                maxLength={160}
              />
              <input
                className="input-field w-full mb-2"
                value={locationValue}
                onChange={e => setLocationValue(e.target.value)}
                placeholder="Location"
              />
              <input
                className="input-field w-full mb-2"
                value={websiteValue}
                onChange={e => setWebsiteValue(e.target.value)}
                placeholder="Website"
              />
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-2">
                {locationValue && <span>📍 {locationValue}</span>}
                {websiteValue && <span>🔗 
                  <a
                    href={
                      websiteValue.startsWith('http://') || websiteValue.startsWith('https://')
                        ? websiteValue
                        : `https://${websiteValue}`
                    }
                    className="underline text-emerald-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {websiteValue}
                  </a>
                </span>}
                <span>🗓️ Joined {joinDate}</span>
              </div>
            </>
          )}
        </div>
        {/* Only show Edit Profile button for own profile */}
        {loggedInUser && profileUser && profileUser.id === loggedInUser.id && (
          <div className="mt-4 md:mt-0">
            {editMode ? (
              <button className="rounded-full border border-emerald-400 text-emerald-400 px-6 py-2 font-semibold hover:bg-emerald-400 hover:text-black transition mr-2" onClick={handleSave}>Save</button>
            ) : (
              <button className="rounded-full border border-emerald-400 text-emerald-400 px-6 py-2 font-semibold hover:bg-emerald-400 hover:text-black transition" 
              onClick={() => {
                setBioValue(profileUser?.bio || '')
                setLocationValue(profileUser?.location || '')
                setWebsiteValue(profileUser?.website || '')
                setEditMode(true)
              }}
              >
                Edit profile
              </button>
            )}
          </div>
        )}
      </div>
      {/* Logout Button - only for own profile */}
      {loggedInUser && profileUser && profileUser.id === loggedInUser.id && (
        <div className="w-full max-w-2xl px-6 md:px-10 mt-4">
          <div className="w-full max-w-2xl px-6 md:px-10 mt-6 mb-8">
            <button
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-full py-3 text-base font-semibold transition"
              onClick={() => {
                localStorage.removeItem('currentUser');
                window.dispatchEvent(new Event('storage'));
                router.replace('/login');
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* My Rides Section */}
      {loggedInUser && profileUser && profileUser.id === loggedInUser.id && (
        <div className="w-full max-w-2xl px-6 md:px-10 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">My Rides</h2>
          <div className="flex flex-col gap-4">

            {userPostsLoading ? (
  <div className="text-center py-8 text-gray-400 animate-pulse">Loading your rides...</div>
) : userPosts.length > 0 ? (
  userPosts.map((post) => (
    <div
      key={post.id}
      className="w-full bg-[#16181c] rounded-2xl border border-[#222327] shadow p-5 flex flex-col gap-2"
    >
      {/* User and Post Type */}
      <div className="flex items-center gap-3 mb-1">
        <div className={`p-2 rounded-full ${post.role === 'driver' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
          {getRoleIcon(post)}
        </div>
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

      {/* Notes */}
      {post.notes && (
        <p className="text-sm text-gray-300 mb-1 whitespace-pre-line">{post.notes}</p>
      )}

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {post.hashtags.map((hashtag: string) => (
            <span
              key={hashtag}
              className="px-3 py-1 bg-[#222327] text-twitterBlue text-xs font-semibold rounded-full"
            >
              #{hashtag}
            </span>
          ))}
        </div>
      )}

      {/* Contact Info */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500 truncate">
          Contact: {post.contactInfo}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end mt-4">
        <button
          onClick={() => setEditDialog({ open: true, post })}
          className="px-4 py-1 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeletePost(post.id)}
          className="px-4 py-1 text-sm rounded-full bg-red-600 text-white hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">You haven`t posted any rides yet.</p>
                  <button
                    onClick={() => router.push('/home')}
                    className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
                  >
                    Post Your First Ride
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
      {/* Other User's Rides Section */}
      {userId && userId !== profileUser?.id && (
        <div className="w-full max-w-2xl px-6 md:px-10 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">{profileUser?.firstName || profileUser?.name || 'User'}`s Rides</h2>
          <div className="flex flex-col gap-4">
            {otherUserPosts.length > 0 ? (
              otherUserPosts.map((post) => (
                <div
                  key={post.id}
                  className="w-full bg-[#16181c] rounded-2xl border border-[#222327] shadow p-5 flex flex-col gap-2"
                >
                  {/* User and Post Type */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`p-2 rounded-full ${post.role === 'driver' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                      {getRoleIcon(post)}
                    </div>
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

                  {/* Notes */}
                  {post.notes && (
                    <p className="text-sm text-gray-300 mb-1 whitespace-pre-line">{post.notes}</p>
                  )}

                  {/* Hashtags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-1">
                      {post.hashtags.map((hashtag: string) => (
                        <span
                          key={hashtag}
                          className="px-3 py-1 bg-[#222327] text-twitterBlue text-xs font-semibold rounded-full"
                        >
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 truncate">
                      Contact: {post.contactInfo}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">This user hasn`t posted any rides yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
      {editDialog.open && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
    <div className="bg-[#16181c] rounded-2xl shadow-lg p-6 w-full max-w-md">
      <RidePostForm
        initialData={editDialog.post}
        onComplete={(updatedPost) => {
          setUserPosts((prev) =>
            prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
          );
          setEditDialog({ open: false, post: null });

          // Optionally notify backend/email on edit here
          fetch('/api/ride-posts/notify-edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: updatedPost.id }),
          });
        }}
        onBack={() => setEditDialog({ open: false, post: null })}
      />
    </div>
  </div>
)}
    </div>
  )
}