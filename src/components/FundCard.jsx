import Link from 'next/link'

export default function FundCard({ fund }) {
  if (!fund) return null

  return (
    <Link href={`/scheme/${fund.schemeCode}`}>
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-brand-navy cursor-pointer">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
            {fund.schemeName}
          </h3>
          <p className="text-sm text-gray-600">
            {fund.amc} • {fund.category}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Latest NAV</p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{fund.nav ? fund.nav.toFixed(2) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
            <p className="text-sm text-gray-600">
              {fund.date || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {fund.type || 'Open-ended'}
          </span>
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}