'use client'

import Link from 'next/link'
import { ScanLine, Tag, ChevronRight, Wrench, LayoutGrid, Mic, Users, Wifi, Truck, CreditCard, ShoppingBag, BookOpen, Factory, Sparkles, Instagram, Activity, Smartphone, Navigation, Monitor, Glasses, Link as LinkIcon, Bot, Leaf, ShieldAlert, Trophy, Shirt, Video, Clock, Recycle, User, Calendar } from 'lucide-react'

export default function ToolsPage() {
  const tools = [
    { 
      title: 'Live Stream Shopping', 
      icon: Video, 
      href: '/tools/live-shopping', 
      desc: 'Interactive video commerce events',
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20'
    },
    { 
      title: 'Smart Queue System', 
      icon: Clock, 
      href: '/tools/queue-management', 
      desc: 'Virtual queuing and wait time tracking',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      title: 'Circular Economy Hub', 
      icon: Recycle, 
      href: '/tools/returns', 
      desc: 'Manage returns, repairs, and recycling',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    { 
      title: 'Virtual Concierge', 
      icon: User, 
      href: '/tools/concierge', 
      desc: '1-on-1 video calls with product experts',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    { 
      title: 'Community Events', 
      icon: Calendar, 
      href: '/tools/events', 
      desc: 'In-store workshops and meetups',
      color: 'text-pink-600',
      bg: 'bg-pink-50 dark:bg-pink-900/20'
    },
    { 
      title: 'Sustainability Tracker', 
      icon: Leaf, 
      href: '/tools/sustainability', 
      desc: 'ESG goals and carbon footprint monitoring',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    { 
      title: 'Loss Prevention AI', 
      icon: ShieldAlert, 
      href: '/tools/loss-prevention', 
      desc: 'Real-time theft and hazard detection',
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-900/20'
    },
    { 
      title: 'Gamification Engine', 
      icon: Trophy, 
      href: '/tools/gamification', 
      desc: 'Customer loyalty quests and rewards',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    { 
      title: 'Hyper-Local Dispatch', 
      icon: Truck, 
      href: '/tools/delivery', 
      desc: 'Manage local delivery fleet and orders',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      title: 'Smart Fitting Rooms', 
      icon: Shirt, 
      href: '/tools/fitting-room', 
      desc: 'Fitting room occupancy and requests',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    { 
      title: 'AR Wayfinder', 
      icon: Navigation, 
      href: '/tools/ar-wayfinder', 
      desc: 'Augmented reality in-store navigation',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    { 
      title: 'Smart Signage', 
      icon: Monitor, 
      href: '/tools/smart-signage', 
      desc: 'AI-driven adaptive digital billboards',
      color: 'text-fuchsia-600',
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20'
    },
    { 
      title: 'VR Digital Twin', 
      icon: Glasses, 
      href: '/tools/vr-twin', 
      desc: '3D immersive store management',
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-900/20'
    },
    { 
      title: 'Robot Fleet', 
      icon: Bot, 
      href: '/tools/robot-fleet', 
      desc: 'Autonomous drone and droid control',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    { 
      title: 'Blockchain Passport', 
      icon: LinkIcon, 
      href: '/products/blockchain', 
      desc: 'Immutable product journey tracking',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    { 
      title: 'AI Personal Stylist', 
      icon: Sparkles, 
      href: '/tools/stylist', 
      desc: 'Personalized outfit recommendations',
      color: 'text-pink-600',
      bg: 'bg-pink-50 dark:bg-pink-900/20'
    },
    { 
      title: 'Social Commerce Hub', 
      icon: Instagram, 
      href: '/tools/social', 
      desc: 'Monetize social media posts',
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20'
    },
    { 
      title: 'Predictive Maintenance', 
      icon: Activity, 
      href: '/tools/maintenance', 
      desc: 'AI-driven equipment health monitoring',
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    },
    { 
      title: 'Smart Shelf Labels (ESL)', 
      icon: Smartphone, 
      href: '/tools/esl', 
      desc: 'Manage electronic pricing displays',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    { 
      title: 'Point of Sale (POS)', 
      icon: CreditCard, 
      href: '/tools/pos', 
      desc: 'Process sales and manage checkout',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    { 
      title: 'Self-Checkout Kiosk', 
      icon: ShoppingBag, 
      href: '/tools/kiosk', 
      desc: 'Customer-facing self-service terminal',
      color: 'text-teal-600',
      bg: 'bg-teal-50 dark:bg-teal-900/20'
    },
    { 
      title: 'Employee Training', 
      icon: BookOpen, 
      href: '/tools/training', 
      desc: 'Learning modules and progress tracking',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    { 
      title: 'Vendor Portal', 
      icon: Factory, 
      href: '/tools/vendor-portal', 
      desc: 'Supplier management and order tracking',
      color: 'text-slate-600',
      bg: 'bg-slate-50 dark:bg-slate-900/20'
    },
    { 
      title: 'Barcode Generator', 
      icon: ScanLine, 
      href: '/tools/barcode', 
      desc: 'Create and print barcodes for your products',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      title: 'Label Printing', 
      icon: Tag, 
      href: '/tools/labels', 
      desc: 'Design and print custom product labels',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    { 
      title: 'Store Planogram', 
      icon: LayoutGrid, 
      href: '/tools/planogram', 
      desc: 'Visual store layout and shelf management',
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    },
    { 
      title: 'Voice Assistant', 
      icon: Mic, 
      href: '/tools/voice', 
      desc: 'Hands-free voice commands for operations',
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-900/20'
    },
    { 
      title: 'Staff Management', 
      icon: Users, 
      href: '/tools/staff', 
      desc: 'Employee scheduling and performance tracking',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    { 
      title: 'IoT Dashboard', 
      icon: Wifi, 
      href: '/tools/iot', 
      desc: 'Monitor store sensors and environment',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    { 
      title: 'Fleet Management', 
      icon: Truck, 
      href: '/tools/fleet', 
      desc: 'Track deliveries and optimize routes',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Wrench className="h-8 w-8 text-gray-700 dark:text-gray-300" />
            Tools & Utilities
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Helper tools for your daily operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex items-center justify-between group h-full">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-xl ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                    <tool.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{tool.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{tool.desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}