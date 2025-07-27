"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const citySuggestions = [
  "Chicago",
  "College Station",
  "Austin",
  "New York",
  "San Francisco",
  "Houston",
  "Los Angeles",
  "Boston",
  "Seattle",
]

const universityOptions = [
  "Illinois",
  "Purdue",
  "UW-Madison",
  "UIC",
  "Texas A&M",
  "UT Austin",
  "Other",
]

// Define steps for the new registration flow order
const steps = [
  { id: 1, label: "What's your first name?", key: "firstName", inputType: "text", required: true, placeholder: "First Name" },
  { id: 2, label: "What's your last name?", key: "lastName", inputType: "text", required: true, placeholder: "Last Name" },
  { id: 3, label: "What’s your gender?", key: "gender", inputType: "gender", required: true, placeholder: "Please select your gender" },
  { id: 4, label: "What's your email address?", key: "email", inputType: "email", required: true, placeholder: "Email Address" },
  // Step 4: Email verification (virtual, not in this array)
  { id: 5, label: "Which city are you based in?", key: "city", inputType: "city", required: true, placeholder: "Enter your current city" },
  { id: 6, label: "Are you a student?", key: "isStudent", inputType: "studentWithUniversity", required: true },
  { id: 7, label: "Create a password", key: "password", inputType: "password", required: true, placeholder: "Enter your password" },
];

const cities = [
  "Atlanta",
  "Austin",
  "Boston",
  "Buffalo",
  "Champaign",
  "Chicago",
  "College Station",
  "Gainesville",
  "Houston",
  "Los Angeles",
  "Miami",
  "New Brunswick",
  "New York",
  "Orlando",
  "Philadelphia",
  "San Diego",
  "San Francisco",
  "San Jose",
  "Tampa"
];

export default function SignupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<{ [key: string]: string }>({ firstName: "", lastName: "", city: "", email: "", password: "", confirmPassword: "", isStudent: "", university: "", gender: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [error, setError] = useState("")
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [fade, setFade] = useState(true)
  const router = useRouter()
  const [userEnteredCode, setUserEnteredCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [universityQuery, setUniversityQuery] = useState("")
const [universitySuggestions, setUniversitySuggestions] = useState<{ id: string, institution: string }[]>([])
  // Add state for email verification step
  const [emailVerification, setEmailVerification] = useState({
    sent: false,
    loading: true,
    canResend: false,
    verified: false,
    showSuccess: false,
    resendTimer: 20,
  })

  // Add state for success message
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If already signed in, redirect to /profile
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser')
      if (user) router.replace('/profile')
    }
  }, [router])

  useEffect(() => {
  const delayDebounce = setTimeout(async () => {
    if (universityQuery.length < 2) {
      setUniversitySuggestions([])
      return
    }

    try {
      const res = await fetch(`/api/universities/search?query=${encodeURIComponent(universityQuery)}`)
      const data = await res.json()
      setUniversitySuggestions(data)
    } catch (err) {
      console.error('Failed to fetch suggestions', err)
    }
  }, 300) // debounce

  return () => clearTimeout(delayDebounce)
}, [universityQuery])


  useEffect(() => {
  const emailStepIndex = steps.findIndex(s => s.inputType === 'email');
  const verifyStepIndex = emailStepIndex + 1;
  if (step === verifyStepIndex && !emailVerification.sent) {
    handleResend(); // send email immediately
  }
}, [step]);
  // Add effect to handle resend timer for email verification
  useEffect(() => {
    // The email verification step is now after the email input step
    const emailStepIndex = steps.findIndex(s => s.inputType === 'email');
    const verifyStepIndex = emailStepIndex + 1;
    if (step === verifyStepIndex && emailVerification.loading && !emailVerification.canResend) {
      // Start timer for showing resend button
      const timer = setInterval(() => {
        setEmailVerification((prev) => {
          if (prev.resendTimer > 1) {
            return { ...prev, resendTimer: prev.resendTimer - 1 }
          } else {
            clearInterval(timer)
            return { ...prev, canResend: true, loading: false, resendTimer: 0 }
          }
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, emailVerification.loading, emailVerification.canResend])

  // Handler for simulating resend email
  const handleResend = async () => {
    try {
      setEmailVerification((prev) => ({
        ...prev,
        sent: true,
        loading: true,
        canResend: false,
        showSuccess: false,
        verified: false,
        resendTimer: 20,
      }));

      const res = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send code');
      }
    } catch {
      setError('Failed to send verification code.');
    }
  };

  // Handler for simulating email verification
  const handleVerifyEmail = async () => {
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          code: userEnteredCode,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setCodeError(data.error || 'Verification failed');
        return;
      }

      // ✅ Verified
      setEmailVerification((prev) => ({
        ...prev,
        verified: true,
        showSuccess: true,
      }));
    } catch {
      setCodeError("An error occurred verifying the code.");
    }
  };

  // Handler for continuing after verification
  const handleContinueAfterVerify = () => {
    setFade(false)
    setTimeout(() => {
      setStep(step + 1)
      setFade(true)
      setEmailVerification({
        sent: false,
        loading: true,
        canResend: false,
        verified: false,
        showSuccess: false,
        resendTimer: 20,
      })
    }, 200)
  }

  // Password validation helpers
  const isPasswordLongEnough = form.password.length >= 8
  const hasSpecialChar = /[!@#$%^&*]/.test(form.password)
  const doPasswordsMatch = form.password === form.confirmPassword && form.confirmPassword.length > 0
  const isPasswordValid = isPasswordLongEnough && hasSpecialChar
  const canProceedPasswordStep = isPasswordValid && doPasswordsMatch

  // Password error messages
  useEffect(() => {
    if (step === steps.findIndex(s => s.inputType === 'password')) {
      if (form.password && !isPasswordValid) {
        setPasswordError("Password must be at least 8 characters and include a special character")
      } else {
        setPasswordError("")
      }
      if (form.confirmPassword && !doPasswordsMatch) {
        setConfirmPasswordError("Passwords do not match")
      } else {
        setConfirmPasswordError("")
      }
    }
  }, [form.password, form.confirmPassword, step, doPasswordsMatch, isPasswordValid])

  // Helper to get the correct step index, accounting for the virtual verification step
  const getStepIndex = (step: number) => step < 4 ? step : step - 1;

  const currentStep = steps[getStepIndex(step)];

  const handleChange = (e: any) => {
    setForm({ ...form, [currentStep.key]: e.target.value });
    setError("");
  }

  const handleStudentChange = (value: string) => {
    setForm({ ...form, isStudent: value, university: "" })
    setError("")
  }

  const handleUniversityChange = (e: any) => {
    setForm({ ...form, university: e.target.value })
    setError("")
  }

  const handleCitySelect = (city: string) => {
    setForm({ ...form, city })
    setShowCitySuggestions(false)
    setError("")
  }

  const handleNext = () => {
    if (currentStep.required && !form[currentStep.key]) {
      setError("This field is required.");
      return;
    }
    if (currentStep.inputType === "email" && !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (currentStep.inputType === "studentWithUniversity" && form.isStudent === "yes" && !form.university) {
      setError("Please select your university.");
      return;
    }
    setFade(false);
    setTimeout(() => {
      setStep(step + 1);
      setFade(true);
    }, 200);
  };

  const handleBack = () => {
    setFade(false)
    setTimeout(() => {
      setStep(step - 1)
      setFade(true)
    }, 200)
  }

  // Update handleSubmit to POST to /api/users and handle success
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log(e)
    setError("");
    setSuccess(false);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          homeCity: form.city,
          isStudent: form.isStudent === 'yes',
          university: form.university || null,
          gender: form.gender,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Signup failed');
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.replace('/');
      }, 1500);
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  const genderOptions = [
    { value: '', label: 'Please select your gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  const totalSteps = 9; // 7 steps + 1 verification + 1 review

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-1">Kamuit 1.0</h1>
          <div className="text-emerald-400 text-base font-medium">Ride Better Together</div>
        </div>
        <div className="bg-[#16181c] p-8 rounded-2xl shadow border border-[#222327] w-full max-w-md flex flex-col items-center">
          <div className="mb-6 w-full">
            <div className="text-emerald-400 text-xs mb-2">Step {step + 1} of {totalSteps}</div>
            <h2 className="text-xl font-bold mb-4">
              {step === 4 ? 'Verify your email' :
                step === totalSteps - 1 ? 'Review & Create Account' :
                steps[getStepIndex(step)]?.label}
            </h2>
          </div>
          {/* Email Verification Step (virtual, after email input) */}
          {step === 4 ? (
  <div className="w-full flex flex-col items-center">
    {!emailVerification.showSuccess ? (
      <>
        <div className="text-center mb-4">
          <div className="text-lg font-semibold mb-2">We’ve sent an 8-digit code to</div>
          <div className="text-emerald-400 font-mono break-all">{form.email}</div>
        </div>

        <input
          type="text"
          inputMode="numeric"
          maxLength={8}
          className="input-field text-center tracking-widest text-xl font-mono mb-2 w-full"
          placeholder="Enter 8-digit code"
          value={userEnteredCode}
          onChange={e => setUserEnteredCode(e.target.value)}
        />

        {codeError && <p className="text-red-400 text-sm mb-3">{codeError}</p>}

        {!emailVerification.canResend ? (
          <p className="text-gray-500 text-xs mb-4">You can resend in {emailVerification.resendTimer}s</p>
        ) : (
          <button
            className="btn-secondary mb-4"
            onClick={handleResend}
            type="button"
          >
            Resend code
          </button>
        )}

        <button
          className="btn-primary w-full"
          onClick={handleVerifyEmail}
          disabled={userEnteredCode.length !== 8}
          type="button"
        >
          Verify Code
        </button>
      </>
    ) : (
      <>
        <div className="flex items-center justify-center mb-4">
          <div className="fade-in-up bg-[#1d3820] text-emerald-200 px-4 py-3 rounded-lg w-full text-center">
            ✅ Email successfully verified!
          </div>
        </div>
        <button
          className="btn-primary w-full"
          onClick={handleContinueAfterVerify}
          type="button"
        >
          Continue
        </button>
      </>
    )}
  </div>
) : step === totalSteps - 1 ? (
            <div className="w-full flex flex-col items-center">
              <div className="mb-4 w-full">
                {/* 1. Full Name */}
                <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                  <span className="font-bold min-w-[110px]">Full Name:</span>
                  <span className="ml-0 sm:ml-2 font-normal">{form.firstName} {form.lastName}</span>
                </div>
                {/* 2. Gender */}
                <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                  <span className="font-bold min-w-[110px]">Gender:</span>
                  <span className="ml-0 sm:ml-2 font-normal capitalize">{form.gender.replace(/_/g, ' ')}</span>
                </div>
                {/* 3. Email with blue verified checkmark and tooltip */}
                <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                  <span className="font-bold min-w-[110px]">Email:</span>
                  <span className="ml-0 sm:ml-2 font-normal flex items-center gap-1">
                    {form.email}
                    <span className="relative group cursor-pointer">
                      <CheckCircleIcon className="w-4 h-4 text-blue-400 inline-block align-middle" />
                      <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-zinc-900 text-xs text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 border border-zinc-700">Verified</span>
                    </span>
                  </span>
                </div>
                {/* 4. City */}
                <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                  <span className="font-bold min-w-[110px]">City:</span>
                  <span className="ml-0 sm:ml-2 font-normal">{form.city || <span className='text-gray-500'>Not specified</span>}</span>
                </div>
                {/* 5. Student Yes/No */}
                <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                  <span className="font-bold min-w-[110px]">Student:</span>
                  <span className="ml-0 sm:ml-2 font-normal">{form.isStudent === 'yes' ? 'Yes' : 'No'}</span>
                </div>
                {/* 6. Institution */}
                <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                  <span className="font-bold min-w-[110px]">Institution:</span>
                  <span className="ml-0 sm:ml-2 font-normal">{form.university || <span className='text-gray-500'>Not specified</span>}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary w-full mt-4"
                onClick={handleSubmit}
                disabled={false}
              >
                Create Account
              </button>
              {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
              {success && <div className="text-emerald-400 text-sm mt-2">Account created! Redirecting...</div>}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              <div className={`transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`} key={step}>
                {steps[getStepIndex(step)]?.inputType === "text" && (
                  <input
                    type="text"
                    className="input-field mb-4 w-full"
                    placeholder={steps[getStepIndex(step)].placeholder}
                    value={form[steps[getStepIndex(step)].key]}
                    onChange={handleChange}
                  />
                )}
                {steps[getStepIndex(step)]?.inputType === "gender" && (
                  <div className="mb-4 w-full">
                    <select
                      className="input-field w-full"
                      value={form.gender || ''}
                      onChange={handleChange}
                      required
                    >
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.value === ''}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {steps[getStepIndex(step)]?.inputType === "email" && (
                  <input
                    type="email"
                    className="input-field mb-4 w-full"
                    placeholder={steps[getStepIndex(step)].placeholder}
                    value={form.email}
                    onChange={handleChange}
                  />
                )}
                {steps[getStepIndex(step)]?.inputType === "city" && (
                  <div className="mb-4 w-full">
                    <select
                      className="input-field w-full"
                      value={form.city || ''}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      required
                    >
                      <option value="" disabled>Enter your current city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                )}
                {/* Combined student/university step */}
                {steps[getStepIndex(step)]?.inputType === "studentWithUniversity" && (
                  <div className="mb-4 w-full">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mt-0 mb-2">
                      <button
                        type="button"
                        className={`transition px-7 py-2 rounded-full border text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-400
                          ${form.isStudent === 'yes' ? 'bg-emerald-500 text-white border-emerald-500' : form.isStudent === '' ? 'bg-zinc-800 text-gray-200 border-zinc-600 hover:border-emerald-400 hover:text-emerald-300' : 'bg-zinc-800 text-gray-200 border-zinc-600 hover:border-emerald-400 hover:text-emerald-300'}`}
                        onClick={() => setForm({ ...form, isStudent: 'yes', university: '' })}
                        aria-pressed={form.isStudent === 'yes'}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`transition px-7 py-2 rounded-full border text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-400
                          ${form.isStudent === 'no' ? 'bg-emerald-500 text-white border-emerald-500' : form.isStudent === '' ? 'bg-zinc-800 text-gray-200 border-zinc-600 hover:border-emerald-400 hover:text-emerald-300' : 'bg-zinc-800 text-gray-200 border-zinc-600 hover:border-emerald-400 hover:text-emerald-300'}`}
                        onClick={() => setForm({ ...form, isStudent: 'no', university: '' })}
                        aria-pressed={form.isStudent === 'no'}
                      >
                        No
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-2 pl-1 text-center">
                      This helps us connect you with your school on the community wall and filter rides more accurately.
                    </div>
                    {form.isStudent === 'yes' && (
  <div className="mt-4 w-full">
    <label className="block mb-2 text-sm font-medium text-white">Your University</label>
    <input
      type="text"
      className="input-field w-full"
      placeholder="Start typing to search..."
      value={form.university}
      onChange={(e) => {
        setForm({ ...form, university: e.target.value })
        setUniversityQuery(e.target.value)
      }}
    />
    {universitySuggestions.length > 0 && (
      <ul className="bg-zinc-800 border border-zinc-700 mt-1 rounded-lg text-sm max-h-40 overflow-y-auto">
        {universitySuggestions.map((u) => (
          <li
            key={u.id}
            className="px-4 py-2 hover:bg-zinc-700 cursor-pointer"
            onClick={() => {
              setForm({ ...form, university: u.institution })
              setUniversitySuggestions([])
            }}
          >
            {u.institution}
          </li>
        ))}
      </ul>
    )}
    <div className="text-xs text-gray-400 mt-2 pl-1">
      If your university isn’t listed, you can add it later in your profile.
    </div>
  </div>
)}
                  </div>
                )}
                {steps[getStepIndex(step)]?.inputType === "password" && (
                  <div className="mb-4 w-full">
                    {/* Password field */}
                    <div className="relative mb-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input-field w-full pr-12"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-emerald-400 focus:outline-none"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {/* Visual checklist */}
                    <div className="flex flex-col gap-1 mb-2 pl-1">
                      <div className={`flex items-center text-xs ${isPasswordLongEnough ? 'text-emerald-400' : 'text-gray-400'}`}>
                        <span className="mr-1">{isPasswordLongEnough ? '✔' : '✖'}</span> Minimum 8 characters
                      </div>
                      <div className={`flex items-center text-xs ${hasSpecialChar ? 'text-emerald-400' : 'text-gray-400'}`}>
                        <span className="mr-1">{hasSpecialChar ? '✔' : '✖'}</span> One special character
                      </div>
                      <div className={`flex items-center text-xs ${doPasswordsMatch && form.confirmPassword ? 'text-emerald-400' : 'text-gray-400'}`}>
                        <span className="mr-1">{doPasswordsMatch && form.confirmPassword ? '✔' : '✖'}</span> Passwords match
                      </div>
                    </div>
                    {passwordError && <div className="text-xs text-red-400 mb-2 pl-1">{passwordError}</div>}
                    {/* Confirm password field */}
                    <div className="relative mb-2">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="input-field w-full pr-12"
                        placeholder="Re-enter your password"
                        value={form.confirmPassword || ''}
                        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-emerald-400 focus:outline-none"
                        onClick={() => setShowConfirmPassword(v => !v)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {confirmPasswordError && <div className="text-xs text-red-400 mb-2 pl-1">{confirmPasswordError}</div>}
                  </div>
                )}
                {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
                <div className="flex justify-between mt-4">
                  {step > 0 && (
                    <button type="button" className="btn-secondary" onClick={handleBack}>Back</button>
                  )}
                  <button
                    type="button"
                    className="btn-primary ml-auto"
                    onClick={handleNext}
                    disabled={
                      (steps[getStepIndex(step)]?.required && !form[steps[getStepIndex(step)].key]) ||
                      (steps[getStepIndex(step)]?.inputType === 'studentWithUniversity' && form.isStudent === 'yes' && !form.university) ||
                      (steps[getStepIndex(step)]?.inputType === 'password' && !canProceedPasswordStep)
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 