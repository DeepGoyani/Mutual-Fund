"use client";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function NavBar() {
  return (
    <nav className="w-full sticky top-0 z-50 border-b bg-gradient-to-b from-white/90 to-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-[15px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded bg-black text-white grid place-items-center text-[11px]">MF</span>
            Mutual Fund Dashboard
          </span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Link href="/learn" className="px-3 py-2 rounded-md hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Learn</Link>
          <Link href="/funds" className="px-3 py-2 rounded-md hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Funds</Link>
          <Link href="/learn/tools" className="px-3 py-2 rounded-md hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Tools</Link>
          <span className="mx-1 text-black/30">|</span>
          <Link href="/market" className="px-3 py-2 rounded-md hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Market</Link>
          <Link href="/market/compare" className="px-3 py-2 rounded-md bg-black text-white hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Compare</Link>
          <Link href="/market/about" className="px-3 py-2 rounded-md hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">About</Link>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

