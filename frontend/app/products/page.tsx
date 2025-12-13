'use client'

import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, type Product } from '@/lib/api'
import { Search, Plus, Filter, Edit, Trash, X, Save, Loader2, Package, Tag, DollarSign, FileImage, Download, ArrowUpDown, CheckCircle2, AlertCircle, ClipboardList, Truck, RefreshCw, Eye } from 'lucide-react'
import Link from 'next/link'

type ProductFormData = {
  name: string
  price: string
  category: string
  description: string
  image_url: string
  in_stock: boolean
}

const INITIAL_FORM: ProductFormData = {
  name: '',
  price: '',
  category: '',
  description: '',
  image_url: '',
  in_stock: true
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name')

  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price.toString(),
        category: editingProduct.category || '',
        description: editingProduct.description || '',
        image_url: editingProduct.image_url || '',
        in_stock: editingProduct.in_stock ?? true
      })
    } else {
      setFormData(INITIAL_FORM)
    }
  }, [editingProduct])

  async function fetchProducts() {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0
      }

      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, payload)
      } else {
        await createProduct(payload)
      }
      
      await fetchProducts()
      setIsModalOpen(false)
      setEditingProduct(null)
      setFormData(INITIAL_FORM)
    } catch (err: any) {
      alert(err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete product')
    }
  }

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedProducts)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedProducts(newSelection)
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedProducts.size} products?`)) return
    try {
      await Promise.all(Array.from(selectedProducts).map(id => deleteProduct(id)))
      setProducts(products.filter(p => !selectedProducts.has(p.id!)))
      setSelectedProducts(new Set())
    } catch (err: any) {
      alert(err.message || 'Failed to delete products')
    }
  }

  function handleExport() {
    const headers = ['Name', 'Price', 'Category', 'Stock Status', 'Description']
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(p => [
        `"${p.name}"`,
        p.price,
        `"${p.category || ''}"`,
        p.in_stock ? 'In Stock' : 'Out of Stock',
        `"${(p.description || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]]

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesStock = stockFilter === 'all' || (stockFilter === 'in_stock' ? product.in_stock : !product.in_stock)
      return matchesSearch && matchesCategory && matchesStock
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Product Catalog</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your inventory, prices, and product details.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/products/audit" className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">
            <ClipboardList className="h-4 w-4 mr-2" />
            Audit Logs
          </Link>
          <Link href="/products/discounts" className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">
            <Tag className="h-4 w-4 mr-2" />
            Discounts
          </Link>
          <Link href="/suppliers" className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">
            <Truck className="h-4 w-4 mr-2" />
            Suppliers
          </Link>
          {selectedProducts.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm font-medium"
            >
              <Trash className="h-4 w-4" />
              Delete ({selectedProducts.size})
            </button>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <Link href="/products/reorder">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium">
              <RefreshCw className="h-4 w-4" />
              Smart Reorder
            </button>
          </Link>
          <Link href="/products/competitors">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
              <Eye className="h-4 w-4" />
              Competitors
            </button>
          </Link>
          <button
            onClick={() => { setEditingProduct(null); setIsModalOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <ArrowUpDown className="h-4 w-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none focus:ring-0 text-sm text-slate-600 cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <Package className="h-4 w-4 text-slate-500" />
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="bg-transparent border-none focus:ring-0 text-sm text-slate-600 cursor-pointer"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm text-slate-600 cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
            {/* Image Section */}
            <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
              <div className="absolute top-2 left-2 z-10">
                <input 
                  type="checkbox" 
                  checked={selectedProducts.has(product.id!)}
                  onChange={() => toggleSelection(product.id!)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm"
                />
              </div>
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Package className="h-12 w-12" />
                </div>
              )}
              
              {/* Action Buttons Overlay */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingProduct(product); setIsModalOpen(true) }}
                  className="p-2 bg-white/90 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg shadow-sm transition-colors backdrop-blur-sm"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => product.id && handleDelete(product.id)}
                  className="p-2 bg-white/90 text-slate-600 hover:text-red-600 hover:bg-white rounded-lg shadow-sm transition-colors backdrop-blur-sm"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-1">{product.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{product.description || 'No description available'}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm font-medium">{product.category || 'Uncategorized'}</span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-bold text-slate-900 text-lg">
                    ${Number(product.price).toFixed(2)}
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${product.in_stock ? 'text-emerald-600' : 'text-red-600'}`}>
                    {product.in_stock ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> In Stock
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3" /> Out of Stock
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-500">
          No products found matching your criteria.
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Wireless Headphones"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Electronics"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <div className="relative">
                  <FileImage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {formData.image_url && (
                  <div className="mt-2 h-32 w-full rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Product details..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
