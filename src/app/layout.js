import './globals.css'
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
    <html lang="en">
      <body className="font-sans antialiased">
        <NavBar />
        <main className="min-h-[calc(100vh-56px)]">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}