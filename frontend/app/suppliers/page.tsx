'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, Phone, Mail, MapPin, ExternalLink, Trash2, Loader2, RefreshCw, X, Star } from 'lucide-react'
import { getSuppliers, createSupplier, deleteSupplier, updateSupplier, type Supplier } from '@/lib/api'

// --- Add / Edit Supplier Modal ---
function SupplierModal({
  supplier,
  onSave,
  onClose,
  saving,
}: {
  supplier: Supplier | null
  onSave: (data: Supplier) => void
  onClose: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<Supplier>(
    supplier || { name: '', contact_person: '', email: '', phone: '', address: '', status: 'Active', rating: 4.5, category: '' }
  )

  const handleChange = (field: keyof Supplier, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Company Name *', field: 'name', type: 'text' },
            { label: 'Contact Person', field: 'contact_person', type: 'text' },
            { label: 'Email', field: 'email', type: 'email' },
            { label: 'Phone', field: 'phone', type: 'text' },
            { label: 'Address', field: 'address', type: 'text' },
            { label: 'Category', field: 'category', type: 'text' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input
                type={type}
                value={String(form[field as keyof Supplier] ?? '')}
                onChange={e => handleChange(field as keyof Supplier, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => handleChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={form.rating ?? 4.5}
                onChange={e => handleChange('rating', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Supplier'}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Main Page ---
export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All')

  const fetchSuppliers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSuppliers()
      setSuppliers(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSuppliers() }, [fetchSuppliers])

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.contact_person || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSave = async (form: Supplier) => {
    setSaving(true)
    try {
      if (editingSupplier?.id) {
        const updated = await updateSupplier(editingSupplier.id, form)
        setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...s, ...updated } : s))
      } else {
        const created = await createSupplier(form)
        setSuppliers(prev => [created, ...prev])
      }
      setShowModal(false)
      setEditingSupplier(null)
    } catch (err: any) {
      alert(err.message || 'Failed to save supplier')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this supplier?')) return
    setDeletingId(id)
    try {
      await deleteSupplier(id)
      setSuppliers(prev => prev.filter(s => s.id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete supplier')
    } finally {
      setDeletingId(null)
    }
  }

  const openAdd = () => { setEditingSupplier(null); setShowModal(true) }
  const openEdit = (s: Supplier) => { setEditingSupplier(s); setShowModal(true) }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      {showModal && (
        <SupplierModal
          supplier={editingSupplier}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingSupplier(null) }}
          saving={saving}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supplier Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {suppliers.length} total suppliers · {suppliers.filter(s => s.status === 'Active').length} active
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchSuppliers}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={openAdd}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            {(['All', 'Active', 'Inactive'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === f
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchSuppliers} className="text-blue-600 hover:underline text-sm">Try again</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
                No suppliers found.{' '}
                <button onClick={openAdd} className="text-blue-600 hover:underline">Add one</button>
              </div>
            ) : (
              filteredSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{supplier.name}</h3>
                      {supplier.category && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">{supplier.category}</span>
                      )}
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          supplier.status === 'Active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {supplier.status || 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(supplier)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-xs font-medium"
                      >
                        Edit
                      </button>
                      {supplier.id && (
                        <button
                          onClick={() => handleDelete(supplier.id!)}
                          disabled={deletingId === supplier.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingId === supplier.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    {supplier.contact_person && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-blue-600 dark:text-blue-400">{supplier.contact_person.charAt(0)}</span>
                        </div>
                        <span>{supplier.contact_person}</span>
                      </div>
                    )}
                    {supplier.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${supplier.email}`} className="hover:text-blue-600 transition-colors truncate">{supplier.email}</a>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.address && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{supplier.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {supplier.rating?.toFixed(1) ?? 'N/A'}
                      </span>
                    </div>
                    <button
                      onClick={() => openEdit(supplier)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      View Details <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}