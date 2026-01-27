"use client";
import { useState } from "react";
import CompareTable from "@/components/CompareTable";
import { trailingReturn } from "@/utils/computeReturns";

export default function Compare() {
  const [codes, setCodes] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function load() {
    const arr = codes.split(",").map((s)=>s.trim()).filter(Boolean).slice(0,3);
    if (!arr.length) { setItems([]); return; }
    setLoading(true);
    setStatus("Loading...");
    const results = await Promise.all(arr.map(async (c)=>{
      const res = await fetch(`https://api.mfapi.in/mf/${c}`);
      if (!res.ok) return null;
      const json = await res.json();
      const data = [...(json.data||[])].sort((a,b)=>{
        const [da,ma,ya]=a.date.split("-"); const [db,mb,yb]=b.date.split("-");
        return new Date(yb,mb-1,db)-new Date(ya,ma-1,da);
      });
      const m3 = trailingReturn(data, 3).pct;
      const m6 = trailingReturn(data, 6).pct;
      return { meta: json.meta, data, returns: { m3, m6 } };
    }));
    const valid = results.filter(Boolean);
    setItems(valid);
    setStatus(`${valid.length} result${valid.length===1?"":"s"}.`);
    setLoading(false);
  }

  function rebasedSummary() {
    if (!items.length) return null;
    // Build intersection of dates across series
    const dateSets = items.map(it => new Set((it.data||[]).map(d=>d.date)));
    const intersection = [...dateSets[0]].filter(d => dateSets.every(s=>s.has(d)));
    if (!intersection.length) return (
      <div className="text-xs text-black/60">No common date across selections to compute rebased growth.</div>
    );
    // find oldest date (earliest) among intersection (format DD-MM-YYYY)
    const toDate = (d)=>{ const [dd,mm,yy]=d.split("-").map(n=>+n); return new Date(yy,mm-1,dd); };
    const oldestCommon = intersection.reduce((acc, d)=> toDate(d) < toDate(acc) ? d : acc, intersection[0]);
    const baseValues = items.map(it => {
      const base = it.data.find(x=>x.date===oldestCommon);
      const latest = it.data[0];
      if (!base || !latest) return { code: it.meta?.schemeCode, rebased: null };
      const baseNav = parseFloat(base.nav);
      const latestNav = parseFloat(latest.nav);
      if (!isFinite(baseNav) || !isFinite(latestNav) || baseNav===0) return { code: it.meta?.schemeCode, rebased: null };
      const growth = (latestNav / baseNav) * 100; // base=100
      return { code: it.meta?.schemeCode, name: it.meta?.scheme_name, rebased: growth.toFixed(1) };
    });
    return (
      <div className="text-sm mt-2">
        <div className="text-black/70">Rebased growth (base = 100 on {oldestCommon}):</div>
        <ul className="mt-1 text-black/80 list-disc pl-5">
          {baseValues.map(b => (
            <li key={b.code}>{b.name || b.code}: {b.rebased ? `${b.rebased}` : "—"}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Compare Funds</h1>
      <div className="flex gap-2">
        <input value={codes} onChange={(e)=>setCodes(e.target.value)} placeholder="Comma separated codes (max 3)" className="flex-1 border rounded p-2 text-sm" />
        <button onClick={load} className="border rounded px-3 py-2 text-sm bg-black text-white">Compare</button>
      </div>
      <div aria-live="polite" className="sr-only">{status}</div>
      {loading ? <div className="text-sm text-gray-600">Loading...</div> : <CompareTable items={items} />}
      {!loading && items.length>0 && rebasedSummary()}
    </div>
  );
}

