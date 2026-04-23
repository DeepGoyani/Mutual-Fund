'use client'
import Link from "next/link";
import { AddToWatchlistButton } from "@/components/WatchlistButton";

export default function FundSummaryCard({ fund }) {
  if (!fund) return null;
  const { meta, data } = fund;
  const latest = data?.[0];
  return (
    <div className="group rounded-xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1 text-xs text-black/60">
          Code
          <span className="inline-block rounded bg-black/5 px-2 py-0.5 font-medium text-black/70">{meta?.scheme_code}</span>
        </span>
        <AddToWatchlistButton 
          code={meta?.scheme_code} 
          name={meta?.scheme_name || meta?.schemeName}
          size="small"
        />
      </div>
      <h4 className="font-semibold mb-2 leading-snug line-clamp-2">{meta?.scheme_name || meta?.schemeName}</h4>
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold tracking-tight">{latest?.nav ?? "—"}</div>
        <div className="text-xs text-black/60">as of <span className="rounded bg-black/5 px-1.5 py-0.5">{latest?.date ?? "—"}</span></div>
      </div>
      <div className="mt-4">
        <Link href={`/learn/fund/${meta?.scheme_code}`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
          View details <span className="transition group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}

