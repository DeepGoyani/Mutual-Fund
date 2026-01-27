export default function FundDetail({ fund, limit = 30 }) {
  if (!fund) return null;
  const { meta, data } = fund;
  const rows = (data || []).slice(0, limit);
  return (
    <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b bg-gray-50/60">
        <h2 className="font-semibold text-lg leading-tight">{meta?.scheme_name || meta?.schemeName}</h2>
        <div className="text-xs text-black/60">Code: <span className="bg-black/5 px-1.5 py-0.5 rounded">{meta?.scheme_code || meta?.schemeCode}</span></div>
      </div>
      <div className="px-5 pt-4">
        {rows.length > 1 && (
          <Sparkline series={rows} />
        )}
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full text-sm">
          <thead className="sticky top-[56px] bg-white">
            <tr className="border-b">
              <th className="text-left p-3 font-semibold text-black/70">Date</th>
              <th className="text-right p-3 font-semibold text-black/70">NAV</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className={"border-b last:border-0 "+(idx%2?"bg-gray-50/40":"bg-white")}>
                <td className="p-3">{r.date}</td>
                <td className="p-3 text-right tabular-nums">{r.nav}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Sparkline({ series }) {
  const width = 600;
  const height = 120;
  const padding = 8;
  const points = [...series].slice().reverse().map((d)=>({
    date: d.date,
    nav: parseFloat(d.nav)
  })).filter((d)=>isFinite(d.nav));
  const n = points.length;
  if (!n) return null;
  const min = Math.min(...points.map(p=>p.nav));
  const max = Math.max(...points.map(p=>p.nav));
  const x = (i)=> padding + (i*(width-2*padding))/(n-1 || 1);
  const y = (v)=> padding + (height-2*padding)*(1-( (v-min)/((max-min)||1) ));
  const path = points.map((p,i)=>`${i===0?"M":"L"}${x(i)},${y(p.nav)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28" aria-label="NAV sparkline">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1ABC9C" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1ABC9C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${width-padding},${height-padding} L ${padding},${height-padding} Z`} fill="url(#sg)" />
      <path d={path} stroke="#0A1F44" strokeWidth="2" fill="none" />
    </svg>
  );
}

