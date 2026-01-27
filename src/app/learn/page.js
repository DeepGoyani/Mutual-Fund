import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Learn Mutual Funds - MutualFund Platform',
  description: 'Comprehensive guide to mutual fund investing for beginners and experts.',
}

export default function LearnPage() {
  const topics = [
    {
      title: "What are Mutual Funds?",
      description: "Understanding the basics of mutual fund investments",
      icon: "📚",
      href: "/learn/funds"
    },
    {
      title: "Investment Strategies",
      description: "Different approaches to mutual fund investing",
      icon: "🎯",
      href: "/learn/funds"
    },
    {
      title: "Risk Management",
      description: "How to assess and manage investment risks",
      icon: "⚖️",
      href: "/learn/funds"
    },
    {
      title: "Investment Tools",
      description: "Calculators and analysis tools for informed decisions",
      icon: "🧮",
      href: "/learn/tools"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learn Mutual Fund Investing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the art of mutual fund investing with our comprehensive guides, tools, and expert insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((topic, index) => (
            <Link
              key={index}
              href={topic.href}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4">{topic.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {topic.title}
              </h3>
              <p className="text-gray-600">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}