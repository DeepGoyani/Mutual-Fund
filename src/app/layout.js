import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

/** @type {import('next').Metadata} */
export const metadata = {
  title: 'Mutual Fund Platform',
  description: 'Comprehensive mutual fund investment platform with real-time data',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
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