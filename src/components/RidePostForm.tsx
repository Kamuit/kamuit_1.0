'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { CalendarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

const ridePostSchema = z.object({
  from: z.string().min(1, 'From location is required'),
  to: z.string().min(1, 'To location is required'),
  date: z.string().min(1, 'Date is required'),
  timeOfDay: z.enum(['MORNING', 'NOON', 'EVENING', 'FLEXIBLE']),
  seats: z.number().min(1).max(5),
  contactInfo: z.string().min(1, 'Contact info is required'),
  notes: z.string().optional(),
})

type RidePostFormData = z.infer<typeof ridePostSchema>

interface RidePostFormProps {
  initialData: {
    type: 'OFFER' | 'REQUEST'
    from: string
    to: string
    date: string
    timeOfDay: 'MORNING' | 'NOON' | 'EVENING' | 'FLEXIBLE'
    seats: number
    contactInfo: string
    notes?: string
    hashtags: string[]
  }
  onComplete: (data: RidePostFormData & { type: 'OFFER' | 'REQUEST', hashtags: string[] }) => void
  onBack: () => void
}

const hashtagOptions = [
  { id: 'PetFriendly', label: 'Pet Friendly' },
  { id: 'SmokeFree', label: 'Smoke Free' },
  { id: 'WomenOnly', label: 'Women Only' },
  { id: 'MusicOK', label: 'Music OK' },
  { id: 'QuietRide', label: 'Quiet Ride' },
  { id: 'FlexibleTiming', label: 'Flexible Timing' },
  { id: 'RoundTrip', label: 'Round Trip' },
  { id: 'SameCollege', label: 'Same College' },
]

export default function RidePostForm({ initialData, onComplete, onBack }: RidePostFormProps) {
  console.log('[RidePostForm] rendered with type:', initialData.type)

  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(initialData.hashtags)
  const [type] = useState<'OFFER' | 'REQUEST'>(initialData.type)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RidePostFormData>({
    resolver: zodResolver(ridePostSchema),
    defaultValues: {
      from: initialData.from,
      to: initialData.to,
      date: initialData.date,
      timeOfDay: initialData.timeOfDay,
      seats: initialData.seats,
      contactInfo: initialData.contactInfo,
      notes: initialData.notes,
    },
  })

  const onSubmit = (data: RidePostFormData) => {
    console.log('[RidePostForm] submitting form with type:', type)
    onComplete({ ...data, type, hashtags: selectedHashtags })
  }

  const toggleHashtag = (hashtagId: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtagId)
        ? prev.filter(id => id !== hashtagId)
        : [...prev, hashtagId]
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900 ml-4">
            {type === 'OFFER' ? 'Offer a Ride' : 'Find a Ride'}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                From *
              </label>
              <input
                {...register('from')}
                type="text"
                id="from"
                className="input-field"
                placeholder="Chicago"
              />
              {errors.from && (
                <p className="text-red-500 text-sm mt-1">{errors.from.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                To *
              </label>
              <input
                {...register('to')}
                type="text"
                id="to"
                className="input-field"
                placeholder="Milwaukee"
              />
              {errors.to && (
                <p className="text-red-500 text-sm mt-1">{errors.to.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                {...register('date')}
                type="date"
                id="date"
                className="input-field pr-10 placeholder:uppercase" // add padding for icon and uppercase placeholder
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                placeholder="YYYY-MM-DD"
              />
              <CalendarDaysIcon className="w-5 h-5 text-green-500 absolute right-3 top-9 pointer-events-none" />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700 mb-1">
                Time of Day *
              </label>
              <select
                {...register('timeOfDay')}
                id="timeOfDay"
                className="input-field"
              >
                <option value="MORNING">Morning</option>
                <option value="NOON">Noon</option>
                <option value="EVENING">Evening</option>
                <option value="FLEXIBLE">Flexible</option>
              </select>
              {errors.timeOfDay && (
                <p className="text-red-500 text-sm mt-1">{errors.timeOfDay.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-1">
                Seats Available *
              </label>
              <select
                {...register('seats', { valueAsNumber: true })}
                id="seats"
                className="input-field"
              >
                <option value={1}>1 seat</option>
                <option value={2}>2 seats</option>
                <option value={3}>3 seats</option>
                <option value={4}>4 seats</option>
                <option value={5}>5 seats</option>
              </select>
              {errors.seats && (
                <p className="text-red-500 text-sm mt-1">{errors.seats.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Info *
              </label>
              <input
                {...register('contactInfo')}
                type="text"
                id="contactInfo"
                className="input-field"
                placeholder="Phone, email, or WhatsApp"
              />
              {errors.contactInfo && (
                <p className="text-red-500 text-sm mt-1">{errors.contactInfo.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={3}
              className="input-field"
              placeholder="Any additional details about your ride..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Hashtags (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {hashtagOptions.map((hashtag) => (
                <button
                  key={hashtag.id}
                  type="button"
                  onClick={() => toggleHashtag(hashtag.id)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    selectedHashtags.includes(hashtag.id)
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300'
                  }`}
                >
                  {hashtag.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? 'Posting...' : `Post ${type === 'OFFER' ? 'Ride' : 'Request'}`}
          </button>
        </form>
      </div>
    </div>
  )
}