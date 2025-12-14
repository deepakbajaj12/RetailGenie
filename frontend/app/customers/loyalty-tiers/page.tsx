'use client'

import { useState } from 'react'
import { Crown, Star, Gift, ChevronRight, Trophy, Medal } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function LoyaltyTiersPage() {
  const [activeTier, setActiveTier] = useState('Gold')

  const tiers = [
    { 
      name: 'Bronze', 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Medal,
      minSpend: 0,
      members: 1250,
      perks: ['Earn 1pt/$1', 'Birthday Gift']
    },
    { 
      name: 'Silver', 
      color: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: Star,
      minSpend: 500,
      members: 450,
      perks: ['Earn 1.5pts/$1', 'Free Delivery', 'Early Access']
    },
    { 
      name: 'Gold', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Crown,
      minSpend: 1500,
      members: 120,
      perks: ['Earn 2pts/$1', 'Priority Support', 'Exclusive Events', 'Double Points Days']
    },
  ]

  const distributionData = [
    { name: 'Bronze', value: 1250, color: '#fdba74' },
    { name: 'Silver', value: 450, color: '#94a3b8' },
    { name: 'Gold', value: 120, color: '#fcd34d' },
  ]

  const topCustomers = [
    { name: 'Alice Freeman', spent: 2450, points: 4500, tier: 'Gold' },
    { name: 'Bob Smith', spent: 1890, points: 3200, tier: 'Gold' },
    { name: 'Charlie Davis', spent: 1650, points: 2800, tier: 'Gold' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Loyalty Program Tiers
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer tiers and rewards</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Gift className="h-4 w-4" />
            Configure Rewards
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Tier Cards */}
          {tiers.map((tier) => (
            <div key={tier.name} className={`p-6 rounded-xl border ${tier.color} bg-opacity-50 relative overflow-hidden`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <tier.icon className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{tier.members}</p>
                  <p className="text-xs opacity-75">Members</p>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{tier.name} Tier</h3>
              <p className="text-sm opacity-75 mb-4">Spend ${tier.minSpend}+ / year</p>
              
              <div className="space-y-2">
                {tier.perks.map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm font-medium">
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Member Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Gold Members</h3>
              <button className="text-sm text-indigo-600 hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {topCustomers.map((customer, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{customer.name}</h4>
                      <p className="text-sm text-gray-500">{customer.points} pts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">${customer.spent}</p>
                    <p className="text-xs text-gray-500">YTD Spend</p>
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
