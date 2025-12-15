'use client'

import { useState } from 'react'
import { Users, CreditCard, TrendingUp, UserMinus, Star, Shield, Zap, Check } from 'lucide-react'

export default function SubscriptionManagerPage() {
  const [stats] = useState({
    mrr: 45290,
    activeSubscribers: 1240,
    churnRate: 2.4,
    newThisMonth: 156
  })

  const [recentActivity] = useState([
    { id: 1, user: 'Sarah Jenkins', action: 'New Subscription', plan: 'Gold', time: '2 mins ago', amount: '$49.99' },
    { id: 2, user: 'Mike Ross', action: 'Upgrade', plan: 'Platinum', time: '15 mins ago', amount: '$99.99' },
    { id: 3, user: 'Emily Chen', action: 'Renewal', plan: 'Silver', time: '1 hour ago', amount: '$19.99' },
    { id: 4, user: 'David Kim', action: 'Cancellation', plan: 'Gold', time: '3 hours ago', amount: '-' },
    { id: 5, user: 'Jessica Wong', action: 'New Subscription', plan: 'Silver', time: '5 hours ago', amount: '$19.99' },
  ])

  const plans = [
    { name: 'Silver', price: 19.99, color: 'bg-gray-100 text-gray-600', icon: Shield, features: ['Free Delivery', '5% Off Produce'] },
    { name: 'Gold', price: 49.99, color: 'bg-yellow-100 text-yellow-700', icon: Star, features: ['Free Delivery', '10% Off Everything', 'Priority Checkout'] },
    { name: 'Platinum', price: 99.99, color: 'bg-purple-100 text-purple-700', icon: Zap, features: ['Free Delivery', '15% Off Everything', 'Personal Shopper', 'Lounge Access'] },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-indigo-600" />
            Subscription Manager
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Manage recurring revenue and member loyalty programs.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.mrr.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +8.2% from last month
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Active Members</h3>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeSubscribers.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-2">+12 this week</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Churn Rate</h3>
              <UserMinus className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.churnRate}%</p>
            <p className="text-xs text-green-600 mt-2">-0.5% improvement</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">New Signups</h3>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.newThisMonth}</p>
            <p className="text-xs text-gray-500 mt-2">Target: 200</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Activity Feed</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.action === 'Cancellation' ? 'bg-red-100 text-red-600' :
                      activity.action === 'Upgrade' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {activity.action === 'Cancellation' ? <UserMinus className="h-5 w-5" /> :
                       activity.action === 'Upgrade' ? <TrendingUp className="h-5 w-5" /> :
                       <Check className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{activity.user}</p>
                      <p className="text-sm text-gray-500">{activity.action} • {activity.plan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{activity.amount}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Overview */}
          <div className="space-y-6">
            {plans.map((plan) => (
              <div key={plan.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
                <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                  <plan.icon className="h-24 w-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      <p className="text-2xl font-bold mt-1">${plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${plan.color}`}>
                      Active
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-6 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Edit Plan Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
