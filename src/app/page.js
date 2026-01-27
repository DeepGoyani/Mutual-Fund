import Link from "next/link"
import HeroIllustration from "@/components/HeroIllustration"

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight" style={{color:'var(--brand-navy)'}}>
              Invest Smart. Grow Secure.
            </h1>
            <p className="mt-3 text-[15px] text-black/70 max-w-prose">
              Track, compare, and invest in top-performing mutual funds with confidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/learn/funds" className="btn-primary">
                Get Started
              </Link>
              <Link href="/funds" className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-5 py-2.5 text-[15px] font-medium text-black hover:bg-black/5">
                Explore Funds
              </Link>
            </div>
          </div>
          <HeroIllustration />
        </div>
      </section>

      <section className="pt-6">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4" style={{color:'var(--brand-navy)'}}>Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Real-Time Data", desc: "Live NAV updates from reliable sources." },
              { title: "Smart Calculators", desc: "SIP and Lumpsum calculators with historical data." },
              { title: "Expert Analysis", desc: "Compare funds with detailed performance metrics." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-[13px] font-semibold text-brand-emerald">FEATURE</div>
                <div className="mt-1 font-semibold">{f.title}</div>
                <p className="text-sm text-black/70 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}