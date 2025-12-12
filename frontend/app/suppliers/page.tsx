'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MoreVertical, Phone, Mail, MapPin, ExternalLink } from 'lucide-react'

type Supplier = {
  id: number
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  status: 'Active' | 'Inactive'
  rating: number
}

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "TechDistro Global",
    contactPerson: "John Smith",
    email: "orders@techdistro.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Blvd, Silicon Valley, CA",
    status: 'Active',
    rating: 4.8
  },
  {
    id: 2,
    name: "Office Supplies Co.",
    contactPerson: "Sarah Johnson",
    email: "sarah@officesupplies.co",
    phone: "+1 (555) 987-6543",
    address: "456 Paper St, Scranton, PA",
    status: 'Active',
    rating: 4.5
  },
  {
    id: 3,
    name: "Global Imports Ltd.",
    contactPerson: "Michael Chen",
    email: "m.chen@globalimports.com",
    phone: "+1 (555) 456-7890",
    address: "789 Harbor Rd, Seattle, WA",
    status: 'Inactive',
    rating: 3.2
  }
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supplier Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your vendor relationships and orders</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            Add Supplier
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4">
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
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{supplier.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                    supplier.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {supplier.status}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-gray-600 dark:text-gray-300">{supplier.contactPerson.charAt(0)}</span>
                  </div>
                  <span>{supplier.contactPerson}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${supplier.email}`} className="hover:text-blue-600 transition-colors">{supplier.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{supplier.address}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 font-bold">★</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{supplier.rating}</span>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  View Details <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}