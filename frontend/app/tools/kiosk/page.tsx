'use client'

import { useState } from 'react'
import { ShoppingBag, CreditCard, QrCode, X, Plus, Minus, ChevronRight, CheckCircle } from 'lucide-react'

export default function KioskPage() {
  const [step, setStep] = useState<'scan' | 'cart' | 'pay' | 'success'>('scan')
  const [cart, setCart] = useState([
    { id: 1, name: 'Organic Bananas', price: 2.99, qty: 1, image: '🍌' },
    { id: 2, name: 'Sourdough Bread', price: 5.49, qty: 1, image: '🍞' },
  ])

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta)
        return { ...item, qty: newQty }
      }
      return item
    }).filter(item => item.qty > 0))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Kiosk Header */}
      <div className="p-6 bg-gray-800 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Self-Checkout</h1>
            <p className="text-gray-400">Register #4</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/30 transition-colors">
          Call Attendant
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 flex gap-8">
        {step === 'success' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-500/20">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-xl text-gray-400 mb-12">Please take your receipt and items.</p>
            <button 
              onClick={() => {
                setCart([])
                setStep('scan')
              }}
              className="px-12 py-6 bg-white text-gray-900 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-transform active:scale-95"
            >
              Start New Order
            </button>
          </div>
        ) : (
          <>
            {/* Left Side: Cart */}
            <div className="flex-1 bg-gray-800 rounded-3xl p-6 shadow-xl flex flex-col">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-green-400" />
                Your Cart ({cart.length} items)
              </h2>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="bg-gray-700/50 p-4 rounded-2xl flex items-center gap-4">
                    <div className="text-4xl bg-gray-700 w-20 h-20 rounded-xl flex items-center justify-center">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-green-400 font-mono text-lg">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-800 rounded-xl p-2">
                      <button 
                        onClick={() => updateQty(item.id, -1)}
                        className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 active:scale-95 transition-all"
                      >
                        <Minus className="h-6 w-6" />
                      </button>
                      <span className="text-2xl font-bold w-8 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, 1)}
                        className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-500 active:scale-95 transition-all"
                      >
                        <Plus className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {cart.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                    <QrCode className="h-24 w-24 mb-4" />
                    <p className="text-xl">Scan an item to start</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Actions */}
            <div className="w-96 flex flex-col gap-6">
              {/* Total Card */}
              <div className="bg-gray-800 rounded-3xl p-8 shadow-xl">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-400 text-lg">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-lg">
                    <span>Tax (8%)</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-700 my-4"></div>
                  <div className="flex justify-between text-3xl font-bold text-white">
                    <span>Total</span>
                    <span>${(total * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                {step === 'scan' ? (
                  <button 
                    onClick={() => setStep('pay')}
                    disabled={cart.length === 0}
                    className="w-full py-6 bg-green-500 text-white text-2xl font-bold rounded-2xl hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                  >
                    Pay Now
                    <ChevronRight className="h-8 w-8" />
                  </button>
                ) : (
                  <div className="space-y-4">
                    <button 
                      onClick={() => setStep('success')}
                      className="w-full py-6 bg-blue-600 text-white text-xl font-bold rounded-2xl hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      <CreditCard className="h-6 w-6" />
                      Card Payment
                    </button>
                    <button 
                      onClick={() => setStep('scan')}
                      className="w-full py-4 bg-gray-700 text-white text-lg font-bold rounded-2xl hover:bg-gray-600 transition-all"
                    >
                      Back to Cart
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="p-6 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-colors flex flex-col items-center gap-2">
                  <div className="text-3xl">🍎</div>
                  <span className="font-medium">Produce</span>
                </button>
                <button className="p-6 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-colors flex flex-col items-center gap-2">
                  <div className="text-3xl">🥖</div>
                  <span className="font-medium">Bakery</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
