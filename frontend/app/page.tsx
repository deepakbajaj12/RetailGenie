import Link from 'next/link'
import { ArrowRight, BarChart3, Bot, ShoppingBag, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Retail Intelligence</span>
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          Manage Your Retail Business <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            With Superpowers
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Forecast demand, optimize inventory, and get actionable insights using advanced machine learning and AI.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/dashboard" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2">
            Open Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/assistant" className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-all">
            Ask AI Assistant
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Analytics</h3>
          <p className="text-slate-600 leading-relaxed">
            Visualize sales trends and get automated low-stock alerts to never miss a sale.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
            <Bot className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">AI Assistant</h3>
          <p className="text-slate-600 leading-relaxed">
            Chat with your data. Ask questions about revenue, inventory, and get instant answers.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
            <ShoppingBag className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Demand Forecasting</h3>
          <p className="text-slate-600 leading-relaxed">
            Predict future sales using LSTM models to optimize your stock levels ahead of time.
          </p>
        </div>
      </section>
    </div>
  )
}
