import { NextResponse } from "next/server";
import { computePeriodReturn, computeCustomReturn, sortSeriesDesc } from "@/utils/returns";

export async function GET(req, { params }) {
  const code = (await params)?.code;
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const res = await fetch(`https://api.mfapi.in/mf/${code}`, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const json = await res.json();
  const series = sortSeriesDesc(json?.data || []);

  let result;
  if (period) {
    const map = { "1m": 1, "3m": 3, "6m": 6, "1y": 12 };
    const months = map[period];
    if (!months) return NextResponse.json({ error: "Invalid period" }, { status: 400 });
    result = computePeriodReturn(series, months);
  } else if (from && to) {
    result = computeCustomReturn(series, from, to);
  } else {
    return NextResponse.json({ error: "Provide period or from&to" }, { status: 400 });
  }

  return NextResponse.json(result, { headers: { "Cache-Control": "public, s-maxage=600" } });
}
