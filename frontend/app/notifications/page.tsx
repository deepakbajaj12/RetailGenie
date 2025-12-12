'use client'

import { useState } from 'react'
import { Bell, Package, AlertTriangle, Info, CheckCircle, Trash2 } from 'lucide-react'

type Notification = {
  id: number
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  date: string
  read: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Product "Wireless Mouse" is running low on stock (5 items remaining).',
    date: '2 hours ago',
    read: false
  },
  {
    id: 2,
    type: 'success',
    title: 'Order Completed',
    message: 'Order #12345 has been successfully delivered to the customer.',
    date: '5 hours ago',
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: 'System Update',
    message: 'RetailGenie will undergo maintenance on Sunday at 2:00 AM.',
    date: '1 day ago',
    read: true
  },
  {
    id: 4,
    type: 'error',
    title: 'Payment Failed',
    message: 'Payment for Order #12342 failed. Please check the transaction logs.',
    date: '2 days ago',
    read: true
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case 'success': return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'error': return <AlertTriangle className="h-6 w-6 text-red-500" />
      default: return <Info className="h-6 w-6 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-600" />
            Notifications
          </h1>
          <button 
            onClick={markAllAsRead}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        </div>

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
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{notification.date}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex gap-4 mt-4">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="text-sm text-red-500 hover:text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}