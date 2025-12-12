'use client'

import { useState } from 'react'
import { Gift, Search, Award, TrendingUp, Users, Settings } from 'lucide-react'

type LoyaltyMember = {
  id: string
  name: string
  email: string
  points: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  joinDate: string
  lastPurchase: string
}

const MOCK_MEMBERS: LoyaltyMember[] = [
  {
    id: "MEM-001",
    name: "Alice Freeman",
    email: "alice@example.com",
    points: 1250,
    tier: 'Gold',
    joinDate: "2023-01-15",
    lastPurchase: "2023-10-26"
  },
  {
    id: "MEM-002",
    name: "Bob Wilson",
    email: "bob@example.com",
    points: 450,
    tier: 'Silver',
    joinDate: "2023-03-22",
    lastPurchase: "2023-10-20"
  },
  {
    id: "MEM-003",
    name: "Charlie Brown",
    email: "charlie@example.com",
    points: 120,
    tier: 'Bronze',
    joinDate: "2023-08-10",
    lastPurchase: "2023-09-15"
  },
  {
    id: "MEM-004",
    name: "Diana Prince",
    email: "diana@example.com",
    points: 5600,
    tier: 'Platinum',
    joinDate: "2022-11-05",
    lastPurchase: "2023-10-27"
  }
]

export default function LoyaltyProgramPage() {
  const [members, setMembers] = useState<LoyaltyMember[]>(MOCK_MEMBERS)
  const [searchTerm, setSearchTerm] = useState('')

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800'
      case 'Gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'Silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
      default: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Gift className="h-8 w-8 text-pink-500" />
              Loyalty Program
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer rewards and tiers</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Settings className="h-5 w-5 mr-2" />
              Program Settings
            </button>
            <button className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shadow-sm">
              <Award className="h-5 w-5 mr-2" />
              Add Points
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Members</h3>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">1,245</p>
            <p className="text-sm text-green-500 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% this month
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Points Issued</h3>
              <Gift className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">85,400</p>
            <p className="text-sm text-gray-500 mt-2">Lifetime value</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Redemption Rate</h3>
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">68%</p>
            <p className="text-sm text-green-500 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% vs last month
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Points Balance</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4">Last Purchase</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTierColor(member.tier)}`}>
                        {member.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {member.points.toLocaleString()} pts
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {member.joinDate}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {member.lastPurchase}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-pink-600 hover:text-pink-700 font-medium text-sm">View History</button>
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