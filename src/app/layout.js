import '@/styles/globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import ClientLayout from './ClientLayout'

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
        <script dangerouslySetInnerHTML={{
          __html: `
            // Remove browser extension attributes that cause hydration issues
            if (typeof window !== 'undefined') {
              const removeExtensionAttrs = () => {
                const body = document.body;
                if (body && body.hasAttribute('cz-shortcut-listen')) {
                  body.removeAttribute('cz-shortcut-listen');
                }
              };
              // Run immediately and on DOM changes
              removeExtensionAttrs();
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', removeExtensionAttrs);
              } else {
                removeExtensionAttrs();
              }
            }
          `
        }} />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <NavBar />
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <Footer />
        <ClientLayout />
      </body>
    </html>
  )
}