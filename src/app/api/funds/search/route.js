import { NextResponse } from "next/server";
import { getDb, activeSinceDate } from "@/lib/mongo";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const house = (searchParams.get("house") || "").trim();
  const category = (searchParams.get("category") || "").trim();
  const type = (searchParams.get("type") || "").trim();
  const limit = Math.min(parseInt(searchParams.get("limit") || "60", 10), 200);
  const skip = Math.max(parseInt(searchParams.get("skip") || "0", 10), 0);

  const db = await getDb();
  const col = db.collection("funds");
  const cutoff = activeSinceDate();
  // Use ISO Date field for reliable comparison
  const filter = { latestDateISO: { $gte: cutoff } };
  if (q) filter.schemeName = { $regex: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") };
  if (house) filter.fundHouse = house;
  if (category) filter.category = category;
  if (type) filter.type = type;

  const cursor = col.find(filter).sort({ schemeName: 1 }).skip(skip).limit(limit);
  const items = await cursor.toArray();
  const total = await col.countDocuments(filter);
  return NextResponse.json({ items, total, hasMore: skip + items.length < total });
}
