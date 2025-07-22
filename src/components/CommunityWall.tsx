'use client'

import React, { useEffect, useState } from 'react'
import RideFeed from './RideFeed'

export default function CommunityWall() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('ridePosts')
    if (stored) setPosts(JSON.parse(stored))
  }, [])

  const handleConnect = (postId) => {
    // TODO: Implement connection logic
    console.log('Connecting to post:', postId)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Community Wall</h2>
      </div>
      <RideFeed posts={posts} setPosts={setPosts} handleConnect={handleConnect} />
    </div>
  )
} 