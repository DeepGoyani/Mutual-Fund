import { parseDMY, nearestWithin, formatDMY } from "@/utils/dates";

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

function addYears(date, n) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + n);
  return d;
}

export function generateSipSchedule(fromIso, toIso, frequency) {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  if (!(from < to)) return [];
  const pts = [];
  let cur = new Date(from);
  while (cur <= to) {
    pts.push(new Date(cur));
    switch (frequency) {
      case "weekly":
        cur = addDays(cur, 7);
        break;
      case "quarterly":
        cur = addMonths(cur, 3);
        break;
      case "yearly":
        cur = addYears(cur, 1);
        break;
      case "monthly":
      default:
        cur = addMonths(cur, 1);
        break;
    }
  }
  return pts;
}

export function evaluateSip(series = [], { amount, frequency, from, to }) {
  const sorted = [...series].sort((a, b) => {
    const ta = parseDMY(a.date)?.getTime() || 0;
    const tb = parseDMY(b.date)?.getTime() || 0;
    return ta - tb; // ascending for prior lookup
  });
  if (!sorted.length) return { status: "needs_review", totalInvested: 0, totalUnits: 0, currentValue: 0 };
  const schedule = generateSipSchedule(from, to, frequency);
  let totalUnits = 0;
  let installments = 0;
  const timeline = [];
  for (const dt of schedule) {
    // nearest earlier or same-day NAV (preferPast = true)
    const nearest = nearestWithin(sorted, dt, 3650, true) || sorted.find(s => parseDMY(s.date) <= dt);
    if (!nearest) continue;
    const nav = parseFloat(nearest.nav);
    if (!isFinite(nav) || nav <= 0) continue;
    totalUnits += amount / nav;
    installments += 1;
    const investedToDate = installments * amount;
    // value at this date using the same nearest NAV
    const value = totalUnits * nav;
    timeline.push({
      date: nearest.date,
      invested: +investedToDate.toFixed(2),
      units: +totalUnits.toFixed(6),
      value: +value.toFixed(2),
    });
  }
  const totalInvested = installments * amount;
  const end = sorted[sorted.length - 1];
  const endNAV = end ? parseFloat(end.nav) : 0;
  const currentValue = isFinite(endNAV) ? totalUnits * endNAV : 0;
  const absoluteReturn = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : null;
  const years = (new Date(to) - new Date(from)) / (365.25 * 24 * 3600 * 1000);
  const annualizedReturn = (totalInvested > 0 && years > 0 && currentValue > 0)
    ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100
    : null;
  return {
    status: installments ? "ok" : "needs_review",
    installments,
    totalInvested,
    totalUnits: +totalUnits.toFixed(6),
    currentValue: +currentValue.toFixed(2),
    absoluteReturn: absoluteReturn != null ? +absoluteReturn.toFixed(2) : null,
    annualizedReturn: annualizedReturn != null ? +annualizedReturn.toFixed(2) : null,
    endDate: end?.date || null,
    endNAV: endNAV || null,
    timeline,
  };
}
