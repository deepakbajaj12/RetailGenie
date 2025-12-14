'use client'

import { useState } from 'react'
import { Instagram, ShoppingBag, Heart, MessageCircle, TrendingUp, ExternalLink, Image as ImageIcon } from 'lucide-react'

export default function SocialCommercePage() {
  const [activeTab, setActiveTab] = useState('feed')

  const posts = [
    { 
      id: 1, 
      platform: 'instagram',
      user: '@retail_genie_official',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60',
      caption: 'Summer collection is here! ☀️ Get your beach essentials now. #SummerVibes #RetailGenie',
      likes: 1240,
      comments: 45,
      revenue: 4500,
      products: [
        { name: 'Straw Hat', price: 24.99, sold: 120 },
        { name: 'Beach Tote', price: 45.00, sold: 45 }
      ]
    },
    { 
      id: 2, 
      platform: 'tiktok',
      user: '@retail_genie_official',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60',
      caption: 'Flash Sale Alert! 🚨 50% off all activewear for the next 24h!',
      likes: 8500,
      comments: 320,
      revenue: 12800,
      products: [
        { name: 'Running Shoes', price: 89.99, sold: 210 },
        { name: 'Yoga Pants', price: 35.00, sold: 350 }
      ]
    },
    { 
      id: 3, 
      platform: 'instagram',
      user: '@retail_genie_official',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60',
      caption: 'Style tip: Layering is key for fall. 🍂 Shop the look in bio.',
      likes: 3200,
      comments: 89,
      revenue: 6200,
      products: [
        { name: 'Wool Coat', price: 120.00, sold: 45 },
        { name: 'Scarf', price: 25.00, sold: 80 }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Instagram className="h-8 w-8 text-pink-600" />
              Social Commerce Hub
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monetize your social media presence</p>
          </div>
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Create Shoppable Post
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Social Revenue', value: '$23.5k', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'Engagement Rate', value: '4.8%', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
            { label: 'Click-Throughs', value: '12.4k', icon: ExternalLink, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Conversion Rate', value: '2.1%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.bg} dark:bg-opacity-20`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  Last 30 Days
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Content Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
              {/* Post Header */}
              <div className="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-pink-600 rounded-full p-[2px]">
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full p-0.5">
                    <div className="w-full h-full bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{post.user}</p>
                  <p className="text-xs text-gray-500 capitalize">{post.platform}</p>
                </div>
              </div>

              {/* Image Placeholder */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative group">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <ImageIcon className="h-12 w-12 opacity-20" />
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="font-bold text-2xl">${post.revenue.toLocaleString()}</p>
                    <p className="text-sm">Revenue Generated</p>
                  </div>
                </div>
              </div>

              {/* Post Stats */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between mb-3">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <Heart className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </div>
                  </div>
                  <button className="text-blue-600 text-sm font-medium hover:underline">View Insights</button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {post.caption}
                </p>
              </div>

              {/* Tagged Products */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Tagged Products</p>
                <div className="space-y-3">
                  {post.products.map((product, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{product.sold} sold</p>
                        <p className="text-xs text-gray-500">${product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
