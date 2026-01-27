export function parseDMY(d) {
  if (!d) return null;
  const [dd, mm, yy] = String(d).split("-").map(Number);
  return new Date(yy, (mm || 1) - 1, dd || 1);
}

export function formatDMY(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = date.getFullYear();
  return `${dd}-${mm}-${yy}`;
}

export function nearestWithin(series, target, windowDays = 3, preferPast = false) {
  const t = target.getTime();
  const win = windowDays * 24 * 60 * 60 * 1000;
  let best = null;
  let bestDiff = Infinity;
  for (const pt of series) {
    const ts = parseDMY(pt.date)?.getTime();
    if (!ts) continue;
    const diff = Math.abs(ts - t);
    if (diff <= win && diff < bestDiff) {
      if (preferPast && ts > t) continue;
      best = pt;
      bestDiff = diff;
    }
  }
  return best;
}

export function rangeFromPeriod(latestDate, months) {
  const start = new Date(latestDate);
  start.setMonth(start.getMonth() - months);
  return { from: start, to: latestDate };
}
