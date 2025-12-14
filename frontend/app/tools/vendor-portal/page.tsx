'use client'

import { useState } from 'react'
import { Truck, Package, FileText, CheckCircle, AlertCircle, Calendar, Download, Filter } from 'lucide-react'

export default function VendorPortalPage() {
  const [activeTab, setActiveTab] = useState('orders')

  const orders = [
    { id: 'PO-2024-001', date: '2024-03-15', items: 12, total: '$4,500.00', status: 'pending', priority: 'high' },
    { id: 'PO-2024-002', date: '2024-03-14', items: 45, total: '$12,250.00', status: 'shipped', priority: 'normal' },
    { id: 'PO-2024-003', date: '2024-03-12', items: 8, total: '$1,800.00', status: 'delivered', priority: 'normal' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Truck className="h-8 w-8 text-blue-600" />
              Vendor Portal
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage shipments, invoices, and performance</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              New Shipment
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Open Orders', value: '12', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'On-Time Rate', value: '98.5%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'Pending Invoices', value: '$15.2k', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-100' },
            { label: 'Quality Issues', value: '0', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.bg} dark:bg-opacity-20`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  This Month
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-8 px-6">
              {['Orders', 'Shipments', 'Invoices', 'Performance'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`
                    py-4 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab.toLowerCase() 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table Toolbar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 w-64"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Showing 3 of 12 orders</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total Value</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.items} units</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium border
                        ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'}
                      `}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}
