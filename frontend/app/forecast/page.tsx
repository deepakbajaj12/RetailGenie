'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, AlertCircle, Calculator, ArrowRight, Loader2 } from 'lucide-react'

export default function ForecastPage() {
  const [inputs, setInputs] = useState<string>(Array(10).fill('100').join(', '))
  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chartData, setChartData] = useState<any[]>([])

  const handlePredict = async () => {
    setLoading(true)
    setError('')
    setPrediction(null)

    try {
      const values = inputs.split(',').map(v => parseFloat(v.trim()))
      if (values.length !== 10 || values.some(isNaN)) {
        throw new Error('Please enter exactly 10 valid numbers separated by commas')
      }

      const res = await api.post('/predict-demand', { last_10_days: values })
      setPrediction(res.data.predicted_demand)

      // Prepare chart data
      const data = values.map((val, idx) => ({ day: `Day ${idx + 1}`, sales: val, type: 'Historical' }))
      data.push({ day: 'Forecast', sales: res.data.predicted_demand, type: 'Predicted' })
      setChartData(data)

    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg shadow-blue-200">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Demand Forecasting</h1>
          <p className="text-slate-500 dark:text-slate-400">Predict future inventory needs with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-semibold">
              <Calculator className="h-5 w-5 text-blue-500" />
              <h2>Input Data</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Last 10 Days Sales
                </label>
                <textarea
                  value={inputs}
                  onChange={(e) => setInputs(e.target.value)}
                  className="w-full p-4 border dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm h-32 resize-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  placeholder="100, 120, 110, 130, ..."
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Enter 10 comma-separated numbers representing daily sales units.
                </p>
              </div>

              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    Generate Forecast <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {prediction !== null && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg shadow-emerald-200 text-white animate-in slide-in-from-bottom-4">
              <h3 className="text-emerald-100 text-sm font-medium uppercase tracking-wide mb-1">Predicted Demand</h3>
              <div className="text-5xl font-bold tracking-tight">
                {prediction.toFixed(1)}
                <span className="text-xl font-normal text-emerald-100 ml-2">units</span>
              </div>
              <p className="text-emerald-100 text-sm mt-4 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                Based on historical trends, we expect this demand for tomorrow.
              </p>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-[500px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Trend Analysis</h3>
            {chartData.length > 0 ? (
              <div className="flex-1 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fill="url(#colorSales)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl">
                <TrendingUp className="h-12 w-12 mb-4 opacity-20" />
                <p>Run a forecast to see the visualization</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
