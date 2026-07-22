'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, AlertTriangle, Info, CheckCircle, Trash2, RefreshCw, Loader2 } from 'lucide-react'
import { getNotifications, markNotificationRead, deleteNotification, type AppNotification } from '@/lib/api'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  const markAsRead = async (id: string) => {
    setActionLoading(id)
    try {
      await markNotificationRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch {
      // silent fail — optimistic UI already updated
    } finally {
      setActionLoading(null)
    }
  }

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read && n.id)
    await Promise.all(unread.map(n => markNotificationRead(n.id!).catch(() => {})))
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id + '-delete')
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch {
      // silent fail
    } finally {
      setActionLoading(null)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case 'success': return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'error':   return <AlertTriangle className="h-6 w-6 text-red-500" />
      default:        return <Info className="h-6 w-6 text-blue-500" />
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      const diff = Math.floor((Date.now() - d.getTime()) / 1000)
      if (diff < 60) return 'just now'
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
      return `${Math.floor(diff / 86400)}d ago`
    } catch { return dateStr }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-600" />
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-2 px-2.5 py-0.5 text-sm font-semibold bg-red-500 text-white rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={fetchNotifications}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium px-3 py-1"
            >
              Mark all as read
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchNotifications} className="text-blue-600 hover:underline text-sm">
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No notifications to show</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all ${
                    !notification.read ? 'border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-lg font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                      <div className="flex gap-4 mt-4">
                        {!notification.read && notification.id && (
                          <button
                            onClick={() => markAsRead(notification.id!)}
                            disabled={actionLoading === notification.id}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium disabled:opacity-50"
                          >
                            {actionLoading === notification.id ? 'Marking...' : 'Mark as read'}
                          </button>
                        )}
                        {notification.id && (
                          <button
                            onClick={() => handleDelete(notification.id!)}
                            disabled={actionLoading === notification.id + '-delete'}
                            className="text-sm text-red-500 hover:text-red-600 hover:underline flex items-center gap-1 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            {actionLoading === notification.id + '-delete' ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </div>
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