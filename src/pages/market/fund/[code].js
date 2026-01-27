import { fetchFund } from "@/utils/fetchFund";
import { trailingReturn } from "@/utils/computeReturns";

export async function getServerSideProps({ params }) {
  const code = params?.code;
  const fund = await fetchFund(code, { cache: "no-store" });
  if (!fund) return { props: { notFound: true } };
  const r1 = trailingReturn(fund.data, 1);
  const r3 = trailingReturn(fund.data, 3);
  return { props: { fund, r1, r3 } };
}

export default function FundSSR({ fund, r1, r3, notFound }) {
  if (notFound) return <div className="max-w-5xl mx-auto p-4" role="alert">Invalid or unknown code.</div>;
  const latest = fund?.data?.[0];
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{fund?.meta?.scheme_name}</h1>
      <div className="text-sm">Latest: {latest?.nav} on {latest?.date}</div>
      <div className="text-sm">1m: {r1?.pct ?? "—"}% | 3m: {r3?.pct ?? "—"}%</div>
      {(r1?.note || r3?.note) && (
        <div className="text-xs text-black/60">Data note: Using nearest available NAV within ±3 days when exact date is missing.</div>
      )}
    </div>
  );
}
