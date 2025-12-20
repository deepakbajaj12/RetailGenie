'use client'

import { useState, useRef, useEffect } from 'react'
import { api } from '@/lib/api'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m RetailGenie. Ask me about your sales, inventory, or product performance.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await api.post('/ai/chat', { message: userMsg })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-200 dark:shadow-purple-900/20">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Assistant</h1>
          <p className="text-slate-500 dark:text-slate-400">Your intelligent retail companion</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col relative">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              }`}>
                {msg.role === 'user' ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-6 w-6" />
                )}
              </div>
              <div className={`max-w-[80%] p-5 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sales trends, inventory status, or marketing ideas..."
              className="w-full pl-6 pr-14 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-all shadow-md shadow-purple-200 dark:shadow-purple-900/20"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">AI can make mistakes. Verify important information.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
