import { NextResponse } from "next/server";
import { fetchFund } from "@/utils/fetchFund";
import { trailingReturn } from "@/utils/computeReturns";

const API = "https://api.mfapi.in/mf";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "30", 10), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

  // Get all schemes list and paginate
  const resList = await fetch(API, { cache: "no-store" });
  if (!resList.ok) return NextResponse.json({ error: "list_failed" }, { status: 502 });
  const all = await resList.json();
  const normalized = (all || [])
    .map((s) => ({ code: String(s.schemeCode || s.scheme_code || ""), name: s.schemeName || s.scheme_name || "" }))
    .filter((s) => s.code && s.name);
  const total = normalized.length;
  const slice = normalized.slice(offset, offset + limit);

  const funds = (await Promise.all(slice.map((s)=>fetchFund(s.code, { cache: "no-store" })))).filter(Boolean);
  const items = funds.map((f)=>{
    const latest = f.data?.[0] || null;
    const m1 = trailingReturn(f.data, 1).pct;
    return {
      code: f.meta?.scheme_code || f.meta?.schemeCode || null,
      name: f.meta?.scheme_name || null,
      latestNav: latest?.nav ?? null,
      latestDate: latest?.date ?? null,
      m1,
    };
  });
  return NextResponse.json({ items, updatedAt: Date.now(), total, hasMore: offset + limit < total, nextOffset: offset + limit }, { headers: { "Cache-Control": "no-store" } });
}
