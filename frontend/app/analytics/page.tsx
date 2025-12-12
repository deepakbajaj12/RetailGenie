'use client'

import { useState, useEffect } from 'react'
import { getOrders, getProducts, type Order, type Product } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Loader2 } from 'lucide-react'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [orders, products] = await Promise.all([getOrders(), getProducts()])
        
        // Process Status Data
        const statusCounts: Record<string, number> = {}
        orders?.forEach(o => {
          statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
        })
        setStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })))

        // Process Top Products
        const productSales: Record<string, number> = {}
        orders?.forEach(o => {
          o.items.forEach(i => {
            productSales[i.product_name] = (productSales[i.product_name] || 0) + i.quantity
          })
        })
        setTopProducts(Object.entries(productSales)
          .map(([name, sales]) => ({ name, sales }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5))

        // Process Sales Trend (Mocking daily data from orders)
        const salesByDate: Record<string, number> = {}
        orders?.forEach(o => {
            if (o.created_at) {
                const date = new Date(o.created_at).toLocaleDateString()
                salesByDate[date] = (salesByDate[date] || 0) + o.total_amount
            }
        })
        setSalesData(Object.entries(salesByDate).map(([date, amount]) => ({ date, amount })))

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
