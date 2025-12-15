'use client'

import { useState } from 'react'
import { Shirt, User, Clock, CheckCircle, XCircle, Bell, MessageSquare, ArrowRight } from 'lucide-react'

export default function FittingRoomPage() {
  const [rooms, setRooms] = useState([
    { id: 1, status: 'Occupied', customer: 'Guest', time: '12:45 PM', items: 3, request: null },
    { id: 2, status: 'Occupied', customer: 'Member', time: '12:50 PM', items: 5, request: { type: 'Size', item: 'Denim Jacket', detail: 'Need Size L', time: '2m ago' } },
    { id: 3, status: 'Available', customer: null, time: '-', items: 0, request: null },
    { id: 4, status: 'Cleaning', customer: null, time: '-', items: 0, request: null },
    { id: 5, status: 'Occupied', customer: 'Guest', time: '12:55 PM', items: 2, request: { type: 'Color', item: 'Summer Dress', detail: 'Do you have Blue?', time: 'Just now' } },
  ])

  const handleResolveRequest = (roomId: number) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, request: null } : room
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Shirt className="h-8 w-8 text-purple-600" />
              Smart Fitting Rooms
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Monitor occupancy and respond to customer requests instantly.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">3/5 Occupied</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg shadow-sm animate-pulse">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-bold">2 Active Requests</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className={`relative flex flex-col h-96 rounded-2xl border-2 transition-all ${
              room.request ? 'border-red-500 shadow-red-100 dark:shadow-none ring-4 ring-red-500/10' : 
              room.status === 'Occupied' ? 'border-purple-200 dark:border-purple-900 bg-white dark:bg-gray-800' :
              room.status === 'Cleaning' ? 'border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/10' :
              'border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
            }`}>
              {/* Room Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <span className="font-bold text-lg text-gray-900 dark:text-white">Room {room.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  room.status === 'Occupied' ? 'bg-purple-100 text-purple-700' :
                  room.status === 'Cleaning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {room.status}
                </span>
              </div>

              {/* Room Content */}
              <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                {room.status === 'Occupied' ? (
                  <>
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                      <User className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{room.customer}</h3>
                    <p className="text-sm text-gray-500 mb-4">In since {room.time}</p>
                    <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      <Shirt className="h-4 w-4 text-gray-500" />
                      <span>{room.items} items inside</span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400">
                    <p className="text-sm">Room is empty</p>
                  </div>
                )}
              </div>

              {/* Request Overlay */}
              {room.request && (
                <div className="absolute inset-x-2 bottom-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                      <Bell className="h-4 w-4" /> Assistance Needed
                    </div>
                    <span className="text-xs text-red-500">{room.request.time}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{room.request.item}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{room.request.detail}</p>
                  <button 
                    onClick={() => handleResolveRequest(room.id)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-3 w-3" /> Mark Resolved
                  </button>
                </div>
              )}

              {/* Actions for Occupied Room (No Request) */}
              {room.status === 'Occupied' && !room.request && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                  <button className="w-full py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Message
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
