/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const onboardingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  homeCity: z.string().min(1, 'Home city is required'),
  isStudent: z.boolean().default(false),
  university: z.string().optional(),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

interface OnboardingFormProps {
  onComplete: (data: OnboardingFormData) => void
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [isStudent, setIsStudent] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  })

  const onSubmit = (data: OnboardingFormData) => {
    onComplete(data)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Welcome to Kamuit</h2>
        <p className="text-gray-600 mb-6">Let&apos;s get to know you better to connect you with the right rides.</p> 
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                {...register('firstName')}
                type="text"
                id="firstName"
                className="input-field"
                placeholder="John"
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                {...register('lastName')}
                type="text"
                id="lastName"
                className="input-field"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="input-field"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="homeCity" className="block text-sm font-medium text-gray-700 mb-1">
              Home City *
            </label>
            <input
              {...register('homeCity')}
              type="text"
              id="homeCity"
              className="input-field"
              placeholder="Chicago"
            />
            {errors.homeCity && (
              <p className="text-red-500 text-sm mt-1">{errors.homeCity.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <input
              {...register('isStudent')}
              type="checkbox"
              id="isStudent"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              onChange={(e) => setIsStudent(e.target.checked)}
            />
            <label htmlFor="isStudent" className="text-sm font-medium text-gray-700">
              Are you a student?
            </label>
          </div>

          {isStudent && (
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                University
              </label>
              <select
                {...register('university')}
                id="university"
                className="input-field"
              >
                <option value="">Select your university</option>
                <option value="University of Chicago">University of Chicago</option>
                <option value="Northwestern University">Northwestern University</option>
                <option value="University of Illinois">University of Illinois</option>
                <option value="DePaul University">DePaul University</option>
                <option value="Loyola University">Loyola University</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? 'Setting up...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
} 