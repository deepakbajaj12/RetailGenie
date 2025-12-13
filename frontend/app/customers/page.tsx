'use client'

import { useState, useEffect } from 'react'
import { getOrders, type Order } from '@/lib/api'
import { Users, Search, Mail, ShoppingBag, Calendar, Award, Gift, MessageSquare, Heart } from 'lucide-react'
import Link from 'next/link'

type Customer = {
  name: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const orders = await getOrders()
        const customerMap = new Map<string, Customer>()

        orders?.forEach(order => {
          const existing = customerMap.get(order.customer_name)
          if (existing) {
            existing.totalOrders += 1
            existing.totalSpent += order.total_amount
            if (order.created_at && new Date(order.created_at) > new Date(existing.lastOrderDate)) {
              existing.lastOrderDate = order.created_at
            }
          } else {
            customerMap.set(order.customer_name, {
              name: order.customer_name,
              totalOrders: 1,
              totalSpent: order.total_amount,
              lastOrderDate: order.created_at || new Date().toISOString()
            })
          }
        })

        setCustomers(Array.from(customerMap.values()))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Customers</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">View your customer base and their purchase history.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/customers/loyalty" className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">
            <Award className="h-4 w-4 mr-2" />
            Loyalty
          </Link>
          <Link href="/customers/gift-cards" className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">
            <Gift className="h-4 w-4 mr-2" />
            Gift Cards
          </Link>
          <Link href="/customers/feedback" className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
          </Link>
          <Link href="/customers/sentiment" className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">
            <Heart className="h-4 w-4 mr-2" />
            Sentiment
          </Link>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full max-w-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Total Spent</p>
                <p className="text-lg font-bold text-slate-900">${customer.totalSpent.toFixed(2)}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{customer.name}</h3>
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center text-sm text-slate-600">
                <ShoppingBag className="h-4 w-4 mr-2 text-slate-400" />
                {customer.totalOrders} Orders
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                Last Order: {new Date(customer.lastOrderDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
