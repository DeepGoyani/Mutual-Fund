import Link from "next/link";
import HeroIllustration from "@/components/HeroIllustration";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
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
              <Link href="/learn/funds" className="inline-flex items-center justify-center rounded-md bg-[var(--brand-emerald)] px-5 py-2.5 text-white font-medium shadow-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                Get Started
              </Link>
              <Link href="/funds" className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-5 py-2.5 text-[15px] font-medium text-black hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                Explore Funds
              </Link>
            </div>
          </div>
          <HeroIllustration />
        </div>
      </section>

      {/* Why Choose */}
      <section className="pt-6">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4" style={{color:'var(--brand-navy)'}}>Why Choose Our Mutual Fund Platform?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Trusted Data Sources", desc: "Powered by reliable MFAPI endpoints with consistent updates." },
              { title: "Real-Time NAV Updates", desc: "Always see the latest NAV with robust caching and SSR/ISR." },
              { title: "AI-Powered Comparison", desc: "Compare funds intelligently to align with your goals." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-[13px] font-semibold text-[var(--brand-emerald)]">FEATURE</div>
                <div className="mt-1 font-semibold">{f.title}</div>
                <p className="text-sm text-black/70 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold" style={{color:'var(--brand-navy)'}}>Fund Categories</h2>
            <Link href="/market" className="text-sm text-[var(--brand-emerald)] font-medium hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Equity Funds", growth: "+12.4%", href: "/learn/funds" },
              { name: "Debt Funds", growth: "+5.8%", href: "/learn/funds" },
              { name: "Hybrid Funds", growth: "+8.9%", href: "/learn/funds" },
              { name: "Tax Saving (ELSS)", growth: "+10.3%", href: "/learn/funds" },
            ].map((c) => (
              <Link key={c.name} href={c.href} className="group rounded-xl border border-black/10 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
                <div className="text-[13px] text-black/60">Category</div>
                <div className="font-semibold mt-1">{c.name}</div>
                <div className="mt-2 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--brand-emerald)]">
                  {c.growth}
                  <span className="text-black/40 group-hover:translate-x-0.5 transition">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Widget */}
      <section className="pt-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-3" style={{color:'var(--brand-navy)'}}>Performance Dashboard</h2>
          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <svg viewBox="0 0 400 160" className="w-full h-40" aria-label="Sample performance chart">
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1ABC9C" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#1ABC9C" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 130 L40 120 L80 110 L120 100 L160 90 L200 80 L240 70 L280 65 L320 60 L360 55 L400 50 L400 160 L0 160 Z" fill="url(#area)" />
                <polyline points="0,130 40,120 80,110 120,100 160,90 200,80 240,70 280,65 320,60 360,55 400,50" stroke="#0A1F44" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "CAGR", v: "11.8%", sub: "3Y" },
                { k: "NAV", v: "₹142.35", sub: "Latest" },
                { k: "Risk", v: "Moderate", sub: "Level" },
                { k: "Alpha", v: "+1.2", sub: "Excess" },
              ].map((m) => (
                <div key={m.k} className="rounded-lg border border-black/10 bg-white p-3">
                  <div className="text-[12px] text-black/60">{m.k}</div>
                  <div className="text-lg font-semibold">{m.v}</div>
                  <div className="text-[12px] text-black/60">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Testimonials */}
      <section className="pt-10 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold" style={{color:'var(--brand-navy)'}}>Investor Confidence</h3>
                <p className="text-sm text-black/70">SEBI Registered • Data Secured • Transparent Methodology</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 text-[#8a6b19] px-3 py-1 text-xs font-medium border border-[#D4AF37]/30">Premium</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-emerald)]/10 text-[var(--brand-emerald)] px-3 py-1 text-xs font-medium border border-[var(--brand-emerald)]/30">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
