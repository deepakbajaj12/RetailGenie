'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Zap, Lock, Unlock, RefreshCw, AlertCircle } from 'lucide-react'

export default function DynamicPricingPage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Premium Wireless Headphones', basePrice: 299.99, currentPrice: 299.99, stock: 45, demand: 'High', elasticity: 0.8, locked: false },
    { id: 2, name: 'Organic Coffee Beans (1lb)', basePrice: 18.50, currentPrice: 18.50, stock: 120, demand: 'Normal', elasticity: 0.4, locked: false },
    { id: 3, name: 'Smart Home Hub', basePrice: 129.00, currentPrice: 115.00, stock: 200, demand: 'Low', elasticity: 1.2, locked: false },
    { id: 4, name: '4K Gaming Monitor', basePrice: 499.00, currentPrice: 549.00, stock: 12, demand: 'Very High', elasticity: 0.6, locked: true },
    { id: 5, name: 'Ergonomic Office Chair', basePrice: 350.00, currentPrice: 350.00, stock: 8, demand: 'High', elasticity: 0.9, locked: false },
  ])

  const [isAutoPilot, setIsAutoPilot] = useState(true)

  // Simulate market fluctuations
  useEffect(() => {
    if (!isAutoPilot) return

    const interval = setInterval(() => {
      setProducts(prev => prev.map(product => {
        if (product.locked) return product

        const volatility = Math.random() * 0.05 // 5% max change
        const direction = Math.random() > 0.5 ? 1 : -1
        
        // Adjust price based on demand and random market noise
        let demandFactor = 1
        if (product.demand === 'Very High') demandFactor = 1.02
        if (product.demand === 'Low') demandFactor = 0.98

        const newPrice = product.currentPrice * (1 + (volatility * direction * product.elasticity)) * demandFactor
        
        // Clamp price within 20% of base
        const minPrice = product.basePrice * 0.8
        const maxPrice = product.basePrice * 1.5
        
        return {
          ...product,
          currentPrice: Math.max(minPrice, Math.min(maxPrice, newPrice))
        }
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [isAutoPilot])

  const toggleLock = (id: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, locked: !p.locked } : p))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-500" />
              Dynamic Pricing Engine
            </h1>
            <p className="text-gray-500 dark:text-gray-400">AI-driven real-time price optimization.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className={`text-sm font-bold ${isAutoPilot ? 'text-green-500' : 'text-gray-500'}`}>
                Auto-Pilot {isAutoPilot ? 'ON' : 'OFF'}
              </span>
              <button 
                onClick={() => setIsAutoPilot(!isAutoPilot)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isAutoPilot ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isAutoPilot ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Demand</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Live Price</th>
                <th className="p-4">Trend</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.map((product) => {
                const priceDiff = product.currentPrice - product.basePrice
                const percentDiff = (priceDiff / product.basePrice) * 100
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.demand === 'Very High' ? 'bg-red-100 text-red-600' :
                        product.demand === 'High' ? 'bg-orange-100 text-orange-600' :
                        product.demand === 'Low' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {product.demand}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{product.stock} units</td>
                    <td className="p-4 text-gray-500">${product.basePrice.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${
                          priceDiff > 0 ? 'text-green-600' : 
                          priceDiff < 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'
                        }`}>
                          ${product.currentPrice.toFixed(2)}
                        </span>
                        {product.locked && <Lock className="h-3 w-3 text-gray-400" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-1 text-xs font-bold ${
                        priceDiff > 0 ? 'text-green-600' : 
                        priceDiff < 0 ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        {priceDiff > 0 ? <TrendingUp className="h-4 w-4" /> : 
                         priceDiff < 0 ? <TrendingDown className="h-4 w-4" /> : null}
                        {Math.abs(percentDiff).toFixed(1)}%
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => toggleLock(product.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
                        title={product.locked ? "Unlock Price" : "Lock Price"}
                      >
                        {product.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-blue-900 dark:text-blue-100">Revenue Optimization</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Current pricing strategy is projected to increase daily revenue by <strong>12.4%</strong> compared to static pricing.
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <RefreshCw className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-purple-900 dark:text-purple-100">Competitor Sync</h3>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Last sync 2 mins ago. 3 products adjusted to match competitor flash sales.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-green-900 dark:text-green-100">Margin Protection</h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Minimum margin rules are active. No prices will drop below cost + 15%.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
