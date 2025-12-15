'use client'

import { useState } from 'react'
import { Leaf, Wind, Droplets, Recycle, Zap, TrendingDown, Award, TreeDeciduous, Sun } from 'lucide-react'

export default function SustainabilityPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const metrics = [
    { title: 'Carbon Footprint', value: '124.5', unit: 'tons CO2e', change: '-12%', icon: Wind, color: 'text-gray-600', bg: 'bg-gray-100' },
    { title: 'Energy Usage', value: '45,200', unit: 'kWh', change: '-8%', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { title: 'Water Saved', value: '1,205', unit: 'Gallons', change: '+15%', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Waste Diverted', value: '85', unit: '%', change: '+5%', icon: Recycle, color: 'text-green-600', bg: 'bg-green-100' },
  ]

  const initiatives = [
    { name: 'Solar Panel Installation', status: 'In Progress', progress: 75, impact: 'High' },
    { name: 'Plastic-Free Packaging', status: 'Completed', progress: 100, impact: 'Medium' },
    { name: 'EV Delivery Fleet', status: 'Planning', progress: 20, impact: 'High' },
    { name: 'Smart HVAC Optimization', status: 'Active', progress: 90, impact: 'Medium' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-600" />
              Sustainability Impact Tracker
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Monitor and optimize environmental performance across all stores.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Download Report
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
              <TreeDeciduous className="h-4 w-4" /> Offset Carbon
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
                <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                  metric.change.startsWith('-') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{metric.title}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</span>
                <span className="text-sm text-gray-500">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area (Simulated) */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Emissions Reduction Goals</h2>
              <div className="flex gap-2">
                {['1M', '6M', '1Y', 'ALL'].map(period => (
                  <button key={period} className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Simulated Chart */}
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 50, 30].map((h, i) => (
                <div key={i} className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-green-500/80 rounded-t-lg transition-all duration-500 group-hover:bg-green-500"
                    style={{ height: `${h}%` }}
                  ></div>
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h} tons
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-400 px-4">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>

          {/* Initiatives List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Active Initiatives</h2>
            <div className="space-y-6">
              {initiatives.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{item.status}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Impact: {item.impact}</span>
                    <span>{item.progress}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/50">
              <div className="flex items-start gap-3">
                <Sun className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-green-800 dark:text-green-300">Did you know?</h4>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    Switching to LED lighting in Store #4 reduced energy consumption by 18% last month.
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
