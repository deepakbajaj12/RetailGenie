'use client'

import { useState, useEffect } from 'react'
import { Trash2, Recycle, Leaf, AlertTriangle, CheckCircle, Truck, RefreshCw } from 'lucide-react'

export default function SmartWastePage() {
  const [bins, setBins] = useState([
    { id: 'B-01', location: 'Food Court', type: 'Compost', fill: 85, status: 'Critical' },
    { id: 'B-02', location: 'Entrance', type: 'Recycling', fill: 45, status: 'Normal' },
    { id: 'B-03', location: 'Aisle 5', type: 'Landfill', fill: 20, status: 'Normal' },
    { id: 'B-04', location: 'Backroom', type: 'Cardboard', fill: 92, status: 'Critical' },
    { id: 'B-05', location: 'Restroom', type: 'Landfill', fill: 60, status: 'Warning' },
  ])

  // Simulate fill levels increasing
  useEffect(() => {
    const interval = setInterval(() => {
      setBins(prev => prev.map(bin => {
        const newFill = Math.min(100, bin.fill + Math.random() * 2)
        let status = 'Normal'
        if (newFill > 90) status = 'Critical'
        else if (newFill > 70) status = 'Warning'
        
        return { ...bin, fill: newFill, status }
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const emptyBin = (id: string) => {
    setBins(prev => prev.map(bin => bin.id === id ? { ...bin, fill: 0, status: 'Normal' } : bin))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Trash2 className="h-8 w-8 text-green-600" />
              Smart Waste Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400">IoT-enabled waste sorting and collection optimization.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 uppercase font-bold">Diversion Rate</p>
              <p className="text-xl font-bold text-green-600">78.4%</p>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Truck className="h-4 w-4" /> Request Pickup
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bins.map((bin) => (
            <div key={bin.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    bin.type === 'Recycling' ? 'bg-blue-100 text-blue-600' :
                    bin.type === 'Compost' ? 'bg-green-100 text-green-600' :
                    bin.type === 'Cardboard' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {bin.type === 'Recycling' ? <Recycle className="h-5 w-5" /> :
                     bin.type === 'Compost' ? <Leaf className="h-5 w-5" /> :
                     <Trash2 className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{bin.location}</h3>
                    <p className="text-xs text-gray-500">{bin.type} • ID: {bin.id}</p>
                  </div>
                </div>
                {bin.status === 'Critical' && (
                  <span className="animate-pulse flex h-3 w-3 rounded-full bg-red-500" />
                )}
              </div>

              <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4 border border-gray-200 dark:border-gray-600">
                {/* Fill Level Animation */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out ${
                    bin.status === 'Critical' ? 'bg-red-500' :
                    bin.status === 'Warning' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ height: `${bin.fill}%` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 animate-wave"></div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className={`text-3xl font-bold drop-shadow-md ${bin.fill > 50 ? 'text-white' : 'text-gray-500'}`}>
                    {bin.fill.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {bin.status === 'Critical' ? (
                    <span className="text-red-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Pickup Needed
                    </span>
                  ) : (
                    <span className="text-green-500 font-bold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Status OK
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => emptyBin(bin.id)}
                  className="text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1 rounded transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> Reset
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
