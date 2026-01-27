import './globals.css'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mutual Fund Platform',
  description: 'Comprehensive mutual fund investment platform with real-time data',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}