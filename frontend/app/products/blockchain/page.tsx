'use client'

import { useState } from 'react'
import { Link as LinkIcon, ShieldCheck, Box, Globe, CheckCircle, Search, QrCode, FileText } from 'lucide-react'

export default function BlockchainPage() {
  const [searchId, setSearchId] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock result
    setResult({
      id: searchId || 'PROD-89234-ETH',
      name: 'Premium Organic Coffee Beans',
      origin: 'Ethiopia, Yirgacheffe',
      farmer: 'Abebe Bikila',
      harvestDate: '2024-02-15',
      journey: [
        { stage: 'Harvested', location: 'Yirgacheffe, ET', date: '2024-02-15', hash: '0x7f...3a2b', verified: true },
        { stage: 'Processed', location: 'Addis Ababa, ET', date: '2024-02-20', hash: '0x8a...4b3c', verified: true },
        { stage: 'Shipped', location: 'Port of Djibouti', date: '2024-03-01', hash: '0x9c...5d4e', verified: true },
        { stage: 'Roasting', location: 'Seattle, USA', date: '2024-03-15', hash: '0x1d...6e5f', verified: true },
        { stage: 'Retail', location: 'RetailGenie Store #1', date: '2024-03-20', hash: '0x2e...7f6g', verified: true },
      ]
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <LinkIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Blockchain Product Passport</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Verify authenticity and trace the journey of your products.</p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Product ID or Scan QR Code..." 
              className="w-full pl-12 pr-14 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <QrCode className="h-6 w-6" />
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-green-300" />
                    <span className="text-sm font-bold uppercase tracking-wider text-blue-100">Verified Authentic</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-1">{result.name}</h2>
                  <p className="text-blue-100 font-mono text-sm">{result.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-200">Origin</p>
                  <p className="font-bold text-lg flex items-center justify-end gap-2">
                    <Globe className="h-4 w-4" /> {result.origin}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Supply Chain Journey</h3>
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                <div className="space-y-8">
                  {result.journey.map((step: any, idx: number) => (
                    <div key={idx} className="relative flex items-start gap-6 group">
                      {/* Icon */}
                      <div className={`
                        relative z-10 w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-sm
                        ${step.verified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
                      `}>
                        {idx === 0 ? <Globe className="h-6 w-6" /> :
                         idx === result.journey.length - 1 ? <Box className="h-6 w-6" /> :
                         <CheckCircle className="h-6 w-6" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-2">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white">{step.stage}</h4>
                          <span className="text-sm text-gray-500">{step.date}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{step.location}</p>
                        
                        {/* Hash */}
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg w-fit">
                          <FileText className="h-3 w-3" />
                          <span>Tx: {step.hash}</span>
                          {step.verified && <span className="text-green-600 font-bold ml-2">✓ On-Chain</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500">
                This product's history is immutably recorded on the Ethereum blockchain.
                <a href="#" className="text-blue-600 hover:underline ml-1">View Smart Contract</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
