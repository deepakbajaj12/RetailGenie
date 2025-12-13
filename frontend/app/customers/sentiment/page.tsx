'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Smile, Meh, Frown, MessageCircle } from 'lucide-react'

const SENTIMENT_DATA = [
  { name: 'Positive', value: 65, color: '#22c55e' },
  { name: 'Neutral', value: 25, color: '#eab308' },
  { name: 'Negative', value: 10, color: '#ef4444' },
]

const KEYWORD_DATA = [
  { name: 'Quality', count: 120 },
  { name: 'Price', count: 85 },
  { name: 'Service', count: 70 },
  { name: 'Shipping', count: 45 },
  { name: 'Selection', count: 40 },
]

export default function SentimentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sentiment Analysis</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">AI analysis of customer feedback and reviews.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Overview */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">Overall Sentiment</h3>
          <div className="flex items-center justify-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SENTIMENT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SENTIMENT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Positive (65%)</span>
            </div>
            <div className="flex items-center gap-2">
              <Meh className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Neutral (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <Frown className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Negative (10%)</span>
            </div>
          </div>
        </div>

        {/* Common Keywords */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">Common Feedback Topics</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={KEYWORD_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Highlights */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">AI Insights</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <div className="flex gap-3">
              <Smile className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-300">Product Quality Praise</h4>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">Customers frequently mention "durability" and "premium feel" in recent reviews for Electronics category.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-300">Shipping Delays</h4>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">Spike in complaints regarding delivery times for orders placed on weekends. Suggest reviewing logistics partner.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
