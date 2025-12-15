'use client'

import { useState } from 'react'
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, User, Calendar, Star } from 'lucide-react'

export default function ConciergePage() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)

  const experts = [
    { id: 1, name: 'Emma Stone', role: 'Fashion Stylist', rating: 4.9, status: 'Available', image: '👩‍💼' },
    { id: 2, name: 'David Chen', role: 'Tech Specialist', rating: 4.8, status: 'Busy', image: '👨‍💻' },
    { id: 3, name: 'Sarah Jones', role: 'Interior Designer', rating: 5.0, status: 'Available', image: '👩‍🎨' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Virtual Concierge</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Connect instantly with our product experts for personalized advice.</p>
        </div>

        {isCallActive ? (
          <div className="max-w-4xl mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl relative aspect-video animate-in zoom-in duration-300">
            {/* Main Video Feed (Expert) */}
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center text-6xl mb-4 mx-auto">
                  👩‍💼
                </div>
                <h2 className="text-2xl font-bold text-white">Emma Stone</h2>
                <p className="text-gray-400">Fashion Stylist</p>
                <div className="mt-8 flex items-center justify-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Connected 00:42</span>
                </div>
              </div>
            </div>

            {/* Self View */}
            <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-900 rounded-xl border-2 border-gray-700 overflow-hidden shadow-lg">
              {cameraOn ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                  <User className="h-12 w-12" />
                </div>
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-gray-600">
                  <VideoOff className="h-8 w-8" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/80 backdrop-blur px-6 py-3 rounded-2xl border border-gray-700">
              <button 
                onClick={() => setMicOn(!micOn)}
                className={`p-4 rounded-full transition-colors ${micOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500/20 text-red-500'}`}
              >
                {micOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
              </button>
              <button 
                onClick={() => setCameraOn(!cameraOn)}
                className={`p-4 rounded-full transition-colors ${cameraOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500/20 text-red-500'}`}
              >
                {cameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
              </button>
              <button 
                onClick={() => setIsCallActive(false)}
                className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.map((expert) => (
              <div key={expert.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl">
                    {expert.image}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    expert.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {expert.status}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{expert.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-3">{expert.role}</p>
                
                <div className="flex items-center gap-1 text-yellow-500 mb-6">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-bold text-gray-900 dark:text-white">{expert.rating}</span>
                  <span className="text-gray-400 text-sm">(120+ calls)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" /> Schedule
                  </button>
                  <button 
                    onClick={() => setIsCallActive(true)}
                    disabled={expert.status !== 'Available'}
                    className={`py-2 px-4 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                      expert.status === 'Available' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Video className="h-4 w-4" /> Call Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
