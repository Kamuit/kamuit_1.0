"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../context/UserContext'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  

  const router = useRouter()
  const { setUser } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      localStorage.setItem('currentUser', JSON.stringify(data.user))
      router.replace('/home')
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      })
      setResetSent(true)
    } catch (err) {
      console.error('Reset request failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/assets/b3.svg"
            alt="kamuit logo"
            className="w-36 h-22"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div className="text-emerald-400 text-base font-medium">Ride Better Together</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#16181c] p-8 rounded-2xl shadow border border-[#222327] w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input-field mb-4 w-full"
          />
          <div className="relative mb-4 w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input-field pr-10 w-full"
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={() => setShowPassword(prev => !prev)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div
            className="flex justify-end text-sm cursor-pointer mb-6"
            onClick={() => setShowReset(true)}
          >
            <span className=' text-emerald-400 hover:text-emerald-300' >Forgot your password? </span> <span> we won’t judge 🤭</span>
          </div>
          <div className="flex flex-col gap-0">
            <button type="submit" className="w-full rounded-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 text-lg font-semibold transition">Log In</button>
            <a href="/signup" className="w-full rounded-full bg-gray-700 hover:bg-gray-800 text-white py-4 text-lg font-semibold transition mt-3 text-center block">Sign Up</a>
          </div>
        </form>

        {/* Forgot Password Modal */}
        {showReset && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-[#1e1f22] p-6 rounded-xl border border-[#333] w-full max-w-sm text-white">
              <h2 className="text-xl font-semibold mb-4 text-center">Let’s help you out 🧠</h2>
              {!resetSent ? (
                <form onSubmit={handleResetSubmit}>
                  <label className="block text-sm mb-2">Enter your email registered with Kamuit</label>
                  <input
                    type="email"
                    className="input-field w-full mb-4"
                    placeholder="Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                  <button type="submit" className="btn-primary w-full">Send Reset Link</button>
                  <button type="button" onClick={() => setShowReset(false)} className="mt-4 w-full text-sm text-gray-400 hover:text-white text-center">
                    Nevermind, I remembered 🧠
                  </button>
                </form>
              ) : (
                <div className="text-center text-emerald-400">
                  If your email is in our vault, a magic link is flying to your inbox! 📨
                  <button onClick={() => setShowReset(false)} className="block mt-6 text-sm text-gray-300 hover:text-white">
                    Return to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
