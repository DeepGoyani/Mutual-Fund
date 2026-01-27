import FundDetail from "@/components/FundDetail";
import EmptyState from "@/components/EmptyState";
import { fetchFund } from "@/utils/fetchFund";
import NavChart from "@/components/NavChart";
import ReturnsTable from "@/components/ReturnsTable";
import InvestTabs from "@/components/InvestTabs";

export const dynamic = "force-dynamic"; // SSR

export default async function FundByCode({ params }) {
  const { code } = await params;
  const fund = await fetchFund(code, { cache: "no-store" });
  if (!fund) return (
    <div className="max-w-6xl mx-auto p-4">
      <EmptyState title="Invalid or unknown code" description="Please go back and pick a fund from the list." />
    </div>
  );
  const meta = fund.meta || {};
  const latest = fund.data?.[0];
  const codeVal = meta?.scheme_code || meta?.schemeCode || code;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b bg-gray-50/60">
          <h1 className="font-bold text-xl leading-tight">{meta?.scheme_name || meta?.schemeName}</h1>
          <div className="text-xs text-black/60 mt-1">Code: <span className="bg-black/5 px-1.5 py-0.5 rounded">{codeVal}</span>{latest ? ` • Latest ${latest.nav} on ${latest.date}` : ""}</div>
          <div className="mt-2 flex gap-2 flex-wrap text-[12px] text-black/70">
            {meta?.fund_house && <span className="rounded bg-black/5 px-2 py-0.5">{meta.fund_house}</span>}
            {meta?.scheme_type && <span className="rounded bg-black/5 px-2 py-0.5">{meta.scheme_type}</span>}
            {meta?.scheme_category && <span className="rounded bg-black/5 px-2 py-0.5">{meta.scheme_category}</span>}
          </div>
        </div>
        <div className="p-4">
          <div className="rounded-lg border border-black/10 bg-white p-3 mb-3">
            <div className="font-semibold mb-2">NAV Chart</div>
            <NavChart code={String(codeVal)} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-lg border border-black/10 bg-white p-4">
              <InvestTabs code={String(codeVal)} />
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-black/10 bg-white p-3">
                <div className="font-semibold mb-2">Returns</div>
                <ReturnsTable code={String(codeVal)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
