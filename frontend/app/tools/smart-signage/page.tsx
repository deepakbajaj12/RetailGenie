'use client'

import { useState, useEffect } from 'react'
import { Monitor, Users, Smile, Frown, Meh, Play, Pause, Settings, BarChart3 } from 'lucide-react'

export default function SmartSignagePage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentAd, setCurrentAd] = useState('Default Playlist')
  const [detectedAudience, setDetectedAudience] = useState<any>(null)

  // Simulate audience detection
  useEffect(() => {
    const interval = setInterval(() => {
      const demographics = [
        { type: 'Young Adult (F)', mood: 'Happy', ad: 'Summer Fashion Sale' },
        { type: 'Family', mood: 'Neutral', ad: 'Back to School Deals' },
        { type: 'Senior (M)', mood: 'Focused', ad: 'Health & Wellness' },
        { type: 'Teenager', mood: 'Excited', ad: 'New Gaming Console' },
      ]
      const random = demographics[Math.floor(Math.random() * demographics.length)]
      setDetectedAudience(random)
      setCurrentAd(random.ad)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Monitor className="h-8 w-8 text-indigo-600" />
              Smart Digital Signage
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">AI-driven content adaptation based on real-time audience analytics</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configure Screens
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Stop Playback' : 'Start Playback'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative group border-4 border-gray-800">
              {/* Screen Content Simulation */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
                <div className="text-center p-12 animate-in fade-in zoom-in duration-700 key={currentAd}">
                  <h2 className="text-5xl font-black text-white mb-4 tracking-tight uppercase drop-shadow-lg">
                    {currentAd}
                  </h2>
                  <p className="text-2xl text-indigo-200 font-light">Special Offer Just for You</p>
                  <button className="mt-8 px-8 py-3 bg-white text-indigo-900 font-bold rounded-full text-xl hover:scale-105 transition-transform">
                    Scan to Redeem
                  </button>
                </div>
              </div>

              {/* Overlay Info */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Screen ID: MAIN-ENTRANCE-01
              </div>
            </div>

            {/* Analytics Strip */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Daily Impressions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">14,205</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Avg Dwell Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4.2s</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Conversion Est.</p>
                <p className="text-2xl font-bold text-green-600">3.8%</p>
              </div>
            </div>
          </div>

          {/* AI Detection Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Live Audience AI
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">Active</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                {detectedAudience ? (
                  <>
                    <div className="relative">
                      <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center animate-pulse">
                        {detectedAudience.mood === 'Happy' ? <Smile className="h-16 w-16 text-indigo-600" /> :
                         detectedAudience.mood === 'Sad' ? <Frown className="h-16 w-16 text-indigo-600" /> :
                         <Meh className="h-16 w-16 text-indigo-600" />}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                        {detectedAudience.mood}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Detected Profile</p>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{detectedAudience.type}</h4>
                    </div>

                    <div className="w-full px-8">
                      <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
                      <p className="text-xs text-gray-400 mb-2">Triggered Content</p>
                      <p className="font-medium text-indigo-600 dark:text-indigo-400">{detectedAudience.ad}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">Waiting for audience...</p>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                <p className="font-bold mb-1">Privacy Note:</p>
                No images are stored. Analysis is performed locally in real-time.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
