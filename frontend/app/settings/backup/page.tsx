'use client'

import { useState } from 'react'
import { Database, Download, Upload, RefreshCw, CheckCircle, Clock, Shield } from 'lucide-react'

type Backup = {
  id: string
  filename: string
  size: string
  date: string
  type: 'Auto' | 'Manual'
  status: 'Completed' | 'Failed'
}

const MOCK_BACKUPS: Backup[] = [
  {
    id: "BK-001",
    filename: "backup_2023_10_26_1200.sql",
    size: "45.2 MB",
    date: "2023-10-26 12:00 PM",
    type: "Auto",
    status: "Completed"
  },
  {
    id: "BK-002",
    filename: "backup_2023_10_25_1200.sql",
    size: "44.8 MB",
    date: "2023-10-25 12:00 PM",
    type: "Auto",
    status: "Completed"
  },
  {
    id: "BK-003",
    filename: "manual_backup_v2.sql",
    size: "44.5 MB",
    date: "2023-10-24 04:30 PM",
    type: "Manual",
    status: "Completed"
  }
]

export default function BackupPage() {
  const [backups, setBackups] = useState<Backup[]>(MOCK_BACKUPS)
  const [isCreating, setIsCreating] = useState(false)

  const createBackup = () => {
    setIsCreating(true)
    setTimeout(() => {
      setIsCreating(false)
      alert('Backup created successfully!')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              Data Backup & Restore
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage database backups and recovery</p>
          </div>
          <button 
            onClick={createBackup}
            disabled={isCreating}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
          >
            {isCreating ? (
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Download className="h-5 w-5 mr-2" />
            )}
            {isCreating ? 'Creating Backup...' : 'Create New Backup'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Last Backup</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">System is backed up and secure.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Schedule</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Daily at 12:00 PM</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Next backup in 22 hours.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Retention</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">30 Days</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Older backups are auto-deleted.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Backup History</h2>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <Upload className="h-4 w-4" />
              Upload Backup File
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Filename</th>
                  <th className="px-6 py-4">Date Created</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {backup.filename}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {backup.date}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {backup.size}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        backup.type === 'Auto' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-xs">
                          Download
                        </button>
                        <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-xs">
                          Restore
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}