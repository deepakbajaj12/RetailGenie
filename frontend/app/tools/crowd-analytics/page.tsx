'use client'

import { useState, useEffect } from 'react'
import { Users, Clock, Map, Activity, ArrowUp, ArrowDown, Eye } from 'lucide-react'

export default function CrowdAnalyticsPage() {
  const [occupancy, setOccupancy] = useState(42)
  const [heatmapData, setHeatmapData] = useState<number[]>([])

  // Initialize heatmap grid
  useEffect(() => {
    setHeatmapData(Array(24).fill(0).map(() => Math.random() * 100))
  }, [])

  // Simulate live movement
  useEffect(() => {
    const interval = setInterval(() => {
      // Update occupancy
      setOccupancy(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(0, Math.min(150, prev + change))
      })

      // Update heatmap "hotspots"
      setHeatmapData(prev => prev.map(val => {
        const change = (Math.random() - 0.5) * 20
        return Math.max(0, Math.min(100, val + change))
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getHeatColor = (value: number) => {
    if (value > 80) return 'bg-red-500'
    if (value > 60) return 'bg-orange-500'
    if (value > 40) return 'bg-yellow-500'
    if (value > 20) return 'bg-green-500'
    return 'bg-blue-500'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Activity className="h-8 w-8 text-orange-600" />
              Crowd Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Real-time foot traffic analysis and heatmapping.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Live Occupancy</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{occupancy}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${occupancy > 100 ? 'text-red-500' : 'text-green-500'}`}>
                {occupancy > 100 ? 'High Traffic' : 'Normal'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Heatmap Visualization */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Map className="h-5 w-5 text-gray-500" />
                Store Heatmap
              </h2>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> High</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> Med</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Low</span>
              </div>
            </div>

            <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Store Layout Grid */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-1 p-1">
                {heatmapData.map((value, i) => (
                  <div 
                    key={i} 
                    className={`${getHeatColor(value)} opacity-60 transition-colors duration-1000 rounded-sm backdrop-blur-sm hover:opacity-80 cursor-pointer group relative`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-white drop-shadow-md">{Math.round(value)}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Store Labels Overlay */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-6 grid-rows-4 p-1">
                <div className="col-span-2 row-span-2 border-2 border-white/20 m-2 flex items-center justify-center">
                  <span className="text-white font-bold drop-shadow-md bg-black/20 px-2 rounded">Entrance</span>
                </div>
                <div className="col-start-5 col-span-2 row-span-4 border-2 border-white/20 m-2 flex items-center justify-center">
                  <span className="text-white font-bold drop-shadow-md bg-black/20 px-2 rounded">Checkout</span>
                </div>
                <div className="col-start-3 col-span-2 row-start-3 row-span-2 border-2 border-white/20 m-2 flex items-center justify-center">
                  <span className="text-white font-bold drop-shadow-md bg-black/20 px-2 rounded">Promotions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Engagement Metrics</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Avg Dwell Time
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">14m 32s</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Eye className="h-4 w-4" /> Window Conversion
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">28.4%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Users className="h-4 w-4" /> Repeat Visitors
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">42%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-6">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Insight Alert</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                High congestion detected in the <strong>Promotions Aisle</strong>. Consider opening Register 4 to improve flow.
              </p>
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                Notify Floor Manager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
