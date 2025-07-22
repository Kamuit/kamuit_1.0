"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [isPasswordLongEnough, setIsPasswordLongEnough] = useState(false)
  const [hasSpecialChar, setHasSpecialChar] = useState(false)
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false)

  useEffect(() => {
    setIsPasswordLongEnough(password.length >= 8)
    setHasSpecialChar(/[^A-Za-z0-9]/.test(password))
    setDoPasswordsMatch(password === confirmPassword && confirmPassword !== "")
  }, [password, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      setError("Both fields are required.")
      return
    }
    if (!isPasswordLongEnough || !hasSpecialChar || !doPasswordsMatch) {
      setError("Password does not meet all requirements.")
      return
    }

    try {
      const res = await fetch(`/api/reset-password/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Reset failed.")
        return
      }
      setSuccess(true)
      setTimeout(() => router.replace('/login'), 2000)
    } catch {
      setError("An error occurred. Try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-[#16181c] p-8 rounded-2xl shadow border border-[#222327] w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">🔑 Reset Password</h1>
        <p className="text-sm text-gray-400 mb-6">You got this. Pick a strong one!</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input-field mb-3 w-full"
          />

          {/* ✅ Password Requirements */}
          <div className="flex flex-col gap-1 mb-4 pl-1">
            <div className={`flex items-center text-xs ${isPasswordLongEnough ? 'text-emerald-400' : 'text-gray-400'}`}>
              <span className="mr-1">{isPasswordLongEnough ? '✔' : '✖'}</span> Minimum 8 characters
            </div>
            <div className={`flex items-center text-xs ${hasSpecialChar ? 'text-emerald-400' : 'text-gray-400'}`}>
              <span className="mr-1">{hasSpecialChar ? '✔' : '✖'}</span> One special character
            </div>
            <div className={`flex items-center text-xs ${doPasswordsMatch ? 'text-emerald-400' : 'text-gray-400'}`}>
              <span className="mr-1">{doPasswordsMatch ? '✔' : '✖'}</span> Passwords match
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4">Password reset! Redirecting...</p>}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="input-field mb-3 w-full"
          />
          <button type="submit" className="btn-primary w-full">Reset Password</button>
        </form>
      </div>
    </div>
  )
}
