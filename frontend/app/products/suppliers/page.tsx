'use client'

import { useState } from 'react'
import { Truck, Star, Clock, DollarSign, AlertTriangle, CheckCircle, Filter, Search } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function SuppliersPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)

  const suppliers = [
    { 
      id: 1, 
      name: 'Global Electronics Ltd', 
      category: 'Electronics',
      rating: 4.8,
      onTime: 98,
      quality: 99,
      price: 85,
      status: 'Preferred'
    },
    { 
      id: 2, 
      name: 'FastFashion Wholesale', 
      category: 'Clothing',
      rating: 3.5,
      onTime: 75,
      quality: 88,
      price: 95,
      status: 'At Risk'
    },
    { 
      id: 3, 
      name: 'HomeGoods Direct', 
      category: 'Home & Garden',
      rating: 4.2,
      onTime: 92,
      quality: 90,
      price: 88,
      status: 'Active'
    },
  ]

  const performanceData = [
    { subject: 'On-Time Delivery', A: 98, B: 75, fullMark: 100 },
    { subject: 'Quality Control', A: 99, B: 88, fullMark: 100 },
    { subject: 'Price Competitiveness', A: 85, B: 95, fullMark: 100 },
    { subject: 'Communication', A: 90, B: 60, fullMark: 100 },
    { subject: 'Flexibility', A: 85, B: 70, fullMark: 100 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Truck className="h-8 w-8 text-indigo-600" />
              Supplier Scorecard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and rate supplier performance</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Search className="h-4 w-4" />
              Find Supplier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Supplier List */}
          <div className="lg:col-span-2 space-y-4">
            {suppliers.map((supplier) => (
              <div 
                key={supplier.id}
                onClick={() => setSelectedSupplier(supplier.name)}
                className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border transition-all cursor-pointer ${
                  selectedSupplier === supplier.name 
                    ? 'border-indigo-500 ring-1 ring-indigo-500' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <Truck className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">{supplier.category}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-medium">{supplier.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                          <Clock className="h-3 w-3" />
                          {supplier.onTime}% On-Time
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    supplier.status === 'Preferred' ? 'bg-green-100 text-green-700' :
                    supplier.status === 'At Risk' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {supplier.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Performance Analysis</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Global Electronics" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                  <Radar name="FastFashion" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                Global Electronics is your top performer this month.
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300">
                <AlertTriangle className="h-5 w-5" />
                FastFashion delivery times have dropped by 15%.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
