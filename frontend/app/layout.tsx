import type { Metadata } from 'next'
import './globals.css'
import { NavBar } from '@/components/NavBar'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'RetailGenie',
  description: 'AI-powered retail management frontend',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider>
          <NavBar />
          <main className="mx-auto max-w-7xl p-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
