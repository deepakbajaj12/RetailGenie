'use client'

import { useState } from 'react'
import { DollarSign, PieChart, TrendingDown, Plus, Calendar, FileText } from 'lucide-react'

type Expense = {
  id: string
  category: string
  amount: number
  date: string
  description: string
  status: 'Paid' | 'Pending'
}

const MOCK_EXPENSES: Expense[] = [
  {
    id: "EXP-001",
    category: "Rent",
    amount: 2500.00,
    date: "2023-10-01",
    description: "Monthly Store Rent - October",
    status: "Paid"
  },
  {
    id: "EXP-002",
    category: "Utilities",
    amount: 450.25,
    date: "2023-10-05",
    description: "Electricity Bill",
    status: "Paid"
  },
  {
    id: "EXP-003",
    category: "Salaries",
    amount: 12000.00,
    date: "2023-10-15",
    description: "Staff Payroll - Mid Month",
    status: "Paid"
  },
  {
    id: "EXP-004",
    category: "Maintenance",
    amount: 150.00,
    date: "2023-10-20",
    description: "AC Repair",
    status: "Pending"
  }
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES)

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-red-500" />
              Expense Tracking
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and categorize business costs</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Expenses (Oct)</h3>
              <DollarSign className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${totalExpenses.toLocaleString()}</p>
            <p className="text-sm text-red-500 mt-2 flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              +5% vs last month
            </p>
          </div>
          {/* Placeholder for charts */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Expense Breakdown Chart Placeholder</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {expense.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      ${expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        expense.status === 'Paid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <FileText className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}