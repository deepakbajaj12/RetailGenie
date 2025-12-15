'use client'

import { useState } from 'react'
import { Trophy, Star, Target, Gift, Users, Crown, Medal, Zap, Plus } from 'lucide-react'

export default function GamificationPage() {
  const [activeQuest, setActiveQuest] = useState<number | null>(null)

  const quests = [
    { 
      id: 1, 
      title: 'Summer Coffee Run', 
      description: 'Purchase 5 iced coffees in July', 
      reward: 'Free Pastry + 500 XP', 
      participants: 1240, 
      status: 'Active',
      icon: Zap,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    { 
      id: 2, 
      title: 'Eco-Warrior', 
      description: 'Bring your own reusable bag 10 times', 
      reward: 'Sustainable Badge + 10% Off', 
      participants: 856, 
      status: 'Active',
      icon: LeafIcon, // Defined below as fallback or use generic
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20'
    },
    { 
      id: 3, 
      title: 'Weekend Explorer', 
      description: 'Visit 3 different store locations', 
      reward: 'Explorer Trophy', 
      participants: 342, 
      status: 'Draft',
      icon: Target,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20'
    },
  ]

  const leaderboard = [
    { rank: 1, user: 'Sarah J.', xp: 15400, badge: 'Diamond' },
    { rank: 2, user: 'Mike T.', xp: 14200, badge: 'Platinum' },
    { rank: 3, user: 'Jessica L.', xp: 13850, badge: 'Platinum' },
    { rank: 4, user: 'David R.', xp: 12100, badge: 'Gold' },
    { rank: 5, user: 'Emma W.', xp: 11950, badge: 'Gold' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Trophy className="h-10 w-10 text-yellow-500" />
              Gamification Engine
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">Engage customers with quests, badges, and rewards.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2">
            <Plus className="h-5 w-5" /> Create New Quest
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Quests */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5" /> Campaign Management
            </h2>
            
            {quests.map((quest) => (
              <div 
                key={quest.id} 
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setActiveQuest(quest.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`p-4 rounded-xl ${quest.bg} ${quest.color}`}>
                      <quest.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{quest.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">{quest.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-indigo-600 font-medium">
                          <Gift className="h-4 w-4" /> {quest.reward}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Users className="h-4 w-4" /> {quest.participants} joined
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    quest.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {quest.status}
                  </span>
                </div>
                
                {/* Progress Bar Simulation */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Campaign Progress</span>
                    <span>18 days left</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard Preview */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" /> Top Customers
              </h2>
              <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {leaderboard.map((entry) => (
                <div key={entry.rank} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                      entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      entry.rank === 2 ? 'bg-gray-100 text-gray-700' :
                      entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'text-gray-400'
                    }`}>
                      {entry.rank}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{entry.user}</p>
                      <p className="text-xs text-gray-500">{entry.badge} Member</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600">{entry.xp.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 uppercase">XP Points</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl text-white text-center">
              <Medal className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
              <h3 className="font-bold mb-1">Level Up Rewards</h3>
              <p className="text-sm text-indigo-100 mb-3">Configure automated rewards for reaching new tiers.</p>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors">
                Manage Tiers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LeafIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}
