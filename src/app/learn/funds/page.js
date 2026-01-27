import FundList from "@/components/FundList";
import { fetchFund } from "@/utils/fetchFund";
import FundsExplorer from "./FundsExplorer";

export const revalidate = 86400; // ISR daily

function getCuratedCodes() {
  const fromEnv = process.env.NEXT_PUBLIC_CURATED_CODES?.split(",").map((s) => s.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv.slice(0, 10) : [
    "122639","120492","125497","118825","125354","118955","120166","120586","118778","130503"
  ];
}

export default async function FundsPage() {
  const codes = getCuratedCodes();
  const funds = await Promise.all(codes.map((c) => fetchFund(c, { cache: "force-cache" })));
  const valid = funds.filter(Boolean);
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Curated Funds</h1>
      <FundList funds={valid} />
      <div className="pt-6">
        <h2 className="text-xl font-semibold mb-2">Live from API</h2>
        <p className="text-sm text-black/70 mb-3">Loading more funds directly from MFAPI. Use Load More to fetch additional items.</p>
        <FundsExplorer />
      </div>
    </div>
  );
}
