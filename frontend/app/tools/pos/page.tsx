'use client'

import { useState } from 'react'
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, User, Plus, Minus, Receipt } from 'lucide-react'

export default function POSPage() {
  const [cart, setCart] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const products = [
    { id: 1, name: 'Organic Milk', price: 4.50, category: 'Dairy', image: '🥛' },
    { id: 2, name: 'Whole Wheat Bread', price: 3.00, category: 'Bakery', image: '🍞' },
    { id: 3, name: 'Avocados (3pk)', price: 5.99, category: 'Produce', image: '🥑' },
    { id: 4, name: 'Free Range Eggs', price: 6.50, category: 'Dairy', image: '🥚' },
    { id: 5, name: 'Coffee Beans', price: 12.99, category: 'Beverages', image: '☕' },
    { id: 6, name: 'Orange Juice', price: 4.99, category: 'Beverages', image: '🍊' },
    { id: 7, name: 'Cheddar Cheese', price: 7.50, category: 'Dairy', image: '🧀' },
    { id: 8, name: 'Bananas (Bunch)', price: 2.50, category: 'Produce', image: '🍌' },
  ]

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item))
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta)
        return { ...item, qty: newQty }
      }
      return item
    }).filter(item => item.qty > 0))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Left Side: Product Grid */}
      <div className="flex-1 p-6 flex flex-col h-screen overflow-hidden">
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or scan barcode..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border-none shadow-sm text-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm font-medium text-gray-700 dark:text-gray-200">
            All Categories
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-20">
          {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-2 group border border-transparent hover:border-blue-500"
            >
              <span className="text-4xl mb-2 block group-hover:scale-110 transition-transform">{product.image}</span>
              <span className="font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</span>
              <span className="text-blue-600 font-bold">${product.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side: Cart & Checkout */}
      <div className="w-[400px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-screen shadow-xl z-10">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Customer</p>
              <p className="font-bold text-gray-900 dark:text-white">Walk-in Customer</p>
            </div>
          </div>
          <button className="text-blue-600 text-sm font-medium hover:underline">Change</button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-200 rounded"><Minus className="h-4 w-4" /></button>
                  <span className="font-bold w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-gray-200 rounded"><Plus className="h-4 w-4" /></button>
                </div>
                <p className="font-bold text-gray-900 dark:text-white w-16 text-right">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 grid grid-cols-2 gap-3 bg-white dark:bg-gray-800">
          <button 
            onClick={() => setCart([])}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-red-100 text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-6 w-6 mb-1" />
            <span className="text-xs font-bold">VOID</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors">
            <Receipt className="h-6 w-6 mb-1" />
            <span className="text-xs font-bold">PRINT</span>
          </button>
          <button className="col-span-2 bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 shadow-lg shadow-blue-200 dark:shadow-none">
            <CreditCard className="h-6 w-6" />
            <span className="text-lg font-bold">CHARGE ${total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
