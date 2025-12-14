'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Clock, AlertCircle, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function DynamicPricingPage() {
  const [selectedProduct, setSelectedProduct] = useState('Organic Milk')

  const products = [
    { 
      id: 1, 
      name: 'Organic Milk', 
      currentPrice: 4.50, 
      suggestedPrice: 4.85,
      elasticity: 'High',
      demand: 'Rising',
      reason: 'Morning Rush + Low Stock'
    },
    { 
      id: 2, 
      name: 'Fresh Bread', 
      currentPrice: 3.00, 
      suggestedPrice: 2.50,
      elasticity: 'Medium',
      demand: 'Falling',
      reason: 'Approaching Expiry (2 days)'
    },
    { 
      id: 3, 
      name: 'Avocados', 
      currentPrice: 1.99, 
      suggestedPrice: 2.25,
      elasticity: 'Low',
      demand: 'Stable',
      reason: 'Competitor Price Increase'
    },
  ]

  const priceHistory = [
    { time: '08:00', price: 4.20, demand: 80 },
    { time: '10:00', price: 4.50, demand: 95 },
    { time: '12:00', price: 4.85, demand: 110 },
    { time: '14:00', price: 4.60, demand: 85 },
    { time: '16:00', price: 4.50, demand: 70 },
    { time: '18:00', price: 4.75, demand: 100 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-500" />
              Dynamic Pricing Engine
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">AI-driven real-time price optimization</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-600">Engine Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="space-y-4">
            {products.map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product.name)}
                className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${
                  selectedProduct === product.name 
                    ? 'border-yellow-500 ring-1 ring-yellow-500' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{product.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.demand === 'Rising' ? 'bg-green-100 text-green-700' :
                    product.demand === 'Falling' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {product.demand} Demand
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Current</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">${product.currentPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Suggested</p>
                    <p className={`text-lg font-bold flex items-center gap-1 ${
                      product.suggestedPrice > product.currentPrice ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${product.suggestedPrice.toFixed(2)}
                      {product.suggestedPrice > product.currentPrice ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {product.reason}
                </p>
              </div>
            ))}
          </div>

          {/* Analytics Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Price vs Demand Analysis: {selectedProduct}</h3>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium">
                Apply Suggestion
              </button>
            </div>
            
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" domain={[4, 5]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="stepAfter" dataKey="price" stroke="#eab308" strokeWidth={3} name="Price ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} name="Demand Index" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Price Elasticity</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">-1.5</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Competitor Avg</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">$4.65</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Margin Impact</p>
                <p className="text-xl font-bold text-green-600">+12%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
