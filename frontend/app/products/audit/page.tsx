'use client'

import { useState } from 'react'
import { ClipboardList, Search, Filter, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'

type AuditLog = {
  id: string
  productName: string
  sku: string
  action: 'Stock In' | 'Stock Out' | 'Adjustment' | 'Return'
  quantity: number
  user: string
  date: string
  reason: string
}

const MOCK_LOGS: AuditLog[] = [
  {
    id: "LOG-001",
    productName: "Wireless Mouse",
    sku: "WM-001",
    action: "Stock Out",
    quantity: -2,
    user: "Mike Johnson",
    date: "2023-10-26 14:30",
    reason: "Sale #12345"
  },
  {
    id: "LOG-002",
    productName: "Mechanical Keyboard",
    sku: "MK-002",
    action: "Stock In",
    quantity: 50,
    user: "Sarah Williams",
    date: "2023-10-26 10:00",
    reason: "PO #2023-001 Received"
  },
  {
    id: "LOG-003",
    productName: "USB-C Cable",
    sku: "USB-003",
    action: "Adjustment",
    quantity: -1,
    user: "Jane Smith",
    date: "2023-10-25 16:45",
    reason: "Damaged inventory"
  },
  {
    id: "LOG-004",
    productName: "Monitor 27 inch",
    sku: "MON-004",
    action: "Return",
    quantity: 1,
    user: "Mike Johnson",
    date: "2023-10-25 11:20",
    reason: "Customer Return (Defective)"
  }
]

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_LOGS)
  const [searchTerm, setSearchTerm] = useState('')

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Stock In': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'Stock Out': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'Return': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
      default: return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Stock In': return <ArrowDownLeft className="h-4 w-4 mr-1" />
      case 'Stock Out': return <ArrowUpRight className="h-4 w-4 mr-1" />
      case 'Return': return <RefreshCw className="h-4 w-4 mr-1" />
      default: return <ClipboardList className="h-4 w-4 mr-1" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              Inventory Audit Logs
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track all inventory movements and adjustments</p>
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
            <Download className="h-5 w-5 mr-2" />
            Export Logs
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product, SKU, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{log.productName}</div>
                      <div className="text-xs text-gray-500">{log.sku}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                        {log.action}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-bold ${log.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {log.quantity > 0 ? '+' : ''}{log.quantity}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {log.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Download } from 'lucide-react'