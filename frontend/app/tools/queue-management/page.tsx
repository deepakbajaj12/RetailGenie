'use client'

import { useState, useEffect } from 'react'
import { Users, Clock, Smartphone, CheckCircle, ArrowRight, Bell, Coffee } from 'lucide-react'

export default function QueueManagementPage() {
  const [queue, setQueue] = useState([
    { id: 'A-101', name: 'John Doe', service: 'Returns', waitTime: 5, status: 'Next' },
    { id: 'A-102', name: 'Jane Smith', service: 'Pickup', waitTime: 12, status: 'Waiting' },
    { id: 'A-103', name: 'Mike Johnson', service: 'Consultation', waitTime: 25, status: 'Waiting' },
    { id: 'A-104', name: 'Sarah Williams', service: 'Returns', waitTime: 32, status: 'Waiting' },
  ])

  const [counters, setCounters] = useState([
    { id: 1, status: 'Busy', serving: 'A-100', type: 'General' },
    { id: 2, status: 'Available', serving: null, type: 'Returns' },
    { id: 3, status: 'Busy', serving: 'A-099', type: 'Pickup' },
  ])

  // Simulate queue movement
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(prev => prev.map(q => ({
        ...q,
        waitTime: Math.max(0, q.waitTime - 1)
      })))
    }, 60000) // Decrease wait time every minute
    return () => clearInterval(interval)
  }, [])

  const handleCallNext = (counterId: number) => {
    // Logic to move next person to counter would go here
    alert(`Calling next customer to Counter ${counterId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Smart Queue System
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Virtual queuing and wait time management.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Avg Wait Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">14 min</p>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">In Queue</p>
              <p className="text-2xl font-bold text-blue-600">{queue.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Counter Status */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Service Counters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {counters.map((counter) => (
                <div key={counter.id} className={`p-6 rounded-2xl border-2 transition-all ${
                  counter.status === 'Available' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-lg">Counter {counter.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                      counter.status === 'Available' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {counter.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{counter.type}</p>
                  <div className="text-2xl font-bold mb-4">
                    {counter.serving || '--'}
                  </div>
                  <button 
                    onClick={() => handleCallNext(counter.id)}
                    className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${
                      counter.status === 'Available'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={counter.status !== 'Available'}
                  >
                    Call Next
                  </button>
                </div>
              ))}
            </div>

            {/* Queue List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-lg">Waiting List</h3>
                <button className="text-blue-600 text-sm font-bold hover:underline">+ Add Walk-in</button>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {queue.map((person) => (
                  <div key={person.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        person.status === 'Next' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {person.id.split('-')[1]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{person.name}</p>
                        <p className="text-xs text-gray-500">{person.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1 justify-end">
                          <Clock className="h-3 w-3 text-gray-400" /> {person.waitTime} min
                        </p>
                        <p className="text-xs text-gray-500">Est. Wait</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                        <Bell className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile View Preview */}
          <div className="bg-gray-900 rounded-[2.5rem] p-4 border-8 border-gray-800 shadow-2xl max-w-xs mx-auto h-fit">
            <div className="bg-white h-full rounded-[1.5rem] overflow-hidden flex flex-col relative">
              <div className="bg-blue-600 p-6 text-white text-center pt-12">
                <h3 className="font-bold text-lg">Your Ticket</h3>
                <p className="text-blue-100 text-sm">RetailGenie Store #1</p>
              </div>
              <div className="flex-1 p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-gray-900">A-105</span>
                </div>
                <p className="text-gray-500 mb-1">Your position in line</p>
                <h4 className="text-4xl font-bold text-blue-600 mb-6">5th</h4>
                
                <div className="w-full bg-blue-50 p-4 rounded-xl mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Est. Wait</span>
                    <span className="font-bold">~18 min</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-auto">
                  We'll send you a notification when it's your turn. Feel free to browse the store!
                </p>
              </div>
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
