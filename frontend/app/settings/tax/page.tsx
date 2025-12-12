'use client'

import { useState } from 'react'
import { Calculator, Save, Plus, Trash2 } from 'lucide-react'

type TaxRate = {
  id: string
  name: string
  rate: number
  description: string
  isDefault: boolean
}

const MOCK_RATES: TaxRate[] = [
  {
    id: "TAX-001",
    name: "Standard VAT",
    rate: 20.0,
    description: "Standard Value Added Tax",
    isDefault: true
  },
  {
    id: "TAX-002",
    name: "Reduced Rate",
    rate: 5.0,
    description: "For essential goods",
    isDefault: false
  },
  {
    id: "TAX-003",
    name: "Zero Rate",
    rate: 0.0,
    description: "Tax exempt items",
    isDefault: false
  }
]

export default function TaxSettingsPage() {
  const [rates, setRates] = useState<TaxRate[]>(MOCK_RATES)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              Tax Settings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Configure tax rates and rules</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            Add Tax Rate
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tax Rates</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage the tax rates applied to your products</p>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {rates.map((rate) => (
              <div key={rate.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{rate.name}</h3>
                    {rate.isDefault && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{rate.description}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{rate.rate}%</span>
                    <p className="text-xs text-gray-500">Rate</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete Rate">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Prices Include Tax</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">If enabled, product prices will be treated as tax-inclusive</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Charge Tax on Shipping</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Apply tax to shipping costs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Save className="h-5 w-5 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}