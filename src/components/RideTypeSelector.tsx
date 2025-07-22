'use client'

import { Car, Users } from 'lucide-react'

interface RideTypeSelectorProps {
  onSelect: (type: 'OFFER' | 'REQUEST') => void
}

export default function RideTypeSelector({ onSelect }: RideTypeSelectorProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">What would you like to do?</h2>
        <p className="text-gray-600 mb-8">Choose whether you want to offer a ride or find one.</p>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelect('OFFER')}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                <Car className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Offer a Ride</h3>
                <p className="text-gray-600">Share your car with others heading in the same direction</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onSelect('REQUEST')}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Find a Ride</h3>
                <p className="text-gray-600">Look for available rides from other community members</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
} 