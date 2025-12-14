'use client'

import { useState } from 'react'
import { Building2, TrendingUp, Users, AlertTriangle, MapPin, ArrowRight, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function HQDashboardPage() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions')

  const stores = [
    { id: 1, name: 'Downtown Flagship', region: 'North', sales: 125000, growth: 12, status: 'healthy' },
    { id: 2, name: 'Westside Mall', region: 'West', sales: 85000, growth: -5, status: 'warning' },
    { id: 3, name: 'Airport Kiosk', region: 'North', sales: 45000, growth: 8, status: 'healthy' },
    { id: 4, name: 'Suburban Plaza', region: 'South', sales: 92000, growth: 15, status: 'healthy' },
  ]

  const performanceData = [
    { name: 'Downtown', sales: 125, traffic: 85 },
    { name: 'Westside', sales: 85, traffic: 92 },
    { name: 'Airport', sales: 45, traffic: 120 },
    { name: 'Suburban', sales: 92, traffic: 65 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              Multi-Store HQ
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Global operations overview</p>
          </div>
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option>All Regions</option>
            <option>North</option>
            <option>South</option>
            <option>West</option>
            <option>East</option>
          </select>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: '$347k', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'Active Stores', value: '4', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Total Staff', value: '142', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
            { label: 'Critical Alerts', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.bg} dark:bg-opacity-20`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Store List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Store Performance</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {stores.map((store) => (
                <div key={store.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${store.status === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{store.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {store.region} Region
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">${store.sales.toLocaleString()}</p>
                    <p className={`text-sm font-medium ${store.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {store.growth >= 0 ? '+' : ''}{store.growth}% vs last month
                    </p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Comparative Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue vs Traffic</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="sales" name="Revenue (k)" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="traffic" name="Traffic (100s)" fill="#9333EA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-1">Insight</h4>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Westside Mall has high traffic but lower conversion. Consider running a promotion or staff training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
