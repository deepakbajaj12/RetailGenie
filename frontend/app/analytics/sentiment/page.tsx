'use client'

import { useState } from 'react'
import { MessageSquare, ThumbsUp, ThumbsDown, TrendingUp, Smile, Meh, Frown, Share2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function SentimentPage() {
  const [timeRange, setTimeRange] = useState('7d')

  const sentimentData = [
    { name: 'Positive', value: 65, color: '#22c55e' },
    { name: 'Neutral', value: 25, color: '#94a3b8' },
    { name: 'Negative', value: 10, color: '#ef4444' },
  ]

  const trendData = [
    { day: 'Mon', positive: 40, negative: 5 },
    { day: 'Tue', positive: 35, negative: 8 },
    { day: 'Wed', positive: 50, negative: 4 },
    { day: 'Thu', positive: 45, negative: 6 },
    { day: 'Fri', positive: 60, negative: 3 },
    { day: 'Sat', positive: 75, negative: 2 },
    { day: 'Sun', positive: 70, negative: 4 },
  ]

  const mentions = [
    { id: 1, user: '@sarah_shopper', platform: 'Twitter', text: 'Just tried the new self-checkout at RetailGenie. Super fast! 🚀', sentiment: 'positive', time: '2h ago' },
    { id: 2, user: 'Mike D.', platform: 'Facebook', text: 'Store was clean but out of stock on organic milk again.', sentiment: 'neutral', time: '4h ago' },
    { id: 3, user: 'Karen W.', platform: 'Yelp', text: 'Waited 20 mins for assistance in electronics. Not happy.', sentiment: 'negative', time: '1d ago' },
    { id: 4, user: '@tech_guru', platform: 'Instagram', text: 'Love the new layout! #RetailGenie #Shopping', sentiment: 'positive', time: '1d ago' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-pink-600" />
              Customer Sentiment
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Social listening and feedback analysis</p>
          </div>
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range 
                    ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Smile className="h-6 w-6 text-green-600" />
              </div>
              <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" /> +5.2%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">85%</h3>
            <p className="text-gray-500 dark:text-gray-400">Positive Sentiment Score</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-gray-500 text-sm">Total Volume</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">1,248</h3>
            <p className="text-gray-500 dark:text-gray-400">Mentions & Reviews</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-gray-500 text-sm">Avg Response Time</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">2.5h</h3>
            <p className="text-gray-500 dark:text-gray-400">Customer Service Speed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trend Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Sentiment Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Mentions Feed */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Mentions</h3>
              <div className="space-y-6">
                {mentions.map((mention) => (
                  <div key={mention.id} className="flex gap-4 pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${mention.sentiment === 'positive' ? 'bg-green-100 text-green-600' : 
                        mention.sentiment === 'negative' ? 'bg-red-100 text-red-600' : 
                        'bg-gray-100 text-gray-600'}
                    `}>
                      {mention.sentiment === 'positive' ? <ThumbsUp className="h-5 w-5" /> :
                       mention.sentiment === 'negative' ? <ThumbsDown className="h-5 w-5" /> :
                       <Meh className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white mr-2">{mention.user}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            {mention.platform}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{mention.time}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        "{mention.text}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Sentiment Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Overall Sentiment</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">Based on 1,248 analyzed posts</p>
              </div>
            </div>

            {/* Top Keywords */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {['#RetailGenie', 'Checkout', 'Service', 'Cleanliness', 'Prices', 'App', 'Returns'].map((tag, idx) => (
                  <span 
                    key={idx}
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium border
                      ${idx % 3 === 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        idx % 3 === 1 ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                        'bg-gray-50 text-gray-700 border-gray-200'}
                    `}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
