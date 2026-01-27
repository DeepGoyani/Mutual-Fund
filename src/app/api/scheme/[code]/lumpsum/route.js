import { NextResponse } from "next/server";
import { sortSeriesDesc } from "@/utils/returns";
import { parseDMY, nearestWithin, formatDMY } from "@/utils/dates";

export async function POST(req, { params }) {
  const code = (await params)?.code;
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  const { amount, from, to } = body || {};
  if (!amount || !from || !to) return NextResponse.json({ error: "amount, from, to required" }, { status: 400 });

  const res = await fetch(`https://api.mfapi.in/mf/${code}`, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const json = await res.json();
  const series = sortSeriesDesc(json?.data || []);
  if (!series.length) return NextResponse.json({ status: "needs_review" });

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const start = nearestWithin(series, fromDate, 3650, true);
  const end = nearestWithin(series, toDate, 3650, false) || series[0];
  if (!start || !end) return NextResponse.json({ status: "needs_review" });

  const startNAV = parseFloat(start.nav);
  const endNAV = parseFloat(end.nav);
  if (!isFinite(startNAV) || startNAV <= 0 || !isFinite(endNAV)) return NextResponse.json({ status: "needs_review" });

  const units = amount / startNAV;
  const currentValue = units * endNAV;
  const totalInvested = amount;
  const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
  const years = (toDate - fromDate) / (365.25 * 24 * 3600 * 1000);
  const annualizedReturn = years > 0 ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100 : null;

  // Build timeline across available series between from..to (ascending)
  const asc = [...series].sort((a,b)=>{
    const ta = parseDMY(a.date)?.getTime()||0; const tb = parseDMY(b.date)?.getTime()||0; return ta-tb;
  });
  const timeline = [];
  for (const pt of asc) {
    const t = parseDMY(pt.date);
    if (!t) continue;
    if (t < start ? true : false) continue;
    if (t > toDate) break;
    const nav = parseFloat(pt.nav);
    if (!isFinite(nav) || nav <= 0) continue;
    timeline.push({ date: pt.date, invested: +totalInvested.toFixed(2), units: +units.toFixed(6), value: +(units * nav).toFixed(2) });
  }

  return NextResponse.json({
    status: "ok",
    startDate: start.date,
    endDate: end.date,
    startNAV: +startNAV.toFixed(5),
    endNAV: +endNAV.toFixed(5),
    totalInvested: +totalInvested.toFixed(2),
    units: +units.toFixed(6),
    currentValue: +currentValue.toFixed(2),
    absoluteReturn: +absoluteReturn.toFixed(2),
    annualizedReturn: annualizedReturn != null ? +annualizedReturn.toFixed(2) : null,
    timeline,
  });
}
