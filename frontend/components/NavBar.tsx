'use client'

import Link from 'next/link'
import { Store, Bell, Moon, Sun, User, LogOut } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'

export function NavBar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Don't show navbar on login/register pages
  if (['/login', '/register'].includes(pathname)) return null

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg dark:from-blue-900 dark:to-indigo-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-2 hover:text-blue-100 transition-colors">
          <Store className="h-6 w-6" />
          RetailGenie
        </Link>
        <div className="flex items-center gap-8">
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
            <Link href="/forecast" className="hover:text-blue-200 transition-colors">Forecast</Link>
            <Link href="/assistant" className="hover:text-blue-200 transition-colors">Assistant</Link>
            <Link href="/products" className="hover:text-blue-200 transition-colors">Products</Link>
            <Link href="/orders" className="hover:text-blue-200 transition-colors">Orders</Link>
            <Link href="/customers" className="hover:text-blue-200 transition-colors">Customers</Link>
            <Link href="/analytics" className="hover:text-blue-200 transition-colors">Analytics</Link>
            <Link href="/tools" className="hover:text-blue-200 transition-colors">Tools</Link>
            <Link href="/settings" className="hover:text-blue-200 transition-colors">Settings</Link>
            <Link href="/ai" className="hover:text-blue-200 transition-colors">AI Tools</Link>
          </nav>
          <div className="flex items-center gap-3 pl-6 border-l border-blue-400/30">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative" title="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-400 rounded-full border border-blue-600"></span>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-white/10 rounded-full transition-colors" 
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <div className="h-8 w-8 bg-blue-800 rounded-full flex items-center justify-center font-bold border border-blue-400 cursor-pointer hover:bg-blue-900 transition-colors" title={user.name}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-blue-200 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
