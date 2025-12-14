'use client'

import { useState } from 'react'
import { Megaphone, Mail, MessageSquare, Plus, Users, MousePointer, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState('active')

  const campaigns = [
    { 
      id: 1, 
      name: 'Summer Sale Blast', 
      type: 'Email', 
      status: 'Active', 
      sent: 1250, 
      opened: 850, 
      clicked: 320,
      conversion: '4.5%'
    },
    { 
      id: 2, 
      name: 'VIP Early Access', 
      type: 'SMS', 
      status: 'Completed', 
      sent: 500, 
      opened: 480, 
      clicked: 210,
      conversion: '12.8%'
    },
    { 
      id: 3, 
      name: 'Abandoned Cart Recovery', 
      type: 'Email', 
      status: 'Automated', 
      sent: 45, 
      opened: 30, 
      clicked: 15,
      conversion: '8.2%'
    },
  ]

  const performanceData = [
    { name: 'Mon', opens: 120, clicks: 45 },
    { name: 'Tue', opens: 150, clicks: 60 },
    { name: 'Wed', opens: 180, clicks: 85 },
    { name: 'Thu', opens: 140, clicks: 50 },
    { name: 'Fri', opens: 200, clicks: 90 },
    { name: 'Sat', opens: 90, clicks: 30 },
    { name: 'Sun', opens: 110, clicks: 40 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-pink-600" />
              Marketing Campaigns
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Create and track marketing campaigns</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign List */}
          <div className="lg:col-span-2 space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      campaign.type === 'Email' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {campaign.type === 'Email' ? <Mail className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{campaign.name}</h3>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                        campaign.status === 'Active' ? 'bg-green-100 text-green-700' :
                        campaign.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.conversion}</p>
                    <p className="text-xs text-gray-500">Conversion Rate</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                      <Users className="h-3 w-3" /> Sent
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">{campaign.sent}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                      <Mail className="h-3 w-3" /> Opened
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">{campaign.opened}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                      <MousePointer className="h-3 w-3" /> Clicked
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">{campaign.clicked}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Engagement Trend
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="opens" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Opens" />
                  <Bar dataKey="clicks" fill="#ec4899" radius={[4, 4, 0, 0]} name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
