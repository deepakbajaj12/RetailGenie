'use client'

import { useState } from 'react'
import { Box, Map, Search, ArrowRight, PackageCheck, AlertTriangle, History } from 'lucide-react'

export default function WarehousePage() {
  const [selectedBin, setSelectedBin] = useState<string | null>(null)

  // Mock warehouse grid (Aisles A-D, Shelves 1-5)
  const warehouseMap = [
    { aisle: 'A', bins: [
      { id: 'A1', status: 'full', item: 'Electronics', qty: 50 },
      { id: 'A2', status: 'partial', item: 'Cables', qty: 25 },
      { id: 'A3', status: 'empty', item: null, qty: 0 },
      { id: 'A4', status: 'full', item: 'Monitors', qty: 10 },
      { id: 'A5', status: 'partial', item: 'Keyboards', qty: 15 },
    ]},
    { aisle: 'B', bins: [
      { id: 'B1', status: 'full', item: 'Clothing', qty: 100 },
      { id: 'B2', status: 'full', item: 'Shoes', qty: 40 },
      { id: 'B3', status: 'partial', item: 'Hats', qty: 30 },
      { id: 'B4', status: 'empty', item: null, qty: 0 },
      { id: 'B5', status: 'full', item: 'Jackets', qty: 20 },
    ]},
    { aisle: 'C', bins: [
      { id: 'C1', status: 'partial', item: 'Home Goods', qty: 12 },
      { id: 'C2', status: 'empty', item: null, qty: 0 },
      { id: 'C3', status: 'full', item: 'Kitchenware', qty: 45 },
      { id: 'C4', status: 'partial', item: 'Bedding', qty: 8 },
      { id: 'C5', status: 'empty', item: null, qty: 0 },
    ]},
  ]

  const recentMoves = [
    { id: 1, item: 'Electronics', from: 'Dock', to: 'A1', time: '10:30 AM', user: 'Mike R.' },
    { id: 2, item: 'Shoes', from: 'B2', to: 'Packing', time: '11:15 AM', user: 'Sarah J.' },
    { id: 3, item: 'Cables', from: 'A2', to: 'A3', time: '01:45 PM', user: 'David L.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Map className="h-8 w-8 text-orange-600" />
              Warehouse Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Visual inventory mapping and tracking</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Find item or bin..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
              <PackageCheck className="h-4 w-4" />
              Receive Stock
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visual Map */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Floor Plan: Zone 1</h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Full</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> Partial</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Empty</div>
              </div>
            </div>

            <div className="space-y-8">
              {warehouseMap.map((aisle) => (
                <div key={aisle.aisle} className="flex gap-4">
                  <div className="w-12 flex items-center justify-center font-bold text-gray-400 bg-gray-50 rounded-lg">
                    {aisle.aisle}
                  </div>
                  <div className="flex-1 grid grid-cols-5 gap-4">
                    {aisle.bins.map((bin) => (
                      <div 
                        key={bin.id}
                        onClick={() => setSelectedBin(bin.id)}
                        className={`
                          aspect-square rounded-lg border-2 p-2 cursor-pointer transition-all hover:scale-105 relative group
                          ${selectedBin === bin.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                          ${bin.status === 'full' ? 'bg-green-50 border-green-200' : 
                            bin.status === 'partial' ? 'bg-yellow-50 border-yellow-200' : 
                            'bg-gray-50 border-gray-200 border-dashed'}
                        `}
                      >
                        <span className="absolute top-2 left-2 text-xs font-bold text-gray-500">{bin.id}</span>
                        {bin.item && (
                          <div className="h-full flex flex-col items-center justify-center text-center">
                            <Box className={`h-6 w-6 mb-1 ${
                              bin.status === 'full' ? 'text-green-600' : 'text-yellow-600'
                            }`} />
                            <span className="text-xs font-medium text-gray-900 dark:text-gray-700 truncate w-full px-1">
                              {bin.item}
                            </span>
                            <span className="text-[10px] text-gray-500">{bin.qty} units</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Selected Bin Details */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bin Details</h3>
              {selectedBin ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <span className="text-gray-500">Bin ID</span>
                    <span className="font-bold text-xl">{selectedBin}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-500">Capacity</p>
                      <p className="font-bold text-green-600">85%</p>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-500">Last Audit</p>
                      <p className="font-bold">2 days ago</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Move Inventory
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <PackageCheck className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Select a bin to view details</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <History className="h-5 w-5 text-gray-500" />
                Recent Movements
              </h3>
              <div className="space-y-4">
                {recentMoves.map((move) => (
                  <div key={move.id} className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                      <Box className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {move.item}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>{move.from}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{move.to}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{move.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
