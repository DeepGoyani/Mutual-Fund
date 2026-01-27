export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-[var(--surface)]/90 text-sm">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-black/70">
        <div>
          <div className="font-semibold mb-2" style={{color:'var(--brand-navy)'}}>Mutual Fund Dashboard</div>
          <p className="text-[13px]">Invest Smart. Grow Secure.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Quick Links</div>
          <ul className="space-y-1">
            <li><a href="/learn" className="hover:underline">Learn</a></li>
            <li><a href="/market" className="hover:underline">Market</a></li>
            <li><a href="/market/about" className="hover:underline">About</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact</div>
          <p className="text-[13px]">support@example.com</p>
          <p className="text-[13px]">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
