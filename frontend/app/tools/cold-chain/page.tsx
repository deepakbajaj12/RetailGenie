'use client'

import { useState, useEffect } from 'react'
import { Thermometer, Droplets, AlertOctagon, Snowflake, History, Check, AlertTriangle } from 'lucide-react'

export default function ColdChainPage() {
  const [sensors, setSensors] = useState([
    { id: 'F-01', name: 'Dairy Walk-in', temp: 3.2, humidity: 45, status: 'Optimal', target: 3.0 },
    { id: 'F-02', name: 'Meat Freezer', temp: -18.5, humidity: 30, status: 'Optimal', target: -18.0 },
    { id: 'F-03', name: 'Produce Display', temp: 8.1, humidity: 85, status: 'Warning', target: 5.0 },
    { id: 'F-04', name: 'Seafood Case', temp: 1.5, humidity: 60, status: 'Optimal', target: 1.0 },
    { id: 'F-05', name: 'Ice Cream Bunker', temp: -12.0, humidity: 25, status: 'Critical', target: -20.0 },
  ])

  // Simulate temperature fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => {
        const drift = (Math.random() - 0.5) * 0.5
        const newTemp = Number((sensor.temp + drift).toFixed(1))
        
        let status = 'Optimal'
        const diff = Math.abs(newTemp - sensor.target)
        if (diff > 5) status = 'Critical'
        else if (diff > 2) status = 'Warning'

        return { ...sensor, temp: newTemp, status }
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Snowflake className="h-8 w-8 text-cyan-500" />
              Cold Chain Guardian
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Real-time temperature monitoring for perishable inventory.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-100 dark:border-red-800 flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-xs text-red-500 uppercase font-bold">Active Alerts</p>
                <p className="text-lg font-bold text-red-700 dark:text-red-400">{sensors.filter(s => s.status === 'Critical').length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor) => (
            <div key={sensor.id} className={`relative p-6 rounded-2xl border-2 transition-all ${
              sensor.status === 'Critical' ? 'border-red-200 bg-red-50 dark:bg-red-900/10' :
              sensor.status === 'Warning' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10' :
              'border-cyan-100 bg-white dark:bg-gray-800'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{sensor.name}</h3>
                  <p className="text-xs text-gray-500">ID: {sensor.id}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  sensor.status === 'Critical' ? 'bg-red-100 text-red-600' :
                  sensor.status === 'Warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {sensor.status}
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1 border-r border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-xs uppercase">Temp</span>
                  </div>
                  <p className={`text-4xl font-black ${
                    sensor.status === 'Critical' ? 'text-red-600' :
                    sensor.status === 'Warning' ? 'text-yellow-600' :
                    'text-gray-900 dark:text-white'
                  }`}>
                    {sensor.temp}°C
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Target: {sensor.target}°C</p>
                </div>
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <Droplets className="h-4 w-4" />
                    <span className="text-xs uppercase">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-500">
                    {sensor.humidity}%
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Door Status</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <Check className="h-3 w-3" /> Closed
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Last Defrost</span>
                  <span className="text-gray-900 dark:text-white">4h 12m ago</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Spoilage Risk</span>
                  <span className={`font-bold ${
                    sensor.status === 'Critical' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {sensor.status === 'Critical' ? 'High' : 'Low'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <button className="text-xs font-bold text-cyan-600 hover:underline flex items-center gap-1">
                  <History className="h-3 w-3" /> View History
                </button>
                {sensor.status !== 'Optimal' && (
                  <button className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors">
                    Acknowledge Alert
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
