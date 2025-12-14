'use client'

import { useState } from 'react'
import { Leaf, Recycle, Zap, Droplets, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function SustainabilityPage() {
  const energyData = [
    { month: 'Jan', kwh: 4500 },
    { month: 'Feb', kwh: 4200 },
    { month: 'Mar', kwh: 3800 },
    { month: 'Apr', kwh: 3500 },
    { month: 'May', kwh: 3200 },
    { month: 'Jun', kwh: 3600 },
  ]

  const wasteData = [
    { type: 'Plastic', amount: 120 },
    { type: 'Paper', amount: 250 },
    { type: 'Organic', amount: 80 },
    { type: 'Glass', amount: 45 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-600" />
              Sustainability Tracker
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor environmental impact and ESG goals</p>
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Carbon Footprint: -15% YTD
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Energy Usage</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3,200 kWh</h3>
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium">-8% vs last month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Droplets className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Water Saved</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1,500 L</h3>
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium">+12% efficiency</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <Recycle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Recycled Waste</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">450 kg</h3>
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium">85% diversion rate</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Carbon Offset</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2.5 Tons</h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium">Via tree planting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Energy Trend */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Energy Consumption Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="kwh" stroke="#eab308" fill="#eab308" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waste Breakdown */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Waste Composition</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} name="Amount (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
