import { NextResponse } from "next/server";
import { getCache, setCache, CacheTTL } from "@/lib/cache";

const API = "https://api.mfapi.in/mf";

export async function GET() {
  const cacheKey = "mf:list";
  const cached = getCache(cacheKey);
  if (cached) return NextResponse.json(cached, { headers: { "Cache-Control": "public, s-maxage=43200" } });

  const res = await fetch(API, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "Failed to fetch" }, { status: 502 });
  const json = await res.json();
  const normalized = (json || []).map((x) => ({
    schemeCode: String(x.schemeCode || x.scheme_code || ""),
    schemeName: x.schemeName || x.scheme_name || "",
    fundHouse: x.fund_house || null,
    category: x.scheme_category || x.category || null,
    type: x.scheme_type || x.type || null,
  })).filter((x) => x.schemeCode && x.schemeName);

  setCache(cacheKey, normalized, CacheTTL(12));
  return NextResponse.json(normalized, { headers: { "Cache-Control": "public, s-maxage=43200" } });
}
