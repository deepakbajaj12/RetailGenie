'use client'

import { useState, useEffect, useRef } from 'react'
import { Video, MessageCircle, Heart, ShoppingBag, Share2, Users, Send, Play, Pause, Volume2 } from 'lucide-react'

export default function LiveShoppingPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [likes, setLikes] = useState(1240)
  const [viewers, setViewers] = useState(342)
  const [messages, setMessages] = useState([
    { user: 'Sarah M.', text: 'Love that jacket! 😍' },
    { user: 'Mike R.', text: 'Is it available in black?' },
    { user: 'Jessica T.', text: 'Just bought one!' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const products = [
    { id: 1, name: 'Vintage Denim Jacket', price: 89.99, image: '🧥', stock: 15 },
    { id: 2, name: 'Classic White Tee', price: 29.99, image: '👕', stock: 42 },
    { id: 3, name: 'Leather Crossbody', price: 129.99, image: '👜', stock: 8 },
  ]

  // Simulate incoming messages and likes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLikes(prev => prev + Math.floor(Math.random() * 5))
      }
      if (Math.random() > 0.8) {
        const users = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey']
        const texts = ['So cool!', 'Need this!', 'Great price', 'Hello from NYC', 'Wow!']
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const randomText = texts[Math.floor(Math.random() * texts.length)]
        setMessages(prev => [...prev.slice(-10), { user: randomUser, text: randomText }])
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    setMessages(prev => [...prev, { user: 'You', text: newMessage }])
    setNewMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-3rem)]">
        
        {/* Main Video Feed */}
        <div className="lg:col-span-2 relative bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col">
          {/* Video Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center opacity-20">
              <Video className="h-24 w-24 mx-auto mb-4" />
              <p className="text-2xl font-bold">LIVE STREAM FEED</p>
            </div>
          </div>

          {/* Overlays */}
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <div className="bg-red-600 px-3 py-1 rounded-lg font-bold text-sm animate-pulse flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              LIVE
            </div>
            <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-lg font-medium text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              {viewers}
            </div>
          </div>

          {/* Featured Product Overlay */}
          <div className="absolute bottom-24 left-6 bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl max-w-xs animate-in slide-in-from-left duration-500">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center text-3xl">
                {products[0].image}
              </div>
              <div>
                <h3 className="font-bold text-sm">{products[0].name}</h3>
                <p className="text-lg font-bold text-green-400">${products[0].price}</p>
                <p className="text-xs text-gray-300">{products[0].stock} left in stock</p>
              </div>
            </div>
            <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-bold text-sm transition-colors">
              Buy Now
            </button>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-blue-400 transition-colors">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>
                <button className="hover:text-blue-400 transition-colors">
                  <Volume2 className="h-6 w-6" />
                </button>
              </div>
              <div className="flex gap-4">
                <button className="hover:text-pink-500 transition-colors flex items-center gap-2" onClick={() => setLikes(l => l + 1)}>
                  <Heart className="h-6 w-6" />
                  <span className="text-sm font-bold">{likes}</span>
                </button>
                <button className="hover:text-blue-400 transition-colors">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Chat & Products */}
        <div className="flex flex-col gap-6 h-full">
          {/* Product List */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 flex-1 overflow-y-auto max-h-[40%]">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-400" /> Featured Items
            </h2>
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-2xl">
                    {product.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <p className="text-green-400 font-bold text-sm">${product.price}</p>
                  </div>
                  <button className="bg-blue-600 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Live Chat */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-bold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-pink-400" /> Live Chat
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className="text-sm animate-in slide-in-from-bottom-2 duration-300">
                  <span className="font-bold text-gray-400">{msg.user}: </span>
                  <span className="text-gray-200">{msg.text}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Say something..."
                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
