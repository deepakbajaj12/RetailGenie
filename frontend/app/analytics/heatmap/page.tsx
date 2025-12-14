'use client'

import { useState } from 'react'
import { Map, Layers, Activity, ZoomIn, ZoomOut } from 'lucide-react'

export default function HeatmapPage() {
  const [zoom, setZoom] = useState(1)

  // Mock grid for heatmap (10x10)
  // Values 0-100 representing traffic intensity
  const gridData = Array(10).fill(0).map(() => Array(10).fill(0).map(() => Math.floor(Math.random() * 100)))

  // Add some "hotspots" manually for realism
  gridData[2][2] = 95 // Entrance
  gridData[2][3] = 90
  gridData[5][5] = 85 // Popular Aisle
  gridData[5][6] = 80
  gridData[8][8] = 10 // Dead zone

  const getColor = (value: number) => {
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
              <Map className="h-8 w-8 text-red-600" />
              Store Traffic Heatmap
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Visualize high-traffic zones and optimize layout</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setZoom(Math.min(zoom + 0.2, 2))} className="p-2 bg-white rounded-lg shadow hover:bg-gray-50">
              <ZoomIn className="h-5 w-5 text-gray-600" />
            </button>
            <button onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))} className="p-2 bg-white rounded-lg shadow hover:bg-gray-50">
              <ZoomOut className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Heatmap Visualization */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div 
              className="grid grid-cols-10 gap-1 aspect-square max-w-2xl mx-auto transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              {gridData.map((row, i) => (
                row.map((val, j) => (
                  <div 
                    key={`${i}-${j}`}
                    className={`${getColor(val)} rounded-sm opacity-80 hover:opacity-100 transition-opacity relative group cursor-pointer`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs font-bold">
                      {val}%
                    </div>
                  </div>
                ))
              ))}
            </div>
            
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">High Traffic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Low Traffic</span>
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Key Insights
              </h3>
              <ul className="space-y-4">
                <li className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-red-600">Hotspot:</span> Entrance area shows 95% congestion during peak hours. Consider widening the aisle.
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-blue-600">Cold Zone:</span> Back-right corner (Electronics) has 10% traffic. Consider moving promotional items there.
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-green-600">Optimization:</span> Moving "Dairy" to Aisle 5 increased cross-selling by 15%.
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Recommendation</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Place high-margin impulse buys in the red zones to maximize revenue per square foot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
