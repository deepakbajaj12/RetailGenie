'use client'

import { useState } from 'react'
import { TrendingDown, TrendingUp, ExternalLink, Search } from 'lucide-react'

const COMPETITOR_DATA = [
  { 
    id: 1, 
    product: 'Wireless Noise Cancelling Headphones', 
    myPrice: 299.99, 
    competitors: [
      { name: 'Amazon', price: 289.00, trend: 'down' },
      { name: 'Best Buy', price: 299.99, trend: 'stable' },
      { name: 'Walmart', price: 295.50, trend: 'down' }
    ]
  },
  { 
    id: 2, 
    product: '4K Smart TV 55"', 
    myPrice: 450.00, 
    competitors: [
      { name: 'Amazon', price: 445.00, trend: 'stable' },
      { name: 'Best Buy', price: 460.00, trend: 'up' },
      { name: 'Target', price: 449.99, trend: 'stable' }
    ]
  },
  { 
    id: 3, 
    product: 'Gaming Console Pro', 
    myPrice: 499.99, 
    competitors: [
      { name: 'GameStop', price: 499.99, trend: 'stable' },
      { name: 'Amazon', price: 510.00, trend: 'up' },
      { name: 'Walmart', price: 499.00, trend: 'stable' }
    ]
  }
]

export default function CompetitorsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Competitor Price Monitoring</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Track market prices and stay competitive.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full max-w-sm rounded-lg border border-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-6">
        {COMPETITOR_DATA.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.product}</h3>
              <div className="mt-2 md:mt-0 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">Your Price:</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${item.myPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {item.competitors.map((comp, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-slate-100 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{comp.name}</p>
                    <a href="#" className="text-xs text-blue-500 hover:underline flex items-center mt-1">
                      View Listing <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      comp.price < item.myPrice ? 'text-red-500' : 'text-green-500'
                    }`}>
                      ${comp.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end text-xs text-slate-500">
                      {comp.trend === 'up' && <TrendingUp className="h-3 w-3 text-red-500 mr-1" />}
                      {comp.trend === 'down' && <TrendingDown className="h-3 w-3 text-green-500 mr-1" />}
                      {comp.trend === 'stable' && <span className="mr-1">-</span>}
                      {comp.trend === 'up' ? 'Rising' : comp.trend === 'down' ? 'Dropping' : 'Stable'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
