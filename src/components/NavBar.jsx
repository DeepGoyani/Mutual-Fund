'use client'
import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import SearchBar from './SearchBar'
import WatchlistButton from './WatchlistButton'
import AlertManager from './AlertManager'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MutualFund
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/portfolio" className="nav-link">Portfolio</Link>
            <Link href="/goals" className="nav-link">Goals</Link>
            <Link href="/funds" className="nav-link">Funds</Link>
            <Link href="/market" className="nav-link">Market</Link>
            <Link href="/learn/tools" className="nav-link">Tools</Link>
          </div>

          <div className="flex items-center space-x-2">
            <AlertManager />
            <WatchlistButton />
            <SearchBar />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <Link href="/dashboard" className="mobile-nav-link">Dashboard</Link>
              <Link href="/portfolio" className="mobile-nav-link">Portfolio</Link>
              <Link href="/goals" className="mobile-nav-link">Goals</Link>
              <Link href="/funds" className="mobile-nav-link">Funds</Link>
              <Link href="/market" className="mobile-nav-link">Market</Link>
              <Link href="/learn/tools" className="mobile-nav-link">Tools</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}