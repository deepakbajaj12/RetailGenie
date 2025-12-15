'use client'

import { useState, useEffect } from 'react'
import { Smile, Frown, Meh, Activity, Users, Camera, BarChart3 } from 'lucide-react'

export default function SentimentAnalysisPage() {
  const [overallMood, setOverallMood] = useState(78) // 0-100
  const [faces, setFaces] = useState([
    { id: 1, x: 20, y: 30, mood: 'Happy', score: 0.9, age: '25-34' },
    { id: 2, x: 60, y: 45, mood: 'Neutral', score: 0.5, age: '45-54' },
    { id: 3, x: 40, y: 70, mood: 'Happy', score: 0.8, age: '18-24' },
  ])

  // Simulate live analysis
  useEffect(() => {
    const interval = setInterval(() => {
      // Update overall mood slightly
      setOverallMood(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5)))

      // Move faces and change expressions randomly
      setFaces(prev => prev.map(face => ({
        ...face,
        x: Math.max(10, Math.min(90, face.x + (Math.random() - 0.5) * 10)),
        y: Math.max(10, Math.min(90, face.y + (Math.random() - 0.5) * 10)),
        mood: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Happy' : 'Neutral') : face.mood,
        score: Math.random()
      })))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getMoodColor = (mood: string) => {
    if (mood === 'Happy') return 'text-green-500 border-green-500 bg-green-500/20'
    if (mood === 'Neutral') return 'text-yellow-500 border-yellow-500 bg-yellow-500/20'
    return 'text-red-500 border-red-500 bg-red-500/20'
  }

  const getMoodIcon = (mood: string) => {
    if (mood === 'Happy') return <Smile className="h-4 w-4" />
    if (mood === 'Neutral') return <Meh className="h-4 w-4" />
    return <Frown className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Smile className="h-8 w-8 text-pink-600" />
              Customer Sentiment AI
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Real-time emotion recognition and store atmosphere analysis.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold">Store Mood Score</p>
                <p className={`text-2xl font-bold ${overallMood > 70 ? 'text-green-500' : overallMood > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {overallMood.toFixed(0)}/100
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${overallMood > 70 ? 'bg-green-100 text-green-600' : overallMood > 40 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                {overallMood > 70 ? <Smile className="h-6 w-6" /> : overallMood > 40 ? <Meh className="h-6 w-6" /> : <Frown className="h-6 w-6" />}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Feed Simulation */}
          <div className="lg:col-span-2 bg-black rounded-2xl overflow-hidden relative aspect-video shadow-2xl border-4 border-gray-800">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
            
            {/* AI Overlays */}
            {faces.map((face) => (
              <div 
                key={face.id}
                className={`absolute w-24 h-24 border-2 rounded-lg transition-all duration-1000 ease-in-out flex flex-col items-center justify-end pb-2 ${getMoodColor(face.mood)}`}
                style={{ left: `${face.x}%`, top: `${face.y}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap flex items-center gap-1 backdrop-blur-sm">
                  {getMoodIcon(face.mood)}
                  {face.mood} {(face.score * 100).toFixed(0)}%
                </div>
              </div>
            ))}

            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              LIVE FEED • CAM-01 (ENTRANCE)
            </div>
          </div>

          {/* Analytics Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Hourly Breakdown
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Happy</span>
                    <span className="font-bold text-green-600">65%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Neutral</span>
                    <span className="font-bold text-yellow-600">25%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Frustrated</span>
                    <span className="font-bold text-red-600">10%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Demographics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Top Age Group</p>
                  <p className="font-bold text-gray-900 dark:text-white">25-34</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Gender Split</p>
                  <p className="font-bold text-gray-900 dark:text-white">60% F / 40% M</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex gap-3">
                <Activity className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Insight</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Customer happiness drops by 15% when queue times exceed 4 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
