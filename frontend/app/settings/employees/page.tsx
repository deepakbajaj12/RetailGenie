'use client'

import { useState } from 'react'
import { UserPlus, Search, MoreHorizontal, Mail, Phone, Shield } from 'lucide-react'

type Employee = {
  id: string
  name: string
  role: 'Admin' | 'Manager' | 'Cashier' | 'Stock Clerk'
  email: string
  phone: string
  status: 'Active' | 'On Leave' | 'Terminated'
  department: string
}

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "EMP-001",
    name: "John Doe",
    role: "Admin",
    email: "john.doe@retailgenie.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    department: "Management"
  },
  {
    id: "EMP-002",
    name: "Jane Smith",
    role: "Manager",
    email: "jane.smith@retailgenie.com",
    phone: "+1 (555) 987-6543",
    status: "Active",
    department: "Sales"
  },
  {
    id: "EMP-003",
    name: "Mike Johnson",
    role: "Cashier",
    email: "mike.j@retailgenie.com",
    phone: "+1 (555) 456-7890",
    status: "On Leave",
    department: "Sales"
  },
  {
    id: "EMP-004",
    name: "Sarah Williams",
    role: "Stock Clerk",
    email: "sarah.w@retailgenie.com",
    phone: "+1 (555) 789-0123",
    status: "Active",
    department: "Inventory"
  }
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES)
  const [searchTerm, setSearchTerm] = useState('')

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'Manager': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'Cashier': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage staff access and roles</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <UserPlus className="h-5 w-5 mr-2" />
            Add Employee
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{employee.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{employee.department}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {employee.role}
                </span>
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {employee.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${employee.email}`} className="hover:text-blue-600 transition-colors">{employee.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{employee.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}