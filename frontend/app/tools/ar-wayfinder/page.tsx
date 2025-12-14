'use client'

import { useState, useEffect } from 'react'
import { Navigation, MapPin, Search, Camera, ArrowUp, ArrowRight, ArrowLeft, Map } from 'lucide-react'

export default function ARWayfinderPage() {
  const [active, setActive] = useState(false)
  const [target, setTarget] = useState('')
  const [guidance, setGuidance] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!target) return
    setActive(true)
    setGuidance('Calculating route...')
    setTimeout(() => {
      setGuidance('Turn right at Aisle 4')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Camera Feed Simulation */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gray-800 relative overflow-hidden">
          {/* Simulated Camera View */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center"></div>
          
          {/* AR Overlays */}
          {active && (
            <>
              {/* Path Line */}
              <div className="absolute bottom-0 left-1/2 w-24 h-1/2 -translate-x-1/2 bg-gradient-to-t from-blue-500/50 to-transparent transform perspective-1000 rotate-x-60 origin-bottom animate-pulse"></div>
              
              {/* Floating Markers */}
              <div className="absolute top-1/3 left-1/4 animate-bounce duration-[2000ms]">
                <div className="bg-white/90 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-blue-600" />
                  Organic Dairy
                </div>
                <div className="w-2 h-8 bg-white/50 mx-auto"></div>
              </div>

              <div className="absolute top-1/2 right-1/3 animate-bounce duration-[2500ms]">
                <div className="bg-white/90 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-green-600" />
                  Fresh Produce
                </div>
                <div className="w-2 h-8 bg-white/50 mx-auto"></div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 h-screen flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 drop-shadow-md">
              <Navigation className="h-6 w-6 text-blue-400" />
              AR Wayfinder
            </h1>
            <p className="text-sm text-gray-300 drop-shadow-md">Indoor Navigation System</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10">
            <Camera className="h-6 w-6" />
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Where do you want to go?" 
              className="w-full pl-12 pr-4 py-4 bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors shadow-xl"
            />
          </div>
        </form>

        {/* Navigation Instructions */}
        {active && (
          <div className="mt-auto mb-8">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 animate-pulse">
                  <ArrowRight className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">Next Step</p>
                  <h2 className="text-2xl font-bold">{guidance}</h2>
                  <p className="text-blue-400 text-sm mt-1">15 meters ahead</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">ETA</p>
                  <p className="font-mono font-bold text-xl">45s</p>
                </div>
              </div>

              {/* Mini Map */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Current Location: Aisle 3</span>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                    <Map className="h-3 w-3" /> View Full Map
                  </button>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/3 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!active && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 animate-pulse">
              <Navigation className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Point camera at aisle markers</h3>
            <p className="text-gray-400 max-w-xs mx-auto">
              Our AR system uses visual positioning to guide you directly to products on your shopping list.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
