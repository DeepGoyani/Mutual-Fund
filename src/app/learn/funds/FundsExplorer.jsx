"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import FundList from "@/components/FundList";

const API = "https://api.mfapi.in";
const BATCH_SIZE = 12; // how many fund details to fetch per page

export default function FundsExplorer() {
  const [schemes, setSchemes] = useState([]); // [{schemeCode, scheme_name}]
  const [funds, setFunds] = useState([]); // normalized { meta, data }
  const [page, setPage] = useState(0);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [status, setStatus] = useState("");
  const abortRef = useRef(null);

  // Load scheme list once
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingList(true);
        setStatus("Loading scheme list...");
        const res = await fetch(`${API}/mf`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed list");
        const json = await res.json();
        // Normalize a bit and cap nothing (full list); sort by name asc for usability
        const list = (json || [])
          .map((s) => ({ code: String(s.schemeCode || s.scheme_code || ""), name: s.schemeName || s.scheme_name || "" }))
          .filter((s) => s.code && s.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (!active) return;
        setSchemes(list);
        setStatus(`Loaded ${list.length} schemes.`);
      } catch (e) {
        setStatus("Failed to load scheme list.");
      } finally {
        setLoadingList(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const hasMore = useMemo(() => {
    return (page * BATCH_SIZE) < schemes.length;
  }, [page, schemes.length]);

  async function loadNextBatch() {
    if (loadingBatch) return;
    const start = page * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, schemes.length);
    const slice = schemes.slice(start, end);
    if (!slice.length) return;

    setLoadingBatch(true);
    setStatus(`Loading ${slice.length} funds...`);

    // cancel prior batch if still inflight
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const results = await Promise.all(
        slice.map(async (s) => {
          try {
            const r = await fetch(`${API}/mf/${s.code}`, { signal: controller.signal });
            if (!r.ok) return null;
            const j = await r.json();
            const sorted = [...(j.data || [])].sort((a, b) => {
              const [da, ma, ya] = String(a.date || "").split("-");
              const [db, mb, yb] = String(b.date || "").split("-");
              return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
            });
            return {
              meta: j.meta || { scheme_name: s.name, scheme_code: s.code },
              data: sorted,
            };
          } catch {
            return null;
          }
        })
      );
      const valid = results.filter(Boolean);
      setFunds((prev) => [...prev, ...valid]);
      setPage((p) => p + 1);
      setStatus(`Loaded ${valid.length} funds (total ${funds.length + valid.length}).`);
    } catch (e) {
      setStatus("Batch load cancelled or failed.");
    } finally {
      setLoadingBatch(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-black/60" aria-live="polite">{status}</div>
      {funds.length > 0 && <FundList funds={funds} />}
      <div className="flex items-center gap-2">
        <button
          disabled={loadingList || loadingBatch || !hasMore}
          onClick={loadNextBatch}
          className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-black/5 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {loadingBatch ? "Loading..." : hasMore ? "Load More" : "No More"}
        </button>
        <div className="text-xs text-black/50">Showing {funds.length} of {schemes.length || 0}</div>
      </div>
    </div>
  );
}
