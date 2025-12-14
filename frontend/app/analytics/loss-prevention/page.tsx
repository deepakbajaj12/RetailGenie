'use client'

import { useState } from 'react'
import { ShieldAlert, Search, AlertTriangle, FileText, UserX, DollarSign } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

export default function LossPreventionPage() {
  const [timeRange, setTimeRange] = useState('30d')

  const shrinkageData = [
    { name: 'Theft (External)', value: 45, color: '#ef4444' },
    { name: 'Theft (Internal)', value: 25, color: '#f97316' },
    { name: 'Admin Error', value: 20, color: '#3b82f6' },
    { name: 'Vendor Fraud', value: 10, color: '#8b5cf6' },
  ]

  const suspiciousActivity = [
    { id: 1, type: 'Void Transaction', amount: 150.00, user: 'Reg 2', time: '10:45 AM', risk: 'High' },
    { id: 2, type: 'Manual Price Override', amount: 45.50, user: 'Reg 1', time: '11:20 AM', risk: 'Medium' },
    { id: 3, type: 'Refund w/o Receipt', amount: 89.99, user: 'Service Desk', time: '01:15 PM', risk: 'High' },
    { id: 4, type: 'Inventory Adjustment', amount: -200.00, user: 'Warehouse', time: '03:30 PM', risk: 'Low' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-red-600" />
              Loss Prevention
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor shrinkage and suspicious activities</p>
          </div>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Shrinkage Breakdown */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Shrinkage Sources</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shrinkageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {shrinkageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">Total Estimated Loss</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$1,245.00</p>
            </div>
          </div>

          {/* Suspicious Activity Log */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Flagged Transactions</h3>
              <button className="text-sm text-blue-600 hover:underline">View All Logs</button>
            </div>
            <div className="space-y-4">
              {suspiciousActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      item.risk === 'High' ? 'bg-red-100 text-red-600' :
                      item.risk === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.type}</h4>
                      <p className="text-sm text-gray-500">{item.user} • {item.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.amount < 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                      {item.amount < 0 ? '-' : ''}${Math.abs(item.amount).toFixed(2)}
                    </p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      item.risk === 'High' ? 'bg-red-100 text-red-700' :
                      item.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.risk} Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
