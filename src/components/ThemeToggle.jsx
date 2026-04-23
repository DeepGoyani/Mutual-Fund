'use client'
import { useSyncExternalStore, useCallback } from 'react'

function getStoredTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function subscribe(callback) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getStoredTheme,
    () => 'light'
  )

  const isDark = theme === 'dark'

  // Apply theme to document
  if (typeof document !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggle = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme' }))
  }, [isDark])

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  )
}