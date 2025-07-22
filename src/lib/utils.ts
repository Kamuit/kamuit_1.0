import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTimeOfDay(timeOfDay: string) {
  switch (timeOfDay) {
    case 'MORNING': return 'Morning'
    case 'NOON': return 'Noon'
    case 'EVENING': return 'Evening'
    case 'FLEXIBLE': return 'Flexible'
    default: return timeOfDay
  }
}

export function getTimeOfDayOptions() {
  return [
    { value: 'MORNING', label: 'Morning' },
    { value: 'NOON', label: 'Noon' },
    { value: 'EVENING', label: 'Evening' },
    { value: 'FLEXIBLE', label: 'Flexible' },
  ]
}

export function getHashtagOptions() {
  return [
    { id: 'PetFriendly', label: 'Pet Friendly' },
    { id: 'SmokeFree', label: 'Smoke Free' },
    { id: 'WomenOnly', label: 'Women Only' },
    { id: 'MusicOK', label: 'Music OK' },
    { id: 'QuietRide', label: 'Quiet Ride' },
    { id: 'FlexibleTiming', label: 'Flexible Timing' },
    { id: 'RoundTrip', label: 'Round Trip' },
    { id: 'SameCollege', label: 'Same College' },
  ]
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateRandomId() {
  return Math.random().toString(36).substr(2, 9)
} 