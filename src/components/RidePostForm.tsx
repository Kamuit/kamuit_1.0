'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'

const ridePostSchema = z.object({
  from: z.string().min(1, 'From location is required'),
  to: z.string().min(1, 'To location is required'),
  date: z
    .string()
    .nonempty('Date is required')
    .refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
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
  onComplete: (data: RidePostFormData & { type: 'OFFER' | 'REQUEST'; hashtags: string[] }) => void
  onBack: () => void
  readOnlyFields?: string[]
  onFieldClick?: (field: string) => void
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

export default function RidePostForm({
  initialData,
  onComplete,
  onBack,
  readOnlyFields = [],
  onFieldClick,
}: RidePostFormProps) {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(initialData.hashtags)
  const [type] = useState<'OFFER' | 'REQUEST'>(initialData.type)
  const dateInputRef = useRef<HTMLInputElement>(null)

  function safeConvertToISODate(ddmmyyyy: string): string {
    const parts = ddmmyyyy.split('/')
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts
      if (dd && mm && yyyy) {
        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
      }
    }
    return new Date().toISOString().split('T')[0]
  }
  const isReadOnly = (field: string) => readOnlyFields.includes(field)
  const readOnlyClass = (field: string) =>
    isReadOnly(field) ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-60' : ''

  const defaultISODate = safeConvertToISODate(initialData.date)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RidePostFormData>({
    resolver: zodResolver(ridePostSchema),
    defaultValues: {
      from: initialData.from,
      to: initialData.to,
      date: defaultISODate,
      timeOfDay: initialData.timeOfDay,
      seats: initialData.seats,
      contactInfo: initialData.contactInfo,
      notes: initialData.notes,
    },
  })

  const onSubmit = (data: RidePostFormData) => {
    onComplete({ ...data, type, hashtags: selectedHashtags })
  }

  const toggleHashtag = (hashtagId: string) => {
    if (readOnlyFields.includes('hashtags')) {
      onFieldClick?.('hashtags')
      return
    }

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
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900 ml-4">
            {type === 'OFFER' ? 'Offer a Ride' : 'Find a Ride'}
          </h2>
        </div>

        {type === 'OFFER' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6 rounded-md text-sm text-yellow-800">
            <p className="font-semibold mb-1">✨ Before offering a ride...</p>
            <p>
              You`re about to invite strangers into your ride. Drive responsibly, communicate clearly,
              don`t cancel last minute, and maybe... clean the back seat? 😅 <br />
              Safety first – for them and for you.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From *</label>
              <input
                {...register('from')}
                id="from"
                className={`input-field ${readOnlyClass('from')}`}
                placeholder="e.g. New York"
                readOnly={readOnlyFields.includes('from')}
                disabled={readOnlyFields.includes('from')}
                onClick={() => readOnlyFields.includes('from') && onFieldClick?.('from')}
              />
              {errors.from && <p className="text-red-500 text-sm mt-1">{errors.from.message}</p>}
            </div>
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To *</label>
              <input
                {...register('to')}
                id="to"
                className={`input-field ${readOnlyClass('from')}`}
                placeholder="e.g. Boston"
                readOnly={readOnlyFields.includes('to')}
                disabled={readOnlyFields.includes('to')}
                onClick={() => readOnlyFields.includes('to') && onFieldClick?.('to')}
              />
              {errors.to && <p className="text-red-500 text-sm mt-1">{errors.to.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                {...register('date')}
                type="date"
                id="date"
                className={`input-field pr-10 text-left appearance-none [&::-webkit-datetime-edit]:text-left ${readOnlyClass('date')}`}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                placeholder="YYYY-MM-DD"
                readOnly={readOnlyFields.includes('date')}
                disabled={readOnlyFields.includes('date')}
                onClick={() => readOnlyFields.includes('date') && onFieldClick?.('date')}
              />
              <CalendarDaysIcon className="w-5 h-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700 mb-1">Time of Day *</label>
              <select
                {...register('timeOfDay')}
                id="timeOfDay"
                className={`input-field ${readOnlyClass('from')}`}
                disabled={readOnlyFields.includes('timeOfDay')}
                onClick={() => readOnlyFields.includes('timeOfDay') && onFieldClick?.('timeOfDay')}
              >
                <option value="MORNING">Morning</option>
                <option value="NOON">Noon</option>
                <option value="EVENING">Evening</option>
                <option value="FLEXIBLE">Flexible</option>
              </select>
              {errors.timeOfDay && <p className="text-red-500 text-sm mt-1">{errors.timeOfDay.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-1">Seats Available *</label>
              <select {...register('seats', { valueAsNumber: true })} id="seats" className="input-field">
                {[1, 2, 3, 4, 5].map(s => (
                  <option key={s} value={s}>{s} seat{s > 1 ? 's' : ''}</option>
                ))}
              </select>
              {errors.seats && <p className="text-red-500 text-sm mt-1">{errors.seats.message}</p>}
            </div>
            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
              type="email"
                {...register('contactInfo')}
                id="contactInfo"
                className="input-field"
                placeholder="Email"
              />
              {errors.contactInfo && <p className="text-red-500 text-sm mt-1">{errors.contactInfo.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={3}
              className={`input-field ${readOnlyClass('from')}`}
              placeholder="Any additional details..."
              readOnly={readOnlyFields.includes('notes')}
              disabled={readOnlyFields.includes('notes')}
              onClick={() => readOnlyFields.includes('notes') && onFieldClick?.('notes')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Hashtags (Optional)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {hashtagOptions.map(h => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => toggleHashtag(h.id)}
                  disabled={readOnlyFields.includes('hashtags')}
                  className={`px-3 py-2 text-sm rounded-full border transition-colors ${
                    selectedHashtags.includes(h.id)
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300'
                  } ${readOnlyFields.includes('hashtags') ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Posting...' : `Post ${type === 'OFFER' ? 'Ride' : 'Request'}`}
          </button>
        </form>
      </div>
    </div>
  )
}