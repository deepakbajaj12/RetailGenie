'use client'

import { useState } from 'react'
import { Wifi, Thermometer, Activity, Zap, AlertOctagon, RefreshCw } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function IoTPage() {
  const [refreshing, setRefreshing] = useState(false)

  const tempData = [
    { time: '00:00', temp: 3.2 }, { time: '04:00', temp: 3.1 },
    { time: '08:00', temp: 3.5 }, { time: '12:00', temp: 4.1 },
    { time: '16:00', temp: 3.8 }, { time: '20:00', temp: 3.4 },
    { time: '23:59', temp: 3.2 },
  ]

  const trafficData = [
    { time: '8am', visitors: 12 }, { time: '10am', visitors: 45 },
    { time: '12pm', visitors: 89 }, { time: '2pm', visitors: 76 },
    { time: '4pm', visitors: 110 }, { time: '6pm', visitors: 95 },
    { time: '8pm', visitors: 34 },
  ]

  const sensors = [
    { id: 1, name: 'Freezer Unit A', type: 'Temperature', value: '-18°C', status: 'Normal', icon: Thermometer, color: 'text-blue-500' },
    { id: 2, name: 'Main Entrance', type: 'Foot Traffic', value: '45/hr', status: 'Active', icon: Activity, color: 'text-green-500' },
    { id: 3, name: 'Shelf A4 (Dairy)', type: 'Smart Shelf', value: '85%', status: 'Low Battery', icon: Wifi, color: 'text-yellow-500' },
    { id: 4, name: 'HVAC System', type: 'Energy', value: '2.4kW', status: 'Normal', icon: Zap, color: 'text-orange-500' },
  ]

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Wifi className="h-8 w-8 text-cyan-600" />
              IoT Sensor Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time monitoring of store environment and assets</p>
          </div>
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-all ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 ${sensor.color}`}>
                  <sensor.icon className="h-6 w-6" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sensor.status === 'Normal' || sensor.status === 'Active' ? 'bg-green-100 text-green-700' :
                  sensor.status === 'Low Battery' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {sensor.status}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{sensor.value}</h3>
              <p className="font-medium text-gray-700 dark:text-gray-300">{sensor.name}</p>
              <p className="text-sm text-gray-500">{sensor.type}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Temperature Monitor */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-blue-500" />
              Fridge Temperature (24h)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                  {/* Threshold Line */}
                  <Line type="monotone" dataKey={() => 5} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">Red dashed line indicates max safe temperature (5°C)</p>
          </div>

          {/* Foot Traffic */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Store Foot Traffic (Today)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="visitors" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
