'use client'

import { useState } from 'react'
import { Calendar, Users, Clock, TrendingUp, UserPlus, MoreHorizontal, CheckCircle, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'performance'>('schedule')

  const staff = [
    { id: 1, name: 'Sarah Johnson', role: 'Store Manager', status: 'On Shift', sales: 12500 },
    { id: 2, name: 'Mike Chen', role: 'Sales Associate', status: 'On Shift', sales: 8400 },
    { id: 3, name: 'Emma Wilson', role: 'Cashier', status: 'Break', sales: 5200 },
    { id: 4, name: 'James Rodriguez', role: 'Stock Clerk', status: 'Off', sales: 0 },
  ]

  const performanceData = [
    { name: 'Sarah', sales: 12500, hours: 40, efficiency: 312 },
    { name: 'Mike', sales: 8400, hours: 35, efficiency: 240 },
    { name: 'Emma', sales: 5200, hours: 30, efficiency: 173 },
    { name: 'David', sales: 4100, hours: 20, efficiency: 205 },
  ]

  const schedule = [
    { day: 'Mon', morning: ['Sarah', 'Mike'], afternoon: ['Emma', 'David'], evening: ['Sarah', 'James'] },
    { day: 'Tue', morning: ['Mike', 'David'], afternoon: ['Sarah', 'Emma'], evening: ['Mike', 'James'] },
    { day: 'Wed', morning: ['Sarah', 'Emma'], afternoon: ['Mike', 'David'], evening: ['Sarah', 'James'] },
    { day: 'Thu', morning: ['Mike', 'David'], afternoon: ['Sarah', 'Emma'], evening: ['Mike', 'James'] },
    { day: 'Fri', morning: ['Sarah', 'Mike'], afternoon: ['Emma', 'David'], evening: ['All Staff'] },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Staff Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage schedules and track employee performance</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus className="h-4 w-4" />
            Add Employee
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {staff.map((employee) => (
            <div key={employee.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.role}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'On Shift' ? 'bg-green-100 text-green-700' :
                  employee.status === 'Break' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {employee.status}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <TrendingUp className="h-4 w-4" />
                ${employee.sales.toLocaleString()} Sales
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex gap-4 p-4">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'schedule' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                Weekly Schedule
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'performance' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                Performance Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'schedule' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Day</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Morning (8am-1pm)</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Afternoon (1pm-6pm)</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Evening (6pm-10pm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((day, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{day.day}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{day.morning.join(', ')}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{day.afternoon.join(', ')}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{day.evening.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
                    <YAxis yAxisId="right" orientation="right" stroke="#16a34a" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" name="Total Sales ($)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="efficiency" name="Sales/Hour ($)" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
