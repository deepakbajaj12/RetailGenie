'use client'

import { useState } from 'react'
import { Box, Layers, ZoomIn, ZoomOut, Move, Eye, Maximize, Settings, Video } from 'lucide-react'

export default function VRTwinPage() {
  const [viewMode, setViewMode] = useState('3d')

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Toolbar */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Box className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Store Digital Twin</h1>
            <p className="text-xs text-gray-400">Live Sync • Downtown Branch</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg border border-gray-700">
          <button 
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === '3d' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            3D View
          </button>
          <button 
            onClick={() => setViewMode('heat')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'heat' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Heatmap
          </button>
          <button 
            onClick={() => setViewMode('cctv')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'cctv' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            CCTV Overlay
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors"><Settings className="h-5 w-5 text-gray-400" /></button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold transition-colors">Export Model</button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Grid Background Simulation */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)', 
               backgroundSize: '40px 40px',
               transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)'
             }}>
        </div>

        {/* 3D Store Model Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[800px] h-[500px] border-4 border-blue-500/30 bg-gray-800/50 backdrop-blur-sm rounded-xl transform rotate-x-12 shadow-2xl flex items-center justify-center group">
            
            {/* Interactive Elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 border border-blue-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-500/40 transition-colors">
              <span className="text-xs font-bold text-blue-300">Checkout Zone</span>
            </div>

            <div className="absolute bottom-1/3 right-1/4 w-48 h-24 bg-green-500/20 border border-green-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-500/40 transition-colors">
              <span className="text-xs font-bold text-green-300">Fresh Produce</span>
            </div>

            <div className="absolute top-10 right-10 w-24 h-48 bg-purple-500/20 border border-purple-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-500/40 transition-colors">
              <span className="text-xs font-bold text-purple-300">Electronics</span>
            </div>

            {/* Central Label */}
            <div className="text-center pointer-events-none">
              <Box className="h-24 w-24 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 font-mono">Interactive 3D Model</p>
              <p className="text-xs text-gray-600">Click zones to inspect</p>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur border border-gray-700 rounded-full px-6 py-3 flex items-center gap-6 shadow-xl">
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors" title="Pan"><Move className="h-5 w-5 text-gray-300" /></button>
          <div className="w-px h-6 bg-gray-700"></div>
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors" title="Zoom In"><ZoomIn className="h-5 w-5 text-gray-300" /></button>
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors" title="Zoom Out"><ZoomOut className="h-5 w-5 text-gray-300" /></button>
          <div className="w-px h-6 bg-gray-700"></div>
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors" title="Layers"><Layers className="h-5 w-5 text-gray-300" /></button>
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors" title="Fullscreen"><Maximize className="h-5 w-5 text-gray-300" /></button>
        </div>

        {/* Sidebar Overlay */}
        <div className="absolute top-6 right-6 w-80 bg-gray-800/90 backdrop-blur border border-gray-700 rounded-xl p-6 shadow-xl">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <ActivityIcon className="h-4 w-4 text-green-500" />
            Real-time Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Occupancy</span>
              <span className="font-mono font-bold text-white">45 / 120</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '38%' }}></div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-400">Avg Temperature</span>
              <span className="font-mono font-bold text-white">72°F</span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-400">Energy Usage</span>
              <span className="font-mono font-bold text-yellow-500">12.4 kW</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Active Alerts</h4>
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
              <div>
                <p className="text-sm font-bold text-red-400">Spill Detected</p>
                <p className="text-xs text-gray-400">Aisle 4 • 2 mins ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}
