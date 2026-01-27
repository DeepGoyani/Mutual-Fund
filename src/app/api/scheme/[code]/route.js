import { NextResponse } from "next/server";
import { getCache, setCache, CacheTTL } from "@/lib/cache";
import { sortSeriesDesc } from "@/utils/returns";

export async function GET(_req, { params }) {
  const code = (await params)?.code;
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
  const cacheKey = `mf:scheme:${code}`;
  const cached = getCache(cacheKey);
  if (cached) return NextResponse.json(cached, { headers: { "Cache-Control": "public, s-maxage=43200" } });

  const res = await fetch(`https://api.mfapi.in/mf/${code}`, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const json = await res.json();
  if (!json?.data) return NextResponse.json({ error: "No data" }, { status: 404 });

  // Normalize meta fields as much as available from MFAPI response
  const meta = {
    scheme_code: String(json.meta?.scheme_code || json.meta?.schemeCode || code),
    scheme_name: json.meta?.scheme_name || json.meta?.schemeName || null,
    fund_house: json.meta?.fund_house || null,
    scheme_type: json.meta?.scheme_type || null,
    scheme_category: json.meta?.scheme_category || null,
    isin: json.meta?.isin || json.meta?.isin_codes || null,
  };
  const data = sortSeriesDesc(json.data || []);
  const payload = { meta, data };

  setCache(cacheKey, payload, CacheTTL(12));
  return NextResponse.json(payload, { headers: { "Cache-Control": "public, s-maxage=43200" } });
}
