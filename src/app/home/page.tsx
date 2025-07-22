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
  const [savedRides, setSavedRides] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ride-posts');
      const data = await res.json();
      setPosts(data.posts);
    } catch (err) {
      console.error('Failed to load ride posts', err);
    } finally {
      setLoading(false);
    }
  };

  loadData();

  const user = localStorage.getItem('currentUser');
  if (!user) router.replace('/login');

  window.openNewRideModal = () => {
    setShowModal(true);
    setModalTab('offer');
  };

  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setSavedRides(parsed.savedRides || []);
      } catch {}
    }
  }

  return () => {
    window.openNewRideModal = undefined;
  };
}, [router]);

const handlePostRide = async (data: any) => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    console.log(1)
    console.log('[handlePostRide] submitting ride with type:', data.type); // ✅ LOG HERE

  if (!user?.id) {
    alert('Please login again.');
    router.push('/login');
    return;
  }

  try {
    const res = await fetch('/api/driver/addPost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        type: data.type, // ✅ explicitly use type from form
        userId: user.id,
      }),
    });

    if (!res.ok) throw new Error('Failed to create ride post');

    setShowModal(false);

    // Refresh the post list from backend
    const refreshed = await fetch('/api/ride-posts/');
    const refreshedData = await refreshed.json();
    setPosts(refreshedData.posts); // assuming it returns { posts: [...] }
  } catch (err) {
    console.error('Error posting ride:', err);
    alert('Something went wrong. Please try again.');
  }
};



  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-full max-w-4xl p-4 md:p-8 bg-[#16181c] rounded-2xl shadow border border-[#222327] mx-auto">
        <RideFeed
          posts={posts}
          setPosts={setPosts}
          handleConnect={() => {}}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>
      {/* Modal for New Ride */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#16181c] rounded-2xl shadow-xl border border-[#222327] w-full max-w-md p-8 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setShowModal(false)}>&times;</button>
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-zinc-900 rounded-full p-1">
                <button
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${modalTab === 'find' ? 'bg-emerald-500 text-white shadow' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setModalTab('find')}
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
            {(modalTab === 'offer' || modalTab === 'find') && (
            <RidePostForm
              key={modalTab} // ✅ this forces full re-render when tab changes
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
      )}
    </div>
  )
} 