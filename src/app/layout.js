import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

/** @type {import('next').Metadata} */
export const metadata = {
  title: 'Mutual Fund Platform',
  description: 'Comprehensive mutual fund investment platform with real-time data',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="icon" href="/icon.svg" />
        <link rel="shortcut icon" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <NavBar />
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}