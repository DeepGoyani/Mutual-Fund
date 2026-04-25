'use client'

import { useEffect, useState } from 'react'

export default function NoSSRBody({ children, className }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Remove any unwanted attributes added by browser extensions
    const body = document.body
    if (body && body.hasAttribute('cz-shortcut-listen')) {
      body.removeAttribute('cz-shortcut-listen')
    }
  }, [])

  if (!isClient) {
    // Server-side rendering - return div instead of body
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  // Client-side - render nothing (body already exists)
  return <>{children}</>
}
