'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Battery, Wifi, MapPin, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'

export default function SmartCartPage() {
  const [carts, setCarts] = useState([
    { id: 'C-101', status: 'In Use', battery: 85, items: 12, total: 145.50, location: 'Aisle 4', customer: 'Guest' },
    { id: 'C-102', status: 'Docked', battery: 100, items: 0, total: 0, location: 'Entrance', customer: null },
    { id: 'C-103', status: 'In Use', battery: 42, items: 5, total: 32.99, location: 'Produce', customer: 'Member' },
    { id: 'C-104', status: 'Maintenance', battery: 0, items: 0, total: 0, location: 'Backroom', customer: null },
    { id: 'C-105', status: 'In Use', battery: 15, items: 24, total: 289.00, location: 'Checkout', customer: 'Member' },
  ])

  // Simulate cart updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCarts(prev => prev.map(cart => {
        if (cart.status !== 'In Use') return cart
        return {
          ...cart,
          battery: Math.max(0, cart.battery - 0.1),
          items: Math.random() > 0.8 ? cart.items + 1 : cart.items,
          total: Math.random() > 0.8 ? cart.total + (Math.random() * 20) : cart.total
        }
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              Smart Cart Fleet
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Monitor active shopping sessions and cart health.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 uppercase font-bold">Active Carts</p>
              <p className="text-xl font-bold text-blue-600">{carts.filter(c => c.status === 'In Use').length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 uppercase font-bold">Avg Basket</p>
              <p className="text-xl font-bold text-green-600">$155.83</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carts.map((cart) => (
            <div key={cart.id} className={`relative p-6 rounded-2xl border-2 transition-all ${
              cart.status === 'In Use' ? 'border-blue-200 bg-white dark:bg-gray-800' :
              cart.status === 'Maintenance' ? 'border-red-200 bg-red-50 dark:bg-red-900/10' :
              'border-gray-200 bg-gray-50 dark:bg-gray-800/50'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    cart.status === 'In Use' ? 'bg-blue-100 text-blue-600' :
                    cart.status === 'Maintenance' ? 'bg-red-100 text-red-600' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{cart.id}</h3>
                    <p className="text-xs text-gray-500">{cart.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {cart.battery < 20 ? <Battery className="h-4 w-4 text-red-500" /> : <Battery className="h-4 w-4 text-green-500" />}
                  <span className={`text-sm font-bold ${cart.battery < 20 ? 'text-red-500' : 'text-green-500'}`}>
                    {cart.battery.toFixed(0)}%
                  </span>
                </div>
              </div>

              {cart.status === 'In Use' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500">Current Total</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">${cart.total.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{cart.items}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{cart.location}</span>
                  </div>

                  {cart.battery < 20 && (
                    <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Low Battery - Return to Dock Soon</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                  <CheckCircle className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">Ready for customer</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Wifi className="h-3 w-3" />
                  <span>Signal Strong</span>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
