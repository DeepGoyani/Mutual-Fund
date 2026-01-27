import AppLinkCard from "@/components/AppLinkCard";

export const dynamic = "force-static"; // SSG

export default function LearnHome() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Learn</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppLinkCard title="Funds (ISR)" description="Daily refreshed curated list of 10 funds" href="/learn/funds" />
        <AppLinkCard title="Fund Detail (SSR)" description="Open any fund by code from the list" href="/learn/fund/100027" />
        <AppLinkCard title="Tools (CSR)" description="Search fund by code or name client-side" href="/learn/tools" />
        <AppLinkCard title="Market (Pages Router)" description="Navigate to Market routes under Pages Router" href="/market" />
      </div>
    </div>
  );
}
