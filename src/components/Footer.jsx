import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">MutualFund</h3>
            <p className="text-gray-600 text-sm">
              Your trusted platform for smart mutual fund investments.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/funds" className="text-gray-600 hover:text-brand-navy">Fund Explorer</Link></li>
              <li><Link href="/learn/tools" className="text-gray-600 hover:text-brand-navy">Calculators</Link></li>
              <li><Link href="/market/compare" className="text-gray-600 hover:text-brand-navy">Compare Funds</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/learn" className="text-gray-600 hover:text-brand-navy">Learn</Link></li>
              <li><Link href="/market/about" className="text-gray-600 hover:text-brand-navy">About</Link></li>
              <li><Link href="/market" className="text-gray-600 hover:text-brand-navy">Market Insights</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-600 hover:text-brand-navy">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-brand-navy">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-brand-navy">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2026 MutualFund Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}