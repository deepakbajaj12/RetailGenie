'use client'

import { useState } from 'react'
import { Tag, Plus, Calendar, Percent, DollarSign, Trash2 } from 'lucide-react'

type Discount = {
  id: string
  code: string
  type: 'Percentage' | 'Fixed Amount'
  value: number
  minPurchase: number
  startDate: string
  endDate: string
  usageCount: number
  status: 'Active' | 'Scheduled' | 'Expired'
}

const MOCK_DISCOUNTS: Discount[] = [
  {
    id: "DSC-001",
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    minPurchase: 0,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    usageCount: 145,
    status: "Active"
  },
  {
    id: "DSC-002",
    code: "SUMMER25",
    type: "Fixed Amount",
    value: 25,
    minPurchase: 100,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    usageCount: 89,
    status: "Expired"
  },
  {
    id: "DSC-003",
    code: "BLACKFRIDAY",
    type: "Percentage",
    value: 30,
    minPurchase: 50,
    startDate: "2023-11-24",
    endDate: "2023-11-27",
    usageCount: 0,
    status: "Scheduled"
  }
]

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>(MOCK_DISCOUNTS)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Expired': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Tag className="h-8 w-8 text-blue-600" />
              Coupons & Discounts
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage promotional codes and offers</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            Create Discount
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Min. Purchase</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Usage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded inline-block">
                        {discount.code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">
                        {discount.type === 'Percentage' ? <Percent className="h-4 w-4 text-gray-400" /> : <DollarSign className="h-4 w-4 text-gray-400" />}
                        {discount.value}{discount.type === 'Percentage' ? '%' : ''} Off
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      ${discount.minPurchase}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-col text-xs">
                          <span>{discount.startDate}</span>
                          <span>{discount.endDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {discount.usageCount} used
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(discount.status)}`}>
                        {discount.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
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