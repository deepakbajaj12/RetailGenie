'use client'

import { useState } from 'react'
import { Sparkles, Camera, Shirt, ShoppingBag, RefreshCw, Heart, Share2 } from 'lucide-react'

export default function AIStylistPage() {
  const [analyzing, setAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])

  const handleAnalyze = () => {
    setAnalyzing(true)
    // Simulate AI processing
    setTimeout(() => {
      setAnalyzing(false)
      setRecommendations([
        { id: 1, name: 'Vintage Denim Jacket', price: 89.99, match: 98, image: '🧥', reason: 'Matches your casual vibe' },
        { id: 2, name: 'White Canvas Sneakers', price: 59.99, match: 95, image: '👟', reason: 'Pairs perfectly with denim' },
        { id: 3, name: 'Striped Cotton Tee', price: 29.99, match: 88, image: '👕', reason: 'Trending this season' },
      ])
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              AI Personal Stylist
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Get personalized outfit recommendations based on your style</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Style Profile</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Upload a photo</p>
                  <p className="text-xs text-gray-500">or take a selfie</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Occasion</label>
                  <select className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                    <option>Casual Weekend</option>
                    <option>Business Professional</option>
                    <option>Date Night</option>
                    <option>Gym / Workout</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Style Preferences</label>
                  <div className="flex flex-wrap gap-2">
                    {['Minimalist', 'Streetwear', 'Vintage', 'Boho'].map(style => (
                      <span key={style} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Analyzing Style...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Look
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {recommendations.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recommended Outfit</h3>
                  <button className="text-purple-600 text-sm font-medium hover:underline">Save Look</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex gap-4 group">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                            <p className="text-sm text-purple-600 font-medium">{item.match}% Match</p>
                          </div>
                          <button className="text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 mb-3">{item.reason}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">${item.price}</span>
                          <button className="p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity">
                            <ShoppingBag className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Why this works</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Based on your preference for "Casual Weekend", our AI selected a classic denim-on-white combination. 
                        The vintage jacket adds character while keeping it relaxed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-12">
                <Shirt className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Ready to style?</p>
                <p className="text-sm">Upload a photo or select preferences to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
