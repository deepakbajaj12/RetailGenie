'use client'

import Link from 'next/link'
import { ScanLine, Tag, ChevronRight, Wrench } from 'lucide-react'

export default function ToolsPage() {
  const tools = [
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