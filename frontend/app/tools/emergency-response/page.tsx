'use client'

import { useState } from 'react'
import { Flame, HeartPulse, ShieldAlert, Phone, Users, CheckSquare, AlertTriangle, Megaphone, Lock } from 'lucide-react'

export default function EmergencyResponsePage() {
  const [activeEmergency, setActiveEmergency] = useState<string | null>(null)
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Trigger Silent Alarm', completed: false },
    { id: 2, task: 'Lock Down Entrances', completed: false },
    { id: 3, task: 'Notify Manager on Duty', completed: false },
    { id: 4, task: 'Guide Customers to Safe Zone', completed: false },
  ])

  const triggerEmergency = (type: string) => {
    setActiveEmergency(type)
    // Reset checklist
    setChecklist(prev => prev.map(item => ({ ...item, completed: false })))
  }

  const toggleTask = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item))
  }

  const resolveEmergency = () => {
    setActiveEmergency(null)
  }

  return (
    <div className={`min-h-screen p-8 transition-colors duration-500 ${activeEmergency ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ShieldAlert className={`h-8 w-8 ${activeEmergency ? 'text-red-600 animate-pulse' : 'text-gray-600'}`} />
              Emergency Command Center
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Centralized control for critical store incidents.</p>
          </div>
          {activeEmergency && (
            <div className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold animate-pulse flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              ACTIVE INCIDENT: {activeEmergency.toUpperCase()}
            </div>
          )}
        </div>

        {!activeEmergency ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button 
              onClick={() => triggerEmergency('fire')}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-orange-500 transition-all text-left"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame className="h-32 w-32 text-orange-500" />
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Flame className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Fire / Smoke</h3>
              <p className="text-gray-500">Trigger evacuation protocols and sprinkler systems.</p>
            </button>

            <button 
              onClick={() => triggerEmergency('medical')}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-left"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HeartPulse className="h-32 w-32 text-blue-500" />
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HeartPulse className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Medical Emergency</h3>
              <p className="text-gray-500">Alert first responders and locate nearest AED.</p>
            </button>

            <button 
              onClick={() => triggerEmergency('security')}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-red-500 transition-all text-left"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldAlert className="h-32 w-32 text-red-500" />
              </div>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldAlert className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Security Threat</h3>
              <p className="text-gray-500">Initiate silent alarm and lockdown procedures.</p>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Action Checklist */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 border-red-500 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="h-6 w-6 text-red-600" />
                  Response Protocol: {activeEmergency === 'fire' ? 'Code Red' : activeEmergency === 'medical' ? 'Code Blue' : 'Code Silver'}
                </h2>
                <span className="text-sm font-mono text-red-600 font-bold">T+00:02:14</span>
              </div>
              <div className="p-6 space-y-4">
                {checklist.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => toggleTask(item.id)}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      item.completed 
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/10' 
                        : 'border-gray-200 hover:border-red-200 bg-white dark:bg-gray-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {item.completed && <CheckSquare className="h-4 w-4 text-white" />}
                    </div>
                    <span className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-700/30 flex justify-end">
                <button 
                  onClick={resolveEmergency}
                  className="px-6 py-3 bg-gray-900 dark:bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  Stand Down / Resolve Incident
                </button>
              </div>
            </div>

            {/* Quick Actions & Status */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Automated Systems</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm flex items-center gap-2"><Lock className="h-4 w-4" /> Doors</span>
                    <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">LOCKED</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm flex items-center gap-2"><Megaphone className="h-4 w-4" /> PA System</span>
                    <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm flex items-center gap-2"><Users className="h-4 w-4" /> Staff Alert</span>
                    <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded">SENT</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Emergency Contacts</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors">
                    <span className="font-bold flex items-center gap-2"><Phone className="h-4 w-4" /> 911</span>
                    <span className="text-xs">Emergency Services</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors">
                    <span className="font-bold flex items-center gap-2"><Phone className="h-4 w-4" /> Ext. 200</span>
                    <span className="text-xs">Store Manager</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors">
                    <span className="font-bold flex items-center gap-2"><Phone className="h-4 w-4" /> Ext. 205</span>
                    <span className="text-xs">Security Desk</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
