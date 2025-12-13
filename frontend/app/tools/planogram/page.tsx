'use client'

import { useState } from 'react'
import { LayoutGrid, Move, Plus, Save, Trash2 } from 'lucide-react'

type Shelf = {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  color: string
}

const INITIAL_SHELVES: Shelf[] = [
  { id: '1', name: 'Entrance Display', x: 50, y: 50, width: 100, height: 60, color: 'bg-blue-200 dark:bg-blue-800' },
  { id: '2', name: 'Aisle 1', x: 200, y: 50, width: 60, height: 200, color: 'bg-green-200 dark:bg-green-800' },
  { id: '3', name: 'Aisle 2', x: 300, y: 50, width: 60, height: 200, color: 'bg-green-200 dark:bg-green-800' },
  { id: '4', name: 'Checkout', x: 500, y: 300, width: 150, height: 80, color: 'bg-purple-200 dark:bg-purple-800' },
]

export default function PlanogramPage() {
  const [shelves, setShelves] = useState<Shelf[]>(INITIAL_SHELVES)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleAddShelf = () => {
    const newShelf: Shelf = {
      id: Date.now().toString(),
      name: 'New Shelf',
      x: 100,
      y: 100,
      width: 80,
      height: 80,
      color: 'bg-gray-200 dark:bg-gray-700'
    }
    setShelves([...shelves, newShelf])
  }

  const handleDelete = () => {
    if (selectedId) {
      setShelves(shelves.filter(s => s.id !== selectedId))
      setSelectedId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Store Planogram</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Visual store layout editor.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAddShelf}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Shelf
          </button>
          <button 
            onClick={() => alert('Layout saved!')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </button>
        </div>
      </div>

      <div className="relative w-full h-[600px] bg-slate-50 dark:bg-gray-900 border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-10 pointer-events-none">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-slate-400" />
          ))}
        </div>

        {shelves.map((shelf) => (
          <div
            key={shelf.id}
            onClick={() => setSelectedId(shelf.id)}
            style={{
              left: shelf.x,
              top: shelf.y,
              width: shelf.width,
              height: shelf.height,
            }}
            className={`absolute cursor-move rounded-md border-2 flex items-center justify-center text-xs font-bold text-center p-2 transition-all
              ${shelf.color}
              ${selectedId === shelf.id ? 'border-blue-500 ring-2 ring-blue-200 z-10' : 'border-transparent hover:border-slate-400'}
            `}
          >
            {shelf.name}
          </div>
        ))}
      </div>

      {selectedId && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 flex items-center justify-between">
          <span className="font-medium">Selected: {shelves.find(s => s.id === selectedId)?.name}</span>
          <button 
            onClick={handleDelete}
            className="flex items-center px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
