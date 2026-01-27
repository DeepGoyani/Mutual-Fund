import FundSummaryCard from "@/components/FundSummaryCard";

export default function FundList({ funds = [] }) {
  if (!funds.length) return <div className="text-sm text-gray-600">No funds to display.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {funds.map((f, idx) => (
        <FundSummaryCard key={f?.meta?.scheme_code || f?.meta?.schemeCode || idx} fund={f} />
      ))}
    </div>
  );
}
