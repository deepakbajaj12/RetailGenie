'use client'

import { useState, useEffect } from 'react'
import { Truck, MapPin, Clock, Package, Phone, Navigation, CheckCircle, AlertCircle } from 'lucide-react'

export default function DeliveryDispatchPage() {
  const [drivers, setDrivers] = useState([
    { id: 'D-101', name: 'John D.', status: 'En Route', location: { x: 30, y: 40 }, orderId: '#ORD-8921', eta: '5 min' },
    { id: 'D-102', name: 'Sarah M.', status: 'Available', location: { x: 60, y: 60 }, orderId: null, eta: '-' },
    { id: 'D-103', name: 'Mike R.', status: 'Delivering', location: { x: 20, y: 80 }, orderId: '#ORD-8925', eta: '12 min' },
  ])

  const [orders, setOrders] = useState([
    { id: '#ORD-8930', customer: 'Alice Cooper', address: '123 Main St', items: 4, status: 'Pending', time: '2 min ago' },
    { id: '#ORD-8931', customer: 'Bob Wilson', address: '45 Park Ave', items: 2, status: 'Pending', time: '5 min ago' },
    { id: '#ORD-8921', customer: 'Charlie Brown', address: '78 Elm St', items: 8, status: 'In Transit', time: '15 min ago' },
  ])

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(prev => prev.map(d => {
        if (d.status === 'Available') return d
        return {
          ...d,
          location: {
            x: Math.max(5, Math.min(95, d.location.x + (Math.random() - 0.5) * 5)),
            y: Math.max(5, Math.min(95, d.location.y + (Math.random() - 0.5) * 5))
          }
        }
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto h-[calc(100vh-3rem)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Truck className="h-8 w-8 text-blue-600" />
              Hyper-Local Dispatch
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Manage local delivery fleet and assign orders in real-time.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold">3 Drivers Active</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">
              + Add Driver
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          {/* Order Queue */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" /> Incoming Orders
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors bg-white dark:bg-gray-800 group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">{order.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                      {order.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customer}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {order.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {order.time}</span>
                    <span>{order.items} items</span>
                  </div>
                  {order.status === 'Pending' && (
                    <button className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Assign Driver
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Map View */}
          <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 relative overflow-hidden">
            {/* Map Background Simulation */}
            <div className="absolute inset-0 bg-[#e5e7eb] dark:bg-[#1f2937]">
              {/* Roads */}
              <div className="absolute top-1/2 left-0 right-0 h-4 bg-white dark:bg-gray-800"></div>
              <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white dark:bg-gray-800"></div>
              <div className="absolute top-0 bottom-0 right-1/3 w-4 bg-white dark:bg-gray-800"></div>
              
              {/* Store Location */}
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white dark:border-gray-800 z-10 flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Drivers on Map */}
            {drivers.map((driver) => (
              <div 
                key={driver.id}
                className="absolute transition-all duration-1000 ease-linear z-20"
                style={{ left: `${driver.location.x}%`, top: `${driver.location.y}%` }}
              >
                <div className="relative group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 ${
                    driver.status === 'Available' ? 'bg-green-500' : 'bg-blue-600'
                  } text-white`}>
                    <Navigation className="h-5 w-5 transform rotate-45" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="font-bold text-gray-900 dark:text-white">{driver.name}</p>
                    <p className="text-gray-500">{driver.status}</p>
                    {driver.orderId && <p className="text-blue-500">{driver.orderId} • {driver.eta}</p>}
                  </div>
                </div>
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Navigation className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
