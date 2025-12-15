'use client'

import { useState, useEffect } from 'react'
import { ShieldAlert, Eye, Video, AlertTriangle, UserX, Lock, Activity, Search } from 'lucide-react'

export default function LossPreventionPage() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Theft', location: 'Aisle 4 (Electronics)', time: '10:42 AM', severity: 'High', status: 'Active' },
    { id: 2, type: 'Loitering', location: 'Entrance B', time: '10:38 AM', severity: 'Low', status: 'Monitoring' },
    { id: 3, type: 'Spill Hazard', location: 'Produce Section', time: '10:15 AM', severity: 'Medium', status: 'Resolved' },
  ])

  const [cameras, setCameras] = useState([
    { id: 'CAM-01', name: 'Main Entrance', status: 'Online', activity: 'Normal' },
    { id: 'CAM-02', name: 'Electronics Aisle', status: 'Online', activity: 'Suspicious' },
    { id: 'CAM-03', name: 'Checkout Zone', status: 'Online', activity: 'High Traffic' },
    { id: 'CAM-04', name: 'Loading Dock', status: 'Online', activity: 'Normal' },
  ])

  // Simulate random activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCameras(prev => prev.map(cam => ({
        ...cam,
        activity: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Suspicious' : 'High Traffic') : 'Normal'
      })))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-red-500">
              <ShieldAlert className="h-8 w-8" />
              Loss Prevention AI
            </h1>
            <p className="text-gray-400">Real-time threat detection and safety monitoring system.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono">SYSTEM ONLINE</span>
            </div>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2">
              <Lock className="h-4 w-4" /> Lockdown Mode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {cameras.map((cam) => (
              <div key={cam.id} className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 group">
                {/* Simulated Feed Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>
                
                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-20" 
                  style={{ backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Simulated Bounding Boxes */}
                {cam.activity === 'Suspicious' && (
                  <div className="absolute top-1/3 left-1/4 w-24 h-48 border-2 border-red-500 animate-pulse">
                    <div className="absolute -top-6 left-0 bg-red-500 text-black text-xs font-bold px-1">
                      SUSPICIOUS (98%)
                    </div>
                  </div>
                )}

                {/* Camera Info Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Video className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-mono text-gray-300">{cam.id} - {cam.name}</span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cam.status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs font-mono text-gray-400">REC</span>
                </div>

                {/* Activity Indicator */}
                <div className={`absolute bottom-0 left-0 right-0 p-2 text-xs font-bold text-center uppercase tracking-wider ${
                  cam.activity === 'Suspicious' ? 'bg-red-900/80 text-red-200' : 
                  cam.activity === 'High Traffic' ? 'bg-yellow-900/80 text-yellow-200' : 
                  'bg-black/50 text-gray-500'
                }`}>
                  Status: {cam.activity}
                </div>
              </div>
            ))}
          </div>

          {/* Alert Feed */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" /> Live Alerts
              </h2>
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">{alerts.filter(a => a.status === 'Active').length} Active</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-xl border ${
                  alert.status === 'Active' ? 'bg-red-900/10 border-red-900/50' : 'bg-gray-700/30 border-gray-700'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {alert.type === 'Theft' ? <UserX className="h-4 w-4 text-red-400" /> : 
                       alert.type === 'Spill Hazard' ? <AlertTriangle className="h-4 w-4 text-yellow-400" /> :
                       <Eye className="h-4 w-4 text-blue-400" />}
                      <span className="font-bold text-sm">{alert.type}</span>
                    </div>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{alert.location}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      alert.severity === 'High' ? 'border-red-500 text-red-400' : 
                      alert.severity === 'Medium' ? 'border-yellow-500 text-yellow-400' : 
                      'border-blue-500 text-blue-400'
                    }`}>
                      {alert.severity} Priority
                    </span>
                    <button className="text-xs text-blue-400 hover:text-blue-300 underline">View Clip</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                <Search className="h-4 w-4" /> Search Incident History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
