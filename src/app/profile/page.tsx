import React, { Suspense } from 'react'
import ProfilePage from '../../components/ProfilePage' // adjust path as needed

export default function ProfilePageWrapper() {
  return (
    <Suspense fallback={<div className="text-white h-screen flex items-center justify-center">Loading...</div>}>
      <ProfilePage />
    </Suspense>
  )
}