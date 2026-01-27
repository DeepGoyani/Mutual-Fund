import { NextResponse } from "next/server";
import { evaluateSip } from "@/utils/sip";
import { sortSeriesDesc } from "@/utils/returns";

export async function POST(req, { params }) {
  const code = (await params)?.code;
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  const { amount, frequency = "monthly", from, to } = body || {};
  if (!amount || !from || !to) return NextResponse.json({ error: "amount, from, to required" }, { status: 400 });

  const res = await fetch(`https://api.mfapi.in/mf/${code}`, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const json = await res.json();
  const series = sortSeriesDesc(json?.data || []);

  const result = evaluateSip(series, { amount: Number(amount), frequency, from, to });
  return NextResponse.json(result);
}
