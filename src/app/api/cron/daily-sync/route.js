import { NextResponse } from "next/server";
import { getDb, activeSinceDate } from "@/lib/mongo";

const API_LIST = "https://api.mfapi.in/mf";

async function fetchDetails(code, signal) {
  const r = await fetch(`https://api.mfapi.in/mf/${code}`, { cache: "no-store", signal });
  if (!r.ok) return null;
  const j = await r.json();
  const latest = j?.data?.[0];
  const meta = j?.meta || {};
  return {
    schemeCode: String(meta.scheme_code || meta.schemeCode || code),
    schemeName: meta.scheme_name || meta.schemeName || null,
    fundHouse: meta.fund_house || null,
    category: meta.scheme_category || null,
    type: meta.scheme_type || null,
    latestNav: latest?.nav != null ? parseFloat(latest.nav) : null,
    latestDate: latest?.date || null,
  };
}

export async function GET() {
  const started = Date.now();
  const db = await getDb();
  const fundsCol = db.collection("funds");
  const res = await fetch(API_LIST, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "list_failed" }, { status: 502 });
  const all = await res.json();
  const list = (all || [])
    .map((s) => ({ code: String(s.schemeCode || s.scheme_code || ""), name: s.schemeName || s.scheme_name || "" }))
    .filter((s) => s.code && s.name);

  // Batch with limited concurrency
  const controller = new AbortController();
  const concurrency = 8;
  let idx = 0;
  const results = [];
  async function worker() {
    while (idx < list.length) {
      const i = idx++;
      const d = await fetchDetails(list[i].code, controller.signal).catch(() => null);
      if (d) results.push(d);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));

  const cutoff = activeSinceDate();
  const active = results.filter((r) => {
    if (!r.latestDate) return false;
    const [dd, mm, yy] = String(r.latestDate).split("-").map(Number);
    const dt = new Date(yy, mm - 1, dd);
    return dt >= cutoff && r.latestNav != null && r.latestNav > 0;
  });

  let upserts = 0;
  for (const f of active) {
    const [dd, mm, yy] = String(f.latestDate).split("-").map(Number);
    const latestDateISO = new Date(yy, mm - 1, dd);
    const update = {
      $set: {
        schemeName: f.schemeName,
        fundHouse: f.fundHouse,
        category: f.category,
        type: f.type,
        latestNav: f.latestNav,
        latestDate: f.latestDate,
        latestDateISO,
        updatedAt: new Date(),
      },
      $setOnInsert: { schemeCode: f.schemeCode },
    };
    await fundsCol.updateOne({ schemeCode: f.schemeCode }, update, { upsert: true });
    upserts++;
  }

  const durationMs = Date.now() - started;
  return NextResponse.json({ total: list.length, checked: results.length, active: active.length, upserts, durationMs });
}
