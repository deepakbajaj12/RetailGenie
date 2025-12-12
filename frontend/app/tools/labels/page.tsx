'use client'

import { useState } from 'react'
import { Printer, Tag, Layout, Type } from 'lucide-react'

export default function LabelPrintingPage() {
  const [template, setTemplate] = useState('Standard')
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Tag className="h-8 w-8 text-blue-600" />
              Label Printing
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Design and print product labels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Layout className="h-5 w-5 text-gray-500" />
                Template
              </h2>
              <div className="space-y-3">
                {['Standard', 'Compact', 'Large Price', 'QR Code'].map((t) => (
                  <label key={t} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <input
                      type="radio"
                      name="template"
                      value={t}
                      checked={template === t}
                      onChange={(e) => setTemplate(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Type className="h-5 w-5 text-gray-500" />
                Content
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                  <input type="text" defaultValue="Wireless Mouse" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                  <input type="text" defaultValue="$24.99" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                  <input type="text" defaultValue="WM-001" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center min-h-[500px]">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-8 w-full text-left">Live Preview</h2>
              
              <div className="w-64 h-40 bg-white border-2 border-gray-800 rounded-lg shadow-lg p-4 flex flex-col justify-between mb-12 relative overflow-hidden">
                <div className="text-center">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">Wireless Mouse</h3>
                  <p className="text-xs text-gray-500 mt-1">Ergonomic Design</p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <p className="text-xs font-mono text-gray-600">WM-001</p>
                    <div className="h-8 w-24 bg-gray-900 mt-1"></div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">$24.99</p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-500"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-500"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-medium text-lg">
                  <Printer className="h-6 w-6 mr-2" />
                  Print Labels
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}