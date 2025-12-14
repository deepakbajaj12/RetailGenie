'use client'

import { useState, useEffect } from 'react'
import { Bot, Battery, Wifi, MapPin, Play, Square, AlertTriangle, Video, Crosshair, Zap } from 'lucide-react'

export default function RobotFleetPage() {
  const [robots, setRobots] = useState([
    { id: 'R-101', name: 'Cleaner Unit A', type: 'cleaner', status: 'cleaning', battery: 85, location: { x: 20, y: 30 }, task: 'Aisle 4 Spill' },
    { id: 'R-102', name: 'Scanner Unit B', type: 'scanner', status: 'idle', battery: 45, location: { x: 60, y: 20 }, task: 'Waiting' },
    { id: 'R-103', name: 'Assistant Unit C', type: 'assistant', status: 'guiding', battery: 92, location: { x: 40, y: 70 }, task: 'Guiding Customer' },
    { id: 'R-104', name: 'Drone Scout X', type: 'drone', status: 'docked', battery: 100, location: { x: 90, y: 90 }, task: 'Charging' },
  ])

  const [selectedRobot, setSelectedRobot] = useState<string | null>(null)
  const [emergencyMode, setEmergencyMode] = useState(false)

  // Simulate robot movement
  useEffect(() => {
    const interval = setInterval(() => {
      setRobots(prev => prev.map(robot => {
        if (robot.status === 'docked' || robot.status === 'idle') return robot
        
        // Random movement
        const dx = (Math.random() - 0.5) * 5
        const dy = (Math.random() - 0.5) * 5
        return {
          ...robot,
          location: {
            x: Math.max(5, Math.min(95, robot.location.x + dx)),
            y: Math.max(5, Math.min(95, robot.location.y + dy))
          },
          battery: Math.max(0, robot.battery - 0.05)
        }
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleaning': return 'text-blue-500'
      case 'guiding': return 'text-green-500'
      case 'docked': return 'text-gray-400'
      case 'idle': return 'text-yellow-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bot className="h-8 w-8 text-blue-400" />
              Autonomous Fleet Command
            </h1>
            <p className="text-gray-400">Real-time control of in-store robotics and drone systems.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setEmergencyMode(!emergencyMode)}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                emergencyMode 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-gray-800 hover:bg-gray-700 border border-red-900/50 text-red-400'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
              {emergencyMode ? 'EMERGENCY STOP ACTIVE' : 'Emergency Stop'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map View */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700 relative overflow-hidden h-[600px]">
            <div className="absolute top-6 left-6 z-10 bg-gray-900/80 backdrop-blur p-2 rounded-lg border border-gray-700">
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Store Floor Plan - Level 1
              </h3>
            </div>

            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
              }}>
            </div>

            {/* Store Layout (Simplified) */}
            <div className="absolute inset-10 border-4 border-gray-700 rounded-xl opacity-50"></div>
            <div className="absolute top-1/3 left-10 right-10 h-4 bg-gray-700/50"></div>
            <div className="absolute top-2/3 left-10 right-10 h-4 bg-gray-700/50"></div>
            <div className="absolute top-10 bottom-10 left-1/3 w-4 bg-gray-700/50"></div>
            <div className="absolute top-10 bottom-10 right-1/3 w-4 bg-gray-700/50"></div>

            {/* Robots */}
            {robots.map(robot => (
              <button
                key={robot.id}
                onClick={() => setSelectedRobot(robot.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 group ${selectedRobot === robot.id ? 'scale-125 z-20' : 'z-10'}`}
                style={{ left: `${robot.location.x}%`, top: `${robot.location.y}%` }}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 
                  ${selectedRobot === robot.id ? 'border-blue-400 bg-blue-900' : 'border-gray-600 bg-gray-800'}
                `}>
                  <Bot className={`h-6 w-6 ${getStatusColor(robot.status)}`} />
                </div>
                {/* Label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {robot.name}
                </div>
                {/* Range/Sensor Radius */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-blue-500/20 rounded-full animate-ping pointer-events-none"></div>
              </button>
            ))}
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Selected Robot Details */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 h-full">
              {selectedRobot ? (
                (() => {
                  const robot = robots.find(r => r.id === selectedRobot)!
                  return (
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-bold">{robot.name}</h2>
                          <p className="text-gray-400 text-sm">{robot.id} • {robot.type.toUpperCase()}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                          robot.status === 'cleaning' ? 'bg-blue-900/30 border-blue-500 text-blue-400' :
                          robot.status === 'docked' ? 'bg-gray-700/30 border-gray-500 text-gray-400' :
                          'bg-green-900/30 border-green-500 text-green-400'
                        }`}>
                          {robot.status}
                        </div>
                      </div>

                      {/* Live Feed Simulation */}
                      <div className="aspect-video bg-black rounded-xl relative overflow-hidden border border-gray-700 group">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-600 text-xs">CAMERA FEED SIGNAL LOST</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <div className="absolute top-2 left-2 flex gap-2">
                          <span className="bg-red-600 text-white text-[10px] px-1 rounded animate-pulse">LIVE</span>
                          <span className="text-green-400 text-[10px] font-mono">CAM-01</span>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs font-mono text-green-400">
                          <span>LAT: 34.0522</span>
                          <span>LNG: -118.2437</span>
                        </div>
                        {/* Crosshair overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                          <Crosshair className="h-12 w-12 text-white" />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900/50 p-4 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Battery className="h-4 w-4" /> Battery
                          </div>
                          <div className="text-xl font-bold">{robot.battery.toFixed(0)}%</div>
                          <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${robot.battery}%` }}></div>
                          </div>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Wifi className="h-4 w-4" /> Signal
                          </div>
                          <div className="text-xl font-bold">Strong</div>
                          <div className="text-xs text-gray-500">5G Ultra Wideband</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Manual Override</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <button className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                            <Play className="h-4 w-4" /> Resume
                          </button>
                          <button className="bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                            <Square className="h-4 w-4" /> Pause
                          </button>
                          <button className="bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors col-span-2">
                            <Zap className="h-4 w-4" /> Return to Dock
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })()
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <Bot className="h-16 w-16 mb-4 opacity-20" />
                  <p>Select a unit from the map to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
