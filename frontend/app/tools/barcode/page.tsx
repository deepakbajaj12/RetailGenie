'use client'

import { useState } from 'react'
import { ScanLine, Printer, Copy, RefreshCw } from 'lucide-react'

export default function BarcodeGeneratorPage() {
  const [sku, setSku] = useState('PROD-12345')
  const [format, setFormat] = useState('CODE128')

  // In a real app, we would use a library like 'react-barcode' to render the actual barcode.
  // For this mock, we'll just show a visual representation.

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ScanLine className="h-8 w-8 text-blue-600" />
              Barcode Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Create and print barcodes for your products</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product SKU / Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button 
                    onClick={() => setSku(`PROD-${Math.floor(Math.random() * 100000)}`)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="Generate Random"
                  >
                    <RefreshCw className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Barcode Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="CODE128">Code 128 (Standard)</option>
                  <option value="EAN13">EAN-13 (Retail)</option>
                  <option value="UPC">UPC-A (US Retail)</option>
                  <option value="QR">QR Code</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-8 w-full text-left">Preview</h2>
            
            <div className="bg-white p-8 border-2 border-dashed border-gray-300 rounded-lg mb-8">
              {/* Mock Barcode Visual */}
              <div className="flex flex-col items-center">
                <div className="h-24 w-64 bg-gray-900 flex items-end justify-center gap-[2px] px-4 pb-2 mb-2">
                  {/* Simulated bars */}
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-white" 
                      style={{ 
                        height: `${Math.random() * 60 + 30}%`, 
                        width: `${Math.random() * 4 + 1}px` 
                      }} 
                    />
                  ))}
                </div>
                <div className="font-mono text-xl tracking-widest text-gray-900">{sku}</div>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <Printer className="h-5 w-5 mr-2" />
                Print
              </button>
              <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                <Copy className="h-5 w-5 mr-2" />
                Copy Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}