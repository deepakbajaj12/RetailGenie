'use client'

import { useState } from 'react'
import { Monitor, Play, Pause, Clock, Image as ImageIcon, Video, Calendar, Layout } from 'lucide-react'

export default function WindowDisplayPage() {
  const [activeScene, setActiveScene] = useState('morning-rush')
  const [isPlaying, setIsPlaying] = useState(true)

  const scenes = [
    { id: 'morning-rush', name: 'Morning Rush', type: 'Dynamic', duration: '06:00 - 10:00', thumbnail: 'bg-orange-100' },
    { id: 'lunch-special', name: 'Lunch Special', type: 'Video Loop', duration: '11:00 - 14:00', thumbnail: 'bg-green-100' },
    { id: 'afternoon-chill', name: 'Afternoon Chill', type: 'Playlist', duration: '14:00 - 17:00', thumbnail: 'bg-blue-100' },
    { id: 'evening-sale', name: 'Evening Flash Sale', type: 'Interactive', duration: '17:00 - 21:00', thumbnail: 'bg-purple-100' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Monitor className="h-8 w-8 text-pink-600" />
              Interactive Window Display
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Control storefront digital signage and interactive experiences.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">System Online</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Preview Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black rounded-2xl aspect-video relative overflow-hidden shadow-2xl border-8 border-gray-800">
              {/* Simulated Screen Content */}
              <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-1000 ${
                activeScene === 'morning-rush' ? 'bg-gradient-to-br from-orange-400 to-red-500' :
                activeScene === 'lunch-special' ? 'bg-gradient-to-br from-green-400 to-emerald-600' :
                activeScene === 'afternoon-chill' ? 'bg-gradient-to-br from-blue-400 to-indigo-600' :
                'bg-gradient-to-br from-purple-500 to-pink-600'
              }`}>
                <div className="text-center text-white p-12">
                  <h2 className="text-6xl font-black mb-4 drop-shadow-lg">
                    {scenes.find(s => s.id === activeScene)?.name}
                  </h2>
                  <p className="text-2xl opacity-90 font-light">
                    {activeScene === 'morning-rush' ? 'Start your day with fresh coffee ☕' :
                     activeScene === 'lunch-special' ? 'Fresh salads & sandwiches ready to go 🥗' :
                     activeScene === 'afternoon-chill' ? 'Relax with our premium tea selection 🍵' :
                     '50% OFF all bakery items until close! 🥐'}
                  </p>
                  
                  {/* Simulated Interactive Element */}
                  <div className="mt-12 animate-bounce">
                    <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-8 py-3 border border-white/30">
                      <p className="text-lg font-medium">Scan QR to Order Ahead</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex justify-between items-end">
                <div className="text-white">
                  <p className="text-xs uppercase tracking-wider opacity-70">Now Playing</p>
                  <p className="font-bold text-lg">{scenes.find(s => s.id === activeScene)?.name}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 transition-colors flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300">
                <Layout className="h-6 w-6" />
                <span className="text-sm font-medium">Layout Editor</span>
              </button>
              <button className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 transition-colors flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar className="h-6 w-6" />
                <span className="text-sm font-medium">Schedule</span>
              </button>
              <button className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 transition-colors flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300">
                <Video className="h-6 w-6" />
                <span className="text-sm font-medium">Media Library</span>
              </button>
              <button className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 transition-colors flex flex-col items-center gap-2 text-red-600">
                <Monitor className="h-6 w-6" />
                <span className="text-sm font-medium">Emergency Stop</span>
              </button>
            </div>
          </div>

          {/* Scene Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              Daily Schedule
            </h3>
            <div className="space-y-4">
              {scenes.map((scene) => (
                <div 
                  key={scene.id}
                  onClick={() => setActiveScene(scene.id)}
                  className={`group cursor-pointer p-3 rounded-xl border-2 transition-all ${
                    activeScene === scene.id 
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' 
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-16 h-16 rounded-lg ${scene.thumbnail} flex items-center justify-center shrink-0`}>
                      {scene.type === 'Video Loop' ? <Video className="h-6 w-6 opacity-50" /> :
                       scene.type === 'Interactive' ? <Layout className="h-6 w-6 opacity-50" /> :
                       <ImageIcon className="h-6 w-6 opacity-50" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 dark:text-white truncate">{scene.name}</h4>
                        {activeScene === scene.id && (
                          <span className="flex h-2 w-2 rounded-full bg-pink-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{scene.duration}</p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                        {scene.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Device Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Main Display (4K)</span>
                    <span className="text-green-600 font-medium">Online • 32°C</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Side Panel (1080p)</span>
                    <span className="text-green-600 font-medium">Online • 30°C</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Interactive Kiosk</span>
                    <span className="text-green-600 font-medium">Online • 34°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
