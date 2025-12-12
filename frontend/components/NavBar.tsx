import Link from 'next/link'
import { Store } from 'lucide-react'

export function NavBar() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-2 hover:text-blue-100 transition-colors">
          <Store className="h-6 w-6" />
          RetailGenie
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
          <Link href="/forecast" className="hover:text-blue-200 transition-colors">Forecast</Link>
          <Link href="/assistant" className="hover:text-blue-200 transition-colors">Assistant</Link>
          <Link href="/products" className="hover:text-blue-200 transition-colors">Products</Link>
          <Link href="/orders" className="hover:text-blue-200 transition-colors">Orders</Link>
          <Link href="/ai" className="hover:text-blue-200 transition-colors">AI Tools</Link>
        </nav>
      </div>
    </header>
  )
}
