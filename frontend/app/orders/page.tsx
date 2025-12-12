'use client'

import { useState, useEffect } from 'react'
import { getOrders, createOrder, updateOrder, getProducts, type Order, type Product } from '@/lib/api'
import { Search, Plus, Filter, ShoppingBag, Clock, CheckCircle2, XCircle, Truck, Package, ChevronDown, ChevronUp, Loader2, Trash, Download, Printer, FileText } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  // Create Order Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [newOrderItems, setNewOrderItems] = useState<{ productId: string; quantity: number }[]>([])
  const [customerName, setCustomerName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      const data = await getOrders()
      setOrders(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  async function openCreateModal() {
    setIsModalOpen(true)
    if (products.length === 0) {
      const prodData = await getProducts()
      setProducts(prodData || [])
    }
  }

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault()
    if (newOrderItems.length === 0) {
      alert('Please add at least one item to the order')
      return
    }

    setCreating(true)
    try {
      // Calculate total and prepare items
      let total = 0
      const items = newOrderItems.map(item => {
        const product = products.find(p => p.id === item.productId)
        if (!product) throw new Error('Product not found')
        const itemTotal = product.price * item.quantity
        total += itemTotal
        return {
          product_id: product.id!,
          product_name: product.name,
          quantity: item.quantity,
          price: product.price
        }
      })

      await createOrder({
        customer_name: customerName,
        total_amount: total,
        status: 'Pending',
        items: items
      })

      await fetchOrders()
      setIsModalOpen(false)
      setCustomerName('')
      setNewOrderItems([])
    } catch (err: any) {
      alert(err.message || 'Failed to create order')
    } finally {
      setCreating(false)
    }
  }

  const addItemToOrder = () => {
    if (products.length > 0) {
      setNewOrderItems([...newOrderItems, { productId: products[0].id!, quantity: 1 }])
    }
  }

  const updateOrderItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const updated = [...newOrderItems]
    updated[index] = { ...updated[index], [field]: value }
    setNewOrderItems(updated)
  }

  const removeOrderItem = (index: number) => {
    setNewOrderItems(newOrderItems.filter((_, i) => i !== index))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700'
      case 'Processing': return 'bg-blue-100 text-blue-700'
      case 'Shipped': return 'bg-purple-100 text-purple-700'
      case 'Delivered': return 'bg-emerald-100 text-emerald-700'
      case 'Cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />
      case 'Processing': return <Loader2 className="h-4 w-4" />
      case 'Shipped': return <Truck className="h-4 w-4" />
      case 'Delivered': return <CheckCircle2 className="h-4 w-4" />
      case 'Cancelled': return <XCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Date', 'Status', 'Total', 'Items']
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.id,
        `"${order.customer_name}"`,
        new Date(order.created_at!).toLocaleDateString(),
        order.status,
        order.total_amount,
        `"${order.items.map(i => `${i.quantity}x ${i.product_name}`).join('; ')}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleStatusUpdate = async (orderId: string, newStatus: any) => {
    try {
      await updateOrder(orderId, { status: newStatus })
      fetchOrders()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handlePrint = (order: Order) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${order.id}</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { margin-bottom: 30px; }
              .total { margin-top: 20px; text-align: right; font-size: 1.2em; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>RetailGenie Invoice</h1>
              <p>Order ID: ${order.id}</p>
              <p>Customer: ${order.customer_name}</p>
              <p>Date: ${new Date(order.created_at!).toLocaleDateString()}</p>
              <p>Status: ${order.status}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.product_name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              Total: $${order.total_amount.toFixed(2)}
            </div>
            <script>window.print()</script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Orders</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage customer orders and track status.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/orders/purchase" className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">
            <FileText className="h-4 w-4 mr-2" />
            Purchase Orders
          </Link>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors shadow-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            New Order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Order ID</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Total</th>
                <th className="px-6 py-4 font-semibold text-slate-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No orders found. Create one to get started!
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <>
                    <tr 
                      key={order.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : (order.id || null))}
                    >
                      <td className="px-6 py-4 font-mono text-slate-500">#{order.id?.slice(0, 8)}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{order.customer_name}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        ${order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400">
                        {expandedOrderId === order.id ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="bg-white rounded-lg border border-slate-200 p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-blue-500" /> Order Items
                              </h4>
                              <div className="flex gap-2">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusUpdate(order.id!, e.target.value)}
                                  className="text-sm border border-slate-200 rounded-md px-2 py-1"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                                <button
                                  onClick={() => handlePrint(order)}
                                  className="p-1 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-md"
                                  title="Print Invoice"
                                >
                                  <Printer className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                  <span className="text-slate-700">
                                    <span className="font-medium">{item.quantity}x</span> {item.product_name}
                                  </span>
                                  <span className="text-slate-600">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">Create New Order</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrder} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input
                  required
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-700">Order Items</label>
                  <button
                    type="button"
                    onClick={addItemToOrder}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newOrderItems.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <select
                          value={item.productId}
                          onChange={e => updateOrderItem(index, 'productId', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOrderItem(index)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {newOrderItems.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                      No items added yet. Click "Add Item" to start.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
                >
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
