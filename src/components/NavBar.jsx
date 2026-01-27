'use client'
import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import SearchBar from './SearchBar'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold" style={{color: 'var(--brand-navy)'}}>
              MutualFund
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/learn" className="text-gray-700 hover:text-brand-navy">Learn</Link>
            <Link href="/funds" className="text-gray-700 hover:text-brand-navy">Funds</Link>
            <Link href="/market" className="text-gray-700 hover:text-brand-navy">Market</Link>
            <Link href="/learn/tools" className="text-gray-700 hover:text-brand-navy">Tools</Link>
          </div>

          <div className="flex items-center space-x-4">
            <SearchBar />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-brand-navy"
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
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link href="/learn" className="text-gray-700 hover:text-brand-navy py-2">Learn</Link>
              <Link href="/funds" className="text-gray-700 hover:text-brand-navy py-2">Funds</Link>
              <Link href="/market" className="text-gray-700 hover:text-brand-navy py-2">Market</Link>
              <Link href="/learn/tools" className="text-gray-700 hover:text-brand-navy py-2">Tools</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}