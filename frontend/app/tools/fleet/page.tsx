'use client'

import { useState } from 'react'
import { Truck, MapPin, Navigation, Phone, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

export default function FleetPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null)

  const vehicles = [
    { 
      id: 1, 
      driver: 'John Doe', 
      status: 'In Transit', 
      location: 'Main St, Downtown', 
      eta: '15 mins', 
      battery: '85%',
      deliveries: 12,
      completed: 8
    },
    { 
      id: 2, 
      driver: 'Jane Smith', 
      status: 'Idle', 
      location: 'Warehouse B', 
      eta: '-', 
      battery: '100%',
      deliveries: 0,
      completed: 0
    },
    { 
      id: 3, 
      driver: 'Mike Ross', 
      status: 'Delayed', 
      location: 'Highway 401', 
      eta: '45 mins', 
      battery: '40%',
      deliveries: 15,
      completed: 5
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Truck className="h-8 w-8 text-blue-600" />
              Fleet Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track deliveries and optimize routes</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Navigation className="h-4 w-4" />
            Optimize Routes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle List */}
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${
                  selectedVehicle === vehicle.id 
                    ? 'border-blue-500 ring-1 ring-blue-500' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <Truck className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{vehicle.driver}</h3>
                      <p className="text-xs text-gray-500">Vehicle #{vehicle.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vehicle.status === 'In Transit' ? 'bg-green-100 text-green-700' :
                    vehicle.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    {vehicle.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4" />
                    ETA: {vehicle.eta}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{vehicle.completed}/{vehicle.deliveries}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${vehicle.deliveries > 0 ? (vehicle.completed / vehicle.deliveries) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map View (Mock) */}
          <div className="lg:col-span-2 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden relative min-h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Interactive Map View</p>
                <p className="text-sm">(Google Maps / Mapbox Integration)</p>
              </div>
            </div>
            
            {/* Overlay Stats */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
                <p className="text-xs text-gray-500">Active Fleet</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">8/10</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
                <p className="text-xs text-gray-500">On-Time Rate</p>
                <p className="text-xl font-bold text-green-600">94%</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
                <p className="text-xs text-gray-500">Fuel Efficiency</p>
                <p className="text-xl font-bold text-blue-600">8.5 km/L</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
