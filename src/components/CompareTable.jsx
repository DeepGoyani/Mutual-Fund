export default function CompareTable({ items = [] }) {
  if (!items.length) return <div className="text-sm text-gray-600">No comparison data.</div>;
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-gray-50/60">
          <tr className="border-b">
            <th className="p-3 text-left font-semibold text-black/70">Code</th>
            <th className="p-3 text-left font-semibold text-black/70">Name</th>
            <th className="p-3 text-right font-semibold text-black/70">Latest NAV</th>
            <th className="p-3 text-left font-semibold text-black/70">Date</th>
            <th className="p-3 text-right font-semibold text-black/70">3m %</th>
            <th className="p-3 text-right font-semibold text-black/70">6m %</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={it.meta?.schemeCode} className={"border-b last:border-0 "+(idx%2?"bg-gray-50/40":"bg-white")}>
              <td className="p-3 whitespace-nowrap">{it.meta?.schemeCode}</td>
              <td className="p-3">{it.meta?.scheme_name || it.meta?.schemeName}</td>
              <td className="p-3 text-right tabular-nums">{it.data?.[0]?.nav ?? "—"}</td>
              <td className="p-3 whitespace-nowrap">{it.data?.[0]?.date ?? "—"}</td>
              <td className="p-3 text-right tabular-nums">{it.returns?.m3 ?? "—"}</td>
              <td className="p-3 text-right tabular-nums">{it.returns?.m6 ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

