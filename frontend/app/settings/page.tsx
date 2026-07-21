'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, Bell, Globe, Users, Calendar, Calculator, Terminal, Database, ChevronRight, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { getSettings, updateSettings, type UserSettings } from '@/lib/api'

// Reusable toggle switch component
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    storeName: 'RetailGenie Store',
    currency: 'USD',
    language: 'en',
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    lowStockThreshold: 10,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getSettings()
      setSettings(prev => ({ ...prev, ...data }))
    } catch {
      // Use defaults silently — user might not be logged in or settings aren't set yet
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const updateField = (field: keyof UserSettings, value: string | boolean | number) =>
    setSettings(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const updated = await updateSettings(settings)
      setSettings(prev => ({ ...prev, ...updated }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const settingLinks = [
    { title: 'Employee Management', icon: Users, href: '/settings/employees', desc: 'Manage staff roles and access' },
    { title: 'Shift Schedule', icon: Calendar, href: '/settings/schedule', desc: 'Organize employee shifts' },
    { title: 'Tax Settings', icon: Calculator, href: '/settings/tax', desc: 'Configure tax rates and rules' },
    { title: 'System Logs', icon: Terminal, href: '/settings/logs', desc: 'View system activity logs' },
    { title: 'Backup & Restore', icon: Database, href: '/settings/backup', desc: 'Manage data backups' },
  ]

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 hover:shadow-md transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                  <link.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{link.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{link.desc}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <Globe className="h-5 w-5 text-blue-500" /> General Settings
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Store Name</label>
            <input
              type="text"
              value={settings.storeName || ''}
              onChange={(e) => updateField('storeName', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
              <select
                value={settings.currency || 'USD'}
                onChange={(e) => updateField('currency', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Language</label>
              <select
                value={settings.language || 'en'}
                onChange={(e) => updateField('language', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Low Stock Threshold (units)
            </label>
            <input
              type="number"
              min="1"
              value={settings.lowStockThreshold ?? 10}
              onChange={(e) => updateField('lowStockThreshold', parseInt(e.target.value) || 10)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <Bell className="h-5 w-5 text-blue-500" /> Notifications
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Push Notifications', sub: 'Receive real-time in-app alerts', field: 'pushNotifications' as const },
            { label: 'Email Alerts', sub: 'Receive daily summaries via email', field: 'emailNotifications' as const },
            { label: 'SMS Alerts', sub: 'Critical alerts via SMS', field: 'smsNotifications' as const },
          ].map(({ label, sub, field }) => (
            <div key={field} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{sub}</p>
              </div>
              <Toggle
                checked={!!settings[field]}
                onChange={(v) => updateField(field, v)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Error & Save */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end items-center gap-4">
        {saved && (
          <span className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
            <CheckCircle className="h-4 w-4" /> Settings saved!
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
