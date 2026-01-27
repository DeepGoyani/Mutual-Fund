import { fetchFund } from "@/utils/fetchFund";
import { trailingReturn } from "@/utils/computeReturns";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export async function getStaticProps() {
  const fallback = ["122639","120492","125497","118825","125354"]; 
  const fromEnv = process.env.NEXT_PUBLIC_MARKET_CODES?.split(",").map((s)=>s.trim()).filter(Boolean);
  const codes = (fromEnv?.length ? fromEnv : fallback).slice(0,5);
  const funds = (await Promise.all(codes.map((c)=>fetchFund(c, { cache: "force-cache" })))).filter(Boolean);
  const items = funds.map((f)=>{
    const latest = f.data?.[0] || null;
    const m1 = trailingReturn(f.data, 1).pct;
    return {
      code: f.meta?.scheme_code || f.meta?.schemeCode || null,
      name: f.meta?.scheme_name,
      latestNav: latest?.nav ?? null,
      latestDate: latest?.date ?? null,
      m1,
    };
  });
  return { props: { items }, revalidate: 3600 };
}

export default function MarketHome({ items = [] }) {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, isValidating, mutate } = useSWR("/api/market/snapshot", fetcher, { refreshInterval: 30000, revalidateOnFocus: false });
  const liveItems = data?.items;
  const updatedAt = data?.updatedAt ? new Date(data.updatedAt) : null;
  const display = useMemo(() => (Array.isArray(liveItems) && liveItems.length ? liveItems : items), [liveItems, items]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex items-end justify-between gap-2">
        <h1 className="text-2xl font-semibold">Market Snapshot <span className="text-xs align-middle ml-2 rounded bg-green-100 text-green-700 px-2 py-0.5">Live</span></h1>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">{updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : "Using static snapshot"}</div>
          <button onClick={() => mutate()} disabled={isValidating} className="text-xs border rounded px-2 py-1 bg-white hover:bg-black/5 disabled:opacity-50">
            {isValidating ? "Refreshing..." : "Refresh now"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {display.map((it, idx) => (
          <div key={it.code || idx} className="bg-white border rounded-lg p-4">
            <div className="text-sm text-gray-500">{it.code}</div>
            <div className="font-semibold mb-1">{it.name}</div>
            <div className="text-sm">Latest: {it.latestNav ?? "—"} on {it.latestDate ?? "—"}</div>
            <div className="text-sm">1m: {it.m1 ?? "—"}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
