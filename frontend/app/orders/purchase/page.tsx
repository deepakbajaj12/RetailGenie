'use client'

import { useState } from 'react'
import { Plus, Search, Filter, FileText, Download, Eye, CheckCircle, Clock, XCircle } from 'lucide-react'

type PurchaseOrder = {
  id: string
  supplier: string
  date: string
  total: number
  status: 'Pending' | 'Approved' | 'Received' | 'Cancelled'
  items: number
}

const MOCK_ORDERS: PurchaseOrder[] = [
  {
    id: "PO-2023-001",
    supplier: "TechDistro Global",
    date: "2023-10-25",
    total: 12500.00,
    status: 'Pending',
    items: 15
  },
  {
    id: "PO-2023-002",
    supplier: "Office Supplies Co.",
    date: "2023-10-24",
    total: 450.50,
    status: 'Received',
    items: 5
  },
  {
    id: "PO-2023-003",
    supplier: "Global Imports Ltd.",
    date: "2023-10-20",
    total: 3200.00,
    status: 'Approved',
    items: 8
  },
  {
    id: "PO-2023-004",
    supplier: "TechDistro Global",
    date: "2023-10-15",
    total: 8900.00,
    status: 'Cancelled',
    items: 12
  }
]

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(MOCK_ORDERS)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Received': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4 mr-1" />
      case 'Approved': return <CheckCircle className="h-4 w-4 mr-1" />
      case 'Received': return <CheckCircle className="h-4 w-4 mr-1" />
      case 'Cancelled': return <XCircle className="h-4 w-4 mr-1" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Purchase Orders</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage procurement and supplier orders</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            Create Purchase Order
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by PO number or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Filter className="h-5 w-5 mr-2" />
              Filter Status
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">PO Number</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {order.supplier}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Download PDF">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
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