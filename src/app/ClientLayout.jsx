'use client'

import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

export default function ClientLayout() {
  useEffect(() => {
    // Remove any unwanted attributes added by browser extensions
    const body = document.body
    if (body && body.hasAttribute('cz-shortcut-listen')) {
      body.removeAttribute('cz-shortcut-listen')
    }
  }, [])

  return <Toaster />
}
