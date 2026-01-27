"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";

export default function ToolsPage() {
  const [fund, setFund] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function handleSearch(q) {
    if (!q) { setFund(null); setError(""); setStatus(""); return; }
    setStatus("Searching...");
    try {
      let code = String(q).trim();
      let json;
      if (!/^\d+$/.test(code)) {
        const listRes = await fetch(`/api/mf`, { cache: "no-store" });
        const list = listRes.ok ? await listRes.json() : [];
        const lower = code.toLowerCase();
        const exact = list.find(x=>x.schemeName.toLowerCase()===lower);
        const first = exact || list.find(x=>x.schemeName.toLowerCase().includes(lower));
        if (!first) throw new Error("Not found");
        code = first.schemeCode;
      }
      const res = await fetch(`https://api.mfapi.in/mf/${code}`);
      if (!res.ok) throw new Error("Not found");
      json = await res.json();
      if (!json?.data) { setFund(null); setError("No data"); return; }
      setFund({ ...json, data: [...json.data].sort((a,b)=>{
        const [da,ma,ya]=a.date.split("-"); const [db,mb,yb]=b.date.split("-");
        return new Date(yb,mb-1,db)-new Date(ya,ma-1,da);
      })});
      setError("");
      setStatus("1 result.");
    } catch (e) {
      setError("Invalid code or network error");
      setFund(null);
      setStatus("0 results.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Tools</h1>
      <p className="text-sm text-black/70">Search by <strong>scheme code</strong> (e.g., 100027) or <strong>scheme name</strong>.</p>
      <label className="sr-only" htmlFor="scheme-input">Scheme code or name</label>
      <SearchBar onSearch={handleSearch} placeholder="Enter scheme code or name" />
      <div aria-live="polite" className="sr-only">{status}</div>
      {!fund && !error && <EmptyState title="Awaiting input" description="Enter a scheme code above to view a summary." />}
      {error && <EmptyState title="No results" description={error} />}
      {fund && (
        <div className="bg-white border rounded-lg p-4">
          <div className="font-semibold">{fund?.meta?.scheme_name}</div>
          <div className="text-sm text-gray-600">Latest: {fund?.data?.[0]?.nav} on {fund?.data?.[0]?.date}</div>
          <div className="mt-3">
            <a href={`/learn/fund/${fund?.meta?.scheme_code}`} className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-emerald)] hover:underline">Open full details →</a>
          </div>
        </div>
      )}
    </div>
  );
}

