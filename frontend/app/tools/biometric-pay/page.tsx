'use client'

import { useState, useEffect } from 'react'
import { Scan, Fingerprint, CheckCircle, XCircle, ShieldCheck, User, CreditCard, Lock } from 'lucide-react'

export default function BiometricPayPage() {
  const [scanStatus, setScanStatus] = useState('idle') // idle, scanning, verified, failed
  const [scanType, setScanType] = useState('face') // face, palm
  const [progress, setProgress] = useState(0)

  const startScan = () => {
    setScanStatus('scanning')
    setProgress(0)
  }

  useEffect(() => {
    if (scanStatus === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setScanStatus('verified')
            return 100
          }
          return prev + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [scanStatus])

  const resetScan = () => {
    setScanStatus('idle')
    setProgress(0)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Scan className="h-8 w-8 text-indigo-600" />
            Biometric Checkout
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Secure, card-less payment using advanced identity verification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Scanner Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative">
            <div className="aspect-[4/3] bg-gray-900 relative flex flex-col items-center justify-center">
              {/* Simulated Camera Feed Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
              
              {scanStatus === 'idle' && (
                <div className="text-center z-10">
                  <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    {scanType === 'face' ? <User className="h-10 w-10 text-white/50" /> : <Fingerprint className="h-10 w-10 text-white/50" />}
                  </div>
                  <p className="text-white/70">Ready to Scan</p>
                </div>
              )}

              {scanStatus === 'scanning' && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-64 h-64 border-2 border-indigo-500 rounded-full relative animate-spin-slow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-indigo-500"></div>
                  </div>
                  <div className="absolute text-indigo-400 font-mono text-xl tracking-widest">SCANNING</div>
                </div>
              )}

              {scanStatus === 'verified' && (
                <div className="z-10 text-center animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Identity Verified</h3>
                  <p className="text-green-300">Sarah Jenkins</p>
                </div>
              )}

              {/* Scanning Grid Overlay */}
              {scanStatus === 'scanning' && (
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(99,102,241,0.2)_50%)] bg-[length:100%_4px] animate-scan"></div>
              )}
            </div>

            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setScanType('face')}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                    scanType === 'face' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-gray-200 dark:border-gray-700 text-gray-500'
                  }`}
                >
                  <Scan className="h-5 w-5" /> Face ID
                </button>
                <button 
                  onClick={() => setScanType('palm')}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                    scanType === 'palm' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-gray-200 dark:border-gray-700 text-gray-500'
                  }`}
                >
                  <Fingerprint className="h-5 w-5" /> Palm Scan
                </button>
              </div>

              {scanStatus === 'idle' ? (
                <button 
                  onClick={startScan}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                >
                  Start Authentication
                </button>
              ) : scanStatus === 'verified' ? (
                <button 
                  onClick={resetScan}
                  className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all"
                >
                  Process New Customer
                </button>
              ) : (
                <div className="w-full h-14 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-sm text-gray-600 dark:text-gray-300 mix-blend-difference">
                    Processing... {progress}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                Security Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Liveness Detection</span>
                  <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Active</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Encryption</span>
                  <span className="text-green-600 font-medium flex items-center gap-1"><Lock className="h-3 w-3" /> AES-256</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Match Confidence</span>
                  <span className="text-gray-900 dark:text-white font-bold">99.8%</span>
                </div>
              </div>
            </div>

            <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-opacity duration-500 ${scanStatus === 'verified' ? 'opacity-100' : 'opacity-50'}`}>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                Payment Method
              </h3>
              {scanStatus === 'verified' ? (
                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs italic">
                    VISA
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">•••• 4242</p>
                    <p className="text-xs text-gray-500">Expires 12/28</p>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Waiting for authentication...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
