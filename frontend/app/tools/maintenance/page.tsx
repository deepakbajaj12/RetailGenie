'use client'

import { useState } from 'react'
import { Wrench, Thermometer, Activity, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function MaintenancePage() {
  const [filter, setFilter] = useState('all')

  const equipment = [
    { id: 'EQ-101', name: 'Main Freezer A', type: 'Refrigeration', health: 92, status: 'good', lastService: '2024-01-15', nextService: '2024-07-15', prediction: 'Stable' },
    { id: 'EQ-102', name: 'HVAC Unit 3', type: 'Climate', health: 45, status: 'warning', lastService: '2023-11-20', nextService: '2024-05-20', prediction: 'Motor vibration detected' },
    { id: 'EQ-103', name: 'POS Terminal 4', type: 'Electronics', health: 98, status: 'good', lastService: '2024-02-10', nextService: '2024-08-10', prediction: 'Stable' },
    { id: 'EQ-104', name: 'Deli Slicer', type: 'Kitchen', health: 15, status: 'critical', lastService: '2023-12-01', nextService: '2024-03-01', prediction: 'Blade alignment failure imminent' },
    { id: 'EQ-105', name: 'Auto-Door Main', type: 'Infrastructure', health: 88, status: 'good', lastService: '2024-01-05', nextService: '2024-07-05', prediction: 'Stable' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Wrench className="h-8 w-8 text-orange-600" />
              Predictive Maintenance
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">AI-driven equipment health monitoring</p>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Service
          </button>
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Overall Health</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">87%</h3>
            <p className="text-gray-500 dark:text-gray-400">System Operational</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-sm text-gray-500">Critical Issues</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">1</h3>
            <p className="text-gray-500 dark:text-gray-400">Immediate Action Required</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Upcoming Service</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">3</h3>
            <p className="text-gray-500 dark:text-gray-400">Units due in 30 days</p>
          </div>
        </div>

        {/* Equipment List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex gap-4">
            {['all', 'good', 'warning', 'critical'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                  ${filter === status 
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}
                `}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {equipment
              .filter(eq => filter === 'all' || eq.status === filter)
              .map((eq) => (
              <div key={eq.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`
                      p-3 rounded-xl
                      ${eq.status === 'good' ? 'bg-green-100 text-green-600' : 
                        eq.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-red-100 text-red-600'}
                    `}>
                      {eq.type === 'Refrigeration' ? <Thermometer className="h-6 w-6" /> :
                       eq.type === 'Climate' ? <Activity className="h-6 w-6" /> :
                       <Wrench className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{eq.name}</h4>
                        <span className="text-xs font-mono text-gray-400">{eq.id}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{eq.type}</p>
                      
                      {eq.status !== 'good' && (
                        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg w-fit">
                          <AlertTriangle className="h-4 w-4" />
                          AI Insight: {eq.prediction}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Health Score</p>
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              eq.health > 90 ? 'bg-green-500' : 
                              eq.health > 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${eq.health}%` }}
                          ></div>
                        </div>
                        <span className="font-bold">{eq.health}%</span>
                      </div>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="text-xs text-gray-500">Next Service</p>
                      <p className="font-medium text-gray-900 dark:text-white">{eq.nextService}</p>
                    </div>

                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Wrench className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
