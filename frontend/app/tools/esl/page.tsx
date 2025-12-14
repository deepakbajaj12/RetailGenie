'use client'

import { useState } from 'react'
import { Tag, Wifi, Battery, RefreshCw, Search, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react'

export default function ESLManagerPage() {
  const [syncing, setSyncing] = useState(false)

  const labels = [
    { id: 'ESL-001', product: 'Organic Bananas', price: 2.99, battery: 85, signal: 'strong', status: 'synced' },
    { id: 'ESL-002', product: 'Sourdough Bread', price: 5.49, battery: 92, signal: 'strong', status: 'synced' },
    { id: 'ESL-003', product: 'Almond Milk', price: 4.29, battery: 15, signal: 'weak', status: 'warning' },
    { id: 'ESL-004', product: 'Greek Yogurt', price: 1.99, battery: 78, signal: 'strong', status: 'error' },
    { id: 'ESL-005', product: 'Avocados (Pack)', price: 6.99, battery: 64, signal: 'medium', status: 'synced' },
    { id: 'ESL-006', product: 'Coffee Beans', price: 12.99, battery: 45, signal: 'strong', status: 'synced' },
  ]

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Tag className="h-8 w-8 text-indigo-600" />
              Smart Shelf Labels
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage electronic pricing displays</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync All Prices'}
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Wifi className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Online Labels</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,245 / 1,250</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Battery className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Low Battery</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sync Errors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </div>

        {/* Label Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by product or ID..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">All</button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">Errors</button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">Low Battery</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {labels.map((label) => (
              <div key={label.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-900/50">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-gray-400">{label.id}</span>
                  <div className={`
                    flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${label.status === 'synced' ? 'bg-green-100 text-green-700' : 
                      label.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}
                  `}>
                    {label.status === 'synced' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    {label.status}
                  </div>
                </div>

                {/* Digital Display Simulation */}
                <div className="bg-white dark:bg-gray-800 border-4 border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-red-500 border-r-transparent transform rotate-0"></div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{label.product}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">${label.price}</span>
                    <span className="text-xs text-gray-500 mb-1">/ unit</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                    <span>QR: 89234</span>
                    <span>•</span>
                    <span>Stock: 45</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1" title="Battery Level">
                      <Battery className={`h-4 w-4 ${label.battery < 20 ? 'text-red-500' : 'text-gray-400'}`} />
                      <span>{label.battery}%</span>
                    </div>
                    <div className="flex items-center gap-1" title="Signal Strength">
                      <Wifi className="h-4 w-4 text-gray-400" />
                      <span>{label.signal}</span>
                    </div>
                  </div>
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Flash LED to locate">
                    <Lightbulb className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
