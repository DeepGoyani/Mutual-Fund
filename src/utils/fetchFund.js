const API_BASE = "https://api.mfapi.in";

export async function fetchSchemeList() {
  const res = await fetch(`${API_BASE}/mf`, { cache: "force-cache" });
  if (!res.ok) throw new Error("Failed to fetch scheme list");
  return res.json();
}

export async function fetchFund(code, { cache = "no-store" } = {}) {
  if (!code) return null;
  const res = await fetch(`${API_BASE}/mf/${code}`, { cache });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json?.data) return null;
  const sorted = [...json.data].sort((a, b) => {
    // date format DD-MM-YYYY
    const [da, ma, ya] = a.date.split("-");
    const [db, mb, yb] = b.date.split("-");
    const ta = new Date(+ya, ma - 1, +da).getTime();
    const tb = new Date(+yb, mb - 1, +db).getTime();
    return tb - ta;
  });
  return { ...json, data: sorted };
}
