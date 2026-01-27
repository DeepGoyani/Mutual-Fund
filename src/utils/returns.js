import { parseDMY, nearestWithin, formatDMY } from "@/utils/dates";

function pct(a, b) {
  if (a == null || b == null) return null;
  const aa = parseFloat(a);
  const bb = parseFloat(b);
  if (!isFinite(aa) || !isFinite(bb) || bb === 0) return null;
  return ((aa - bb) / bb) * 100;
}

export function sortSeriesDesc(series = []) {
  return [...series].sort((a, b) => {
    const ta = parseDMY(a.date)?.getTime() || 0;
    const tb = parseDMY(b.date)?.getTime() || 0;
    return tb - ta;
  });
}

export function computePeriodReturn(series = [], months = 1) {
  if (!series?.length) return { startDate: null, endDate: null, startNAV: null, endNAV: null, simpleReturn: null, annualizedReturn: null, note: "—" };
  const sorted = sortSeriesDesc(series);
  const end = sorted[0];
  const endDate = parseDMY(end.date);
  const target = new Date(endDate);
  target.setMonth(target.getMonth() - months);
  const start = nearestWithin(sorted, target, 3, true);
  const simple = pct(end.nav, start?.nav);
  const years = months / 12;
  const ann = (simple == null || years <= 0) ? null : (Math.pow((parseFloat(end.nav) / parseFloat(start.nav)), 1 / years) - 1) * 100;
  return {
    startDate: start?.date || null,
    endDate: end?.date || null,
    startNAV: start?.nav != null ? parseFloat(start.nav) : null,
    endNAV: end?.nav != null ? parseFloat(end.nav) : null,
    simpleReturn: simple != null ? +simple.toFixed(2) : null,
    annualizedReturn: ann != null && isFinite(ann) ? +ann.toFixed(2) : null,
    note: start ? "Nearest NAV within ±3 days used" : "—",
  };
}

export function computeCustomReturn(series = [], fromIso, toIso) {
  const sorted = sortSeriesDesc(series);
  if (!sorted.length) return { startDate: null, endDate: null, startNAV: null, endNAV: null, simpleReturn: null, annualizedReturn: null, note: "—" };
  const to = new Date(toIso);
  const from = new Date(fromIso);
  const start = nearestWithin(sorted, from, 3, true);
  const end = nearestWithin(sorted, to, 3, false) || sorted[0];
  const simple = pct(end?.nav, start?.nav);
  const years = (to - from) / (365.25 * 24 * 3600 * 1000);
  const ann = (simple == null || years <= 0) ? null : (Math.pow((parseFloat(end.nav) / parseFloat(start.nav)), 1 / years) - 1) * 100;
  return {
    startDate: start?.date || (fromIso ? formatDMY(new Date(fromIso)) : null),
    endDate: end?.date || (toIso ? formatDMY(new Date(toIso)) : null),
    startNAV: start?.nav != null ? parseFloat(start.nav) : null,
    endNAV: end?.nav != null ? parseFloat(end.nav) : null,
    simpleReturn: simple != null ? +simple.toFixed(2) : null,
    annualizedReturn: ann != null && isFinite(ann) ? +ann.toFixed(2) : null,
    note: start && end ? "Nearest NAV within ±3 days used" : "—",
  };
}
