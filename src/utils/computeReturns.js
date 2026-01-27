function parseDMY(d) {
  if (!d) return null;
  const [day, mon, yr] = d.split("-").map((x) => +x);
  return new Date(yr, mon - 1, day);
}

function nearestWithin(series, target, days = 3) {
  const t = target.getTime();
  const window = days * 24 * 60 * 60 * 1000;
  let best = null;
  let bestDiff = Infinity;
  for (const pt of series) {
    const ts = parseDMY(pt.date)?.getTime();
    if (!ts) continue;
    const diff = Math.abs(ts - t);
    if (diff <= window && diff < bestDiff) {
      best = pt;
      bestDiff = diff;
    }
  }
  return best;
}

export function computeReturnPct(latestNav, pastNav) {
  if (!latestNav || !pastNav) return null;
  const l = parseFloat(String(latestNav));
  const p = parseFloat(String(pastNav));
  if (!isFinite(l) || !isFinite(p) || p === 0) return null;
  return (((l - p) / p) * 100).toFixed(2);
}

export function trailingReturn(series = [], months = 1) {
  if (!series.length) return { pct: null, note: "—" };
  const latest = series[0];
  const latestDate = parseDMY(latest.date);
  const target = new Date(latestDate);
  target.setMonth(target.getMonth() - months);
  const past = nearestWithin(series, target, 3);
  const pct = computeReturnPct(latest.nav, past?.nav);
  return { pct, note: past ? "Nearest NAV within ±3 days used" : "—" };
}
