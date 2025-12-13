'use client'

import { useState, useEffect } from 'react'
import { Mic, MicOff, Command, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [lastCommand, setLastCommand] = useState<string | null>(null)
  const router = useRouter()

  // Mock speech recognition for demo purposes since actual Web Speech API 
  // might not work in all environments without HTTPS/permissions
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      setTranscript('')
    } else {
      setIsListening(true)
      setTranscript('Listening...')
      
      // Simulate command recognition after 2 seconds
      setTimeout(() => {
        const commands = [
          { text: "Go to dashboard", action: () => router.push('/') },
          { text: "Show inventory", action: () => router.push('/products') },
          { text: "Check sales", action: () => router.push('/analytics') },
          { text: "Open settings", action: () => router.push('/settings') }
        ]
        const randomCmd = commands[Math.floor(Math.random() * commands.length)]
        
        setTranscript(randomCmd.text)
        setLastCommand(randomCmd.text)
        setIsListening(false)
        
        // Execute action
        setTimeout(() => {
          randomCmd.action()
        }, 1000)
      }, 2000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center space-y-12 py-12">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Voice Command Center</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Navigate RetailGenie hands-free. Just speak your command.</p>
      </div>

      <div className="relative inline-block">
        <button
          onClick={toggleListening}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 shadow-lg scale-110' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-xl'
          }`}
        >
          {isListening ? (
            <MicOff className="h-12 w-12 text-white" />
          ) : (
            <Mic className="h-12 w-12 text-white" />
          )}
        </button>
        
        {/* Pulse animation rings */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping" />
            <div className="absolute -inset-4 rounded-full bg-red-500 opacity-10 animate-pulse" />
          </>
        )}
      </div>

      <div className="min-h-[100px] flex flex-col items-center justify-center">
        {transcript && (
          <p className={`text-2xl font-medium ${isListening ? 'text-slate-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
            "{transcript}"
          </p>
        )}
        {lastCommand && !isListening && (
          <div className="mt-4 flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
            <Command className="h-4 w-4 mr-2" />
            Executed: {lastCommand}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 text-left">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Try saying...</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Go to dashboard', 'Show inventory', 'Check sales', 'Open settings', 'Create new order', 'View customers'].map((cmd) => (
            <div key={cmd} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
              <span className="text-slate-600 dark:text-slate-300">"{cmd}"</span>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
