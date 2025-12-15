'use client'

import { useState } from 'react'
import { Recycle, Wrench, RefreshCw, CheckCircle, Clock, Package, ArrowRight, Search } from 'lucide-react'

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('returns')
  const [searchId, setSearchId] = useState('')

  const returns = [
    { id: 'RET-8921', customer: 'Alice Cooper', item: 'Denim Jacket', reason: 'Size too small', status: 'Approved', condition: 'New' },
    { id: 'RET-8922', customer: 'Bob Wilson', item: 'Running Shoes', reason: 'Defective', status: 'Inspection', condition: 'Used' },
  ]

  const repairs = [
    { id: 'REP-401', customer: 'Charlie Brown', item: 'Leather Bag', issue: 'Broken Strap', status: 'In Progress', eta: '2 days' },
    { id: 'REP-402', customer: 'Diana Prince', item: 'Watch', issue: 'Battery Replacement', status: 'Completed', eta: 'Ready' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Recycle className="h-8 w-8 text-green-600" />
              Circular Economy Hub
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Manage returns, repairs, and recycling programs.</p>
          </div>
          <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setActiveTab('returns')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === 'returns' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Returns
            </button>
            <button 
              onClick={() => setActiveTab('repairs')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === 'repairs' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Repairs
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Scan Order ID or Enter Customer Name..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">
            Process New
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'returns' ? (
              <>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" /> Recent Returns
                </h2>
                {returns.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{item.item}</h3>
                        <p className="text-sm text-gray-500">{item.id} • {item.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-1 ${
                        item.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </span>
                      <p className="text-xs text-gray-500">Reason: {item.reason}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <Wrench className="h-5 w-5" /> Active Repairs
                </h2>
                {repairs.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{item.item}</h3>
                        <p className="text-sm text-gray-500">{item.issue}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-bold text-gray-900 dark:text-white">{item.eta}</span>
                      </div>
                      <p className="text-xs text-blue-600 font-medium">{item.status}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Stats / Impact */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Recycle className="h-5 w-5" /> Environmental Impact
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-green-100 text-sm">Items Resold</p>
                  <p className="text-3xl font-bold">1,240</p>
                </div>
                <div>
                  <p className="text-green-100 text-sm">Waste Diverted</p>
                  <p className="text-3xl font-bold">450 kg</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-left text-sm font-medium transition-colors flex justify-between items-center group">
                  Print Return Label
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </button>
                <button className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-left text-sm font-medium transition-colors flex justify-between items-center group">
                  Schedule Repair Pickup
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </button>
                <button className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-left text-sm font-medium transition-colors flex justify-between items-center group">
                  View Policy Guidelines
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
