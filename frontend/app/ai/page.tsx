'use client'

import { useState } from 'react'
import { aiGenerateDescription, aiSemanticSearch, aiSummarizeFeedback } from '@/lib/api'
import { Sparkles, Search, MessageSquare, PenTool, ArrowRight, Loader2 } from 'lucide-react'

export default function AIPage() {
  const [activeTool, setActiveTool] = useState<'desc' | 'search' | 'feedback'>('desc')

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">AI Power Tools</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Leverage our advanced AI models to automate content creation, analyze feedback, and find products intelligently.
        </p>
      </div>

      {/* Tool Selection Tabs */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTool('desc')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            activeTool === 'desc'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <PenTool className="h-4 w-4" />
          Description Generator
        </button>
        <button
          onClick={() => setActiveTool('search')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            activeTool === 'search'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Search className="h-4 w-4" />
          Semantic Search
        </button>
        <button
          onClick={() => setActiveTool('feedback')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            activeTool === 'feedback'
              ? 'bg-green-600 text-white shadow-lg shadow-green-200'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Feedback Analysis
        </button>
      </div>

      {/* Tool Content */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px]">
        {activeTool === 'desc' && <DescriptionGenerator />}
        {activeTool === 'search' && <SemanticSearchTool />}
        {activeTool === 'feedback' && <FeedbackAnalyzer />}
      </div>
    </div>
  )
}

function DescriptionGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    features: '',
    tone: 'friendly' as 'friendly' | 'formal' | 'playful'
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await aiGenerateDescription({
        name: formData.name,
        category: formData.category,
        features: formData.features.split(',').map(f => f.trim()),
        tone: formData.tone
      })
      setResult(res.description || 'No description generated.')
    } catch (err) {
      setResult('Error generating description.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl">
          <PenTool className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Product Description Generator</h2>
          <p className="text-sm text-slate-500">Create compelling marketing copy in seconds.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. UltraRun Pro"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Footwear"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Key Features (comma separated)</label>
          <input
            type="text"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. lightweight, waterproof, memory foam"
            value={formData.features}
            onChange={e => setFormData({ ...formData, features: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tone</label>
          <select
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={formData.tone}
            onChange={e => setFormData({ ...formData, tone: e.target.value as 'friendly' | 'formal' | 'playful' })}
          >
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="playful">Playful</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          Generate Magic
        </button>
      </form>

      {result && (
        <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Generated Copy</h3>
          <p className="text-slate-800 leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  )
}

function SemanticSearchTool() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await aiSemanticSearch({ query, top_k: 3 })
      setResults(res.results || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-xl">
          <Search className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Semantic Product Search</h2>
          <p className="text-sm text-slate-500">Find products by meaning, not just keywords.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          required
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          placeholder="e.g. something to wear for a summer wedding"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
        </button>
      </form>

      <div className="space-y-4">
        {results.map((item, idx) => (
          <div key={idx} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-slate-900">{item.name || 'Unknown Product'}</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {Math.round((item.score || 0) * 100)}% Match
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
          </div>
        ))}
        {results.length === 0 && !loading && (
          <div className="text-center py-12 text-slate-400">
            Enter a query to see semantic matches.
          </div>
        )}
      </div>
    </div>
  )
}

function FeedbackAnalyzer() {
  const [productId, setProductId] = useState('')
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const res = await aiSummarizeFeedback({ product_id: productId })
      setSummary(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-xl">
          <MessageSquare className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Feedback Summarizer</h2>
          <p className="text-sm text-slate-500">Digest hundreds of reviews into actionable insights.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          placeholder="Enter Product ID (e.g. p1)"
          value={productId}
          onChange={e => setProductId(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !productId}
          className="bg-green-600 text-white px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Analyze'}
        </button>
      </div>

      {summary && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-slate-900">{summary.average_rating || '-'}</div>
              <div className="text-xs text-slate-500 uppercase">Avg Rating</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-slate-900">{summary.total_reviews || 0}</div>
              <div className="text-xs text-slate-500 uppercase">Total Reviews</div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">AI Summary</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{summary.summary || 'No summary available.'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
