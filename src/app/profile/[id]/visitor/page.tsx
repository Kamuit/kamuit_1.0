'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, Clock, MapPin, User } from 'lucide-react'

export default function VisitorProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/users/${id}/public`)
        const data = await res.json()
        if (res.ok) setProfile(data.user)
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [id])

  if (!profile) {
    return <div className="text-center py-10 text-gray-400">Loading profile...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-24 pb-28 px-4">
      {/* Banner */}
      <div className="w-full max-w-2xl h-48 md:h-64 bg-zinc-800 relative rounded-b-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          alt="Banner"
          className="object-cover w-full h-full"
        />
        {/* Avatar */}
        <div className="absolute left-6 md:left-10 -bottom-16 md:-bottom-20 z-10">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              profile.firstName || profile.name || 'User'
            )}`}
            alt="Avatar"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black shadow-xl bg-zinc-900"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="w-full max-w-2xl px-6 md:px-10 pt-20 pb-6">
        <h1 className="text-3xl font-extrabold text-white">
          {profile.firstName} {profile.lastName}
        </h1>
        {profile.bio && <div className="text-white mt-2">{profile.bio}</div>}
        {console.log(profile)}
        <div className="flex flex-wrap gap-4 text-gray-400 text-sm mt-2">
          {profile.location && <span>📍 {profile.location}</span>}
          {profile.website && (
            <span>
              🔗{' '}
              <a
                href={
                  profile.website.startsWith('http') ? profile.website : `https://${profile.website}`
                }
                className="underline text-emerald-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.website}
              </a>
            </span>
          )}
          {profile.joinDate && (
            <span>📅 Joined {new Date(profile.joinDate).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          )}
        </div>
      </div>

      {/* Rides Section */}
      <div className="w-full max-w-2xl px-6 md:px-10 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">{profile.firstName}`s Rides</h2>
        <div className="flex flex-col gap-4">
          {profile.ridePosts?.length > 0 ? (
            profile.ridePosts.map((post) => (
              <div
                key={post.id}
                className="w-full bg-[#16181c] rounded-2xl border border-[#222327] shadow p-5 flex flex-col gap-2"
              >
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400 mb-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.timeOfDay}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{post.from} → {post.to}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>
                      {post.type === 'OFFER'
                        ? `${post.seats} seat${post.seats !== 1 ? 's' : ''} available`
                        : `${post.seats} seat${post.seats !== 1 ? 's' : ''} needed`}
                    </span>
                  </div>
                </div>
                {post.notes && (
                  <p className="text-sm text-gray-300 mb-1 whitespace-pre-line">{post.notes}</p>
                )}
                {post.hashtags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-1">
                    {post.hashtags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-zinc-800 px-2 py-1 text-xs text-emerald-400 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No rides posted yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}