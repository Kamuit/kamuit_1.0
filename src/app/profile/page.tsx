"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type UserProfile = {
  name?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string; // Added joinDate to the type
};

export default function ProfilePage() {
  // All hooks at the top!
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [bioValue, setBioValue] = useState("")
  const [locationValue, setLocationValue] = useState("")
  const [websiteValue, setWebsiteValue] = useState("")
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setLoading(false), 300)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentUser')
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch {}
      } else {
        router.replace('/login')
      }
    }
  }, [router])

  useEffect(() => {
    if (user) {
      setBioValue(user.bio || "")
      setLocationValue(user.location || "")
      setWebsiteValue(user.website || "")
    }
  }, [user])

  const handleSave = () => {
    const updatedUser = { ...user, bio: bioValue, location: locationValue, website: websiteValue }
    setUser(updatedUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    }
    setEditMode(false)
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>
  // Remove placeholder data for demo
  const bannerUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  const avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(user?.name || user?.firstName || "User")
  const username = user?.name ? user.name.toLowerCase().replace(/\s+/g, "") : "user"
  const joinDate = user?.joinDate ? new Date(user.joinDate).toLocaleString('default', { month: 'long', year: 'numeric' }) : ""

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between">
      {/* Banner */}
      <div className="w-full max-w-2xl h-48 md:h-64 bg-zinc-800 relative rounded-b-2xl overflow-hidden">
        <img src={bannerUrl} alt="Banner" className="object-cover w-full h-full" />
        {/* Avatar */}
        <div className="absolute left-6 md:left-10 -bottom-16 md:-bottom-20 z-10">
          <img src={avatarUrl} alt="Avatar" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black shadow-xl bg-zinc-900" />
        </div>
      </div>
      {/* Profile Info */}
      <div className="w-full max-w-2xl px-6 md:px-10 pt-20 pb-6 flex flex-col md:flex-row md:justify-between md:items-end">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-white">{user?.firstName || user?.name || 'User'}{user?.lastName ? ` ${user.lastName}` : ''}</h1>
          <div className="text-gray-400 text-lg font-medium mb-2">@{username}</div>
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
              <div className="text-base text-white mb-2">{bioValue}</div>
              <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-2">
                {locationValue && <span>📍 {locationValue}</span>}
                {websiteValue && <span>🔗 <a href={`https://${websiteValue}`} className="underline text-emerald-400" target="_blank" rel="noopener noreferrer">{websiteValue}</a></span>}
                <span>📅 Joined {joinDate}</span>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 md:mt-0">
          {editMode ? (
            <button className="rounded-full border border-emerald-400 text-emerald-400 px-6 py-2 font-semibold hover:bg-emerald-400 hover:text-black transition mr-2" onClick={handleSave}>Save</button>
          ) : (
            <button className="rounded-full border border-emerald-400 text-emerald-400 px-6 py-2 font-semibold hover:bg-emerald-400 hover:text-black transition" onClick={() => setEditMode(true)}>Edit profile</button>
          )}
        </div>
      </div>
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
    </div>
  )
} 