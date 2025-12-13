'use client'

import { useState } from 'react'
import { ShoppingCart, AlertTriangle, Check, RefreshCw, ArrowRight } from 'lucide-react'

type ReorderItem = {
  id: string
  name: string
  currentStock: number
  reorderPoint: number
  suggestedOrder: number
  supplier: string
  urgency: 'high' | 'medium' | 'low'
}

const MOCK_REORDER_ITEMS: ReorderItem[] = [
  { id: '1', name: 'Wireless Mouse', currentStock: 5, reorderPoint: 10, suggestedOrder: 50, supplier: 'TechDistro Inc', urgency: 'high' },
  { id: '2', name: 'USB-C Cable', currentStock: 12, reorderPoint: 20, suggestedOrder: 100, supplier: 'CableCo', urgency: 'medium' },
  { id: '3', name: 'Monitor Stand', currentStock: 8, reorderPoint: 15, suggestedOrder: 20, supplier: 'OfficeSupplies', urgency: 'medium' },
  { id: '4', name: 'Mechanical Keyboard', currentStock: 2, reorderPoint: 5, suggestedOrder: 10, supplier: 'TechDistro Inc', urgency: 'high' },
]

export default function SmartReorderPage() {
  const [items, setItems] = useState(MOCK_REORDER_ITEMS)

  const handleReorder = (id: string) => {
    alert(`Order placed for item ${id}`)
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Smart Reorder</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">AI-suggested inventory replenishment based on sales velocity.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Suggestions
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className={`p-3 rounded-full ${
                item.urgency === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 
                'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
              }`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Supplier: {item.supplier}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-bold">Current Stock</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{item.currentStock}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-bold">Reorder Point</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{item.reorderPoint}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-500 uppercase font-bold">Suggested</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{item.suggestedOrder}</p>
              </div>
            </div>

            <button 
              onClick={() => handleReorder(item.id)}
              className="flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Order Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700">
            <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">All Caught Up!</h3>
            <p className="text-slate-500 dark:text-slate-400">No items require reordering at this time.</p>
          </div>
        )}
      </div>
    </div>
  )
}
