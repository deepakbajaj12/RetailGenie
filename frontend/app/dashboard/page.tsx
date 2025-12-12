'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { DollarSign, Package, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Clock, ShoppingCart } from 'lucide-react'

type DashboardData = {
  sales_chart: { date: string; revenue: number; orders: number }[]
  stats: {
    total_revenue: number
    total_orders: number
    active_products: number
    low_stock_count: number
  }
  low_stock_items: { id: string; name: string; stock: number; category: string; image_url?: string }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/analytics/dashboard')
        setData(res.data)
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 m-8">{error}</div>
  if (!data) return null

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time overview of your retail performance</p>
        </div>
        <div className="text-sm text-slate-400 bg-white px-4 py-2 rounded-full border shadow-sm">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${data.stats.total_revenue.toLocaleString()}`}
          trend="+12.5%"
          trendUp={true}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value={data.stats.total_orders.toString()}
          trend="+5.2%"
          trendUp={true}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Active Products"
          value={data.stats.active_products.toString()}
          trend="Stable"
          trendUp={true}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Low Stock Alerts"
          value={data.stats.low_stock_count.toString()}
          trend="Action Needed"
          trendUp={false}
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Revenue Trends</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 text-slate-600 focus:ring-0 cursor-pointer hover:bg-slate-100 transition-colors">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sales_chart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Low Stock Items</h3>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
              {data.low_stock_items.length} Critical
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[300px]">
            {data.low_stock_items.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>Inventory looks good!</p>
              </div>
            ) : (
              data.low_stock_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 text-sm">{item.stock} left</p>
                    <button className="text-xs text-blue-600 hover:underline mt-1">Restock</button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <button className="w-full mt-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border-t pt-4 transition-colors">
            View Full Inventory →
          </button>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'New Order #1234', time: '2 mins ago', desc: 'Customer purchased Wireless Headphones', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
            { title: 'Stock Alert', time: '15 mins ago', desc: 'Coffee Beans inventory is critically low', icon: AlertTriangle, color: 'bg-amber-100 text-amber-600' },
            { title: 'Price Updated', time: '1 hour ago', desc: 'Yoga Mat price changed to $29.99', icon: DollarSign, color: 'bg-emerald-100 text-emerald-600' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <activity.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900 text-sm">{activity.title}</h4>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {activity.time}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, trend, trendUp, icon: Icon, color }: any) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorStyles[color as keyof typeof colorStyles]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
      </div>
    </div>
  )
}
