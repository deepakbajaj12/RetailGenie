'use client'

import { useState } from 'react'
import { Gift, Search, Plus, CreditCard, RefreshCw } from 'lucide-react'

type GiftCard = {
  id: string
  code: string
  balance: number
  initialAmount: number
  status: 'Active' | 'Redeemed' | 'Expired'
  issueDate: string
  expiryDate: string
}

const MOCK_CARDS: GiftCard[] = [
  {
    id: "GC-001",
    code: "GIFT-8821-9932",
    balance: 50.00,
    initialAmount: 50.00,
    status: "Active",
    issueDate: "2023-10-01",
    expiryDate: "2024-10-01"
  },
  {
    id: "GC-002",
    code: "GIFT-1122-3344",
    balance: 25.50,
    initialAmount: 100.00,
    status: "Active",
    issueDate: "2023-09-15",
    expiryDate: "2024-09-15"
  },
  {
    id: "GC-003",
    code: "GIFT-5566-7788",
    balance: 0.00,
    initialAmount: 25.00,
    status: "Redeemed",
    issueDate: "2023-08-20",
    expiryDate: "2024-08-20"
  }
]

export default function GiftCardsPage() {
  const [cards, setCards] = useState<GiftCard[]>(MOCK_CARDS)
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Gift className="h-8 w-8 text-pink-500" />
              Gift Cards
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and issue digital gift cards</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            Issue Gift Card
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <RefreshCw className="h-5 w-5 mr-2" />
              Check Balance
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Gift className="h-24 w-24 text-pink-500 transform rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    card.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {card.status}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Balance</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${card.balance.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">Initial: ${card.initialAmount.toFixed(2)}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Card Code</p>
                  <p className="font-mono font-medium text-gray-900 dark:text-white tracking-wide">{card.code}</p>
                </div>

                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Issued: {card.issueDate}</span>
                  <span>Expires: {card.expiryDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}