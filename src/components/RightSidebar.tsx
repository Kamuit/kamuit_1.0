"use client"
import React, { useEffect, useState } from 'react'

interface RidePost {
  id: string;
  from: string;
  to: string;
  date: string;
  seatsAvailable: number;
  contactInfo: string;
}

export default function RightSidebar() {
  const [topRides, setTopRides] = useState<RidePost[]>([])

  useEffect(() => {
    const fetchRides = async () => {
      const res = await fetch('/api/top-saved-rides')
      const data = await res.json()
      setTopRides(data.rides || [])
    }
    fetchRides()
  }, [])

  return (
    <aside
      className="hidden lg:flex fixed right-0 top-0 h-screen w-72 flex-col px-4 py-6 bg-gray-950 border-l border-[#222327] z-40 overflow-y-auto hover:overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
    >
      <h2 className="text-xl font-bold text-white mb-4">Trending Rides</h2>

      {topRides.length > 0 ? (
        topRides.map((ride) => (
          <div
            key={ride.id}
            className="bg-[#16181c] p-4 rounded-2xl mb-4 shadow border border-[#222327]"
          >
            <div className="text-white font-semibold mb-1">
              {ride.from} → {ride.to}
            </div>
            <div className="text-sm text-gray-400">
              {new Date(ride.date).toLocaleDateString()} · {ride.seatsAvailable} seats
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500 mt-10">No hot rides right now. 💤</div>
      )}
    </aside>
  )
}