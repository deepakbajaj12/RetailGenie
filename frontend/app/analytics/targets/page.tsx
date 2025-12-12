'use client'

import { useState } from 'react'
import { Target, TrendingUp, Calendar, DollarSign, Award } from 'lucide-react'

type SalesTarget = {
  id: string
  period: 'Monthly' | 'Quarterly' | 'Yearly'
  targetAmount: number
  currentAmount: number
  startDate: string
  endDate: string
  status: 'In Progress' | 'Achieved' | 'Missed'
}

const MOCK_TARGETS: SalesTarget[] = [
  {
    id: "T-001",
    period: "Monthly",
    targetAmount: 50000,
    currentAmount: 35000,
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    status: "In Progress"
  },
  {
    id: "T-002",
    period: "Quarterly",
    targetAmount: 150000,
    currentAmount: 45000,
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    status: "In Progress"
  },
  {
    id: "T-003",
    period: "Monthly",
    targetAmount: 45000,
    currentAmount: 48000,
    startDate: "2023-09-01",
    endDate: "2023-09-30",
    status: "Achieved"
  }
]

export default function SalesTargetsPage() {
  const [targets, setTargets] = useState<SalesTarget[]>(MOCK_TARGETS)

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500'
    if (percentage >= 75) return 'bg-blue-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Target className="h-8 w-8 text-red-500" />
              Sales Targets
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track performance against goals</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Target className="h-5 w-5 mr-2" />
            Set New Target
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targets.map((target) => {
            const percentage = Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100))
            
            return (
              <div key={target.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
                {target.status === 'Achieved' && (
                  <div className="absolute top-0 right-0 p-2">
                    <Award className="h-8 w-8 text-yellow-400" />
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                    {target.period}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {target.startDate} - {target.endDate}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current Sales</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${target.currentAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Target</p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        ${target.targetAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs font-medium">
                    <span className={percentage >= 100 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}>
                      {percentage}% Achieved
                    </span>
                    <span className="text-gray-500">
                      ${(target.targetAmount - target.currentAmount).toLocaleString()} to go
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>On track</span>
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                    View Details
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}