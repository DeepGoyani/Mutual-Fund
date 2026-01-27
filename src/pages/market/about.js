export async function getStaticProps() { return { props: {}, revalidate: false }; }

export default function About() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-3">
      <h1 className="text-2xl font-semibold">About: Dual Router Architecture</h1>
      <p className="text-sm">This project demonstrates using Next.js App Router under <code>/app</code> and Pages Router under <code>/pages</code> in the same codebase.</p>
      <ul className="list-disc pl-6 text-sm space-y-1">
        <li>SSG: <code>/learn</code> (App), <code>/market/about</code> (Pages)</li>
        <li>ISR: <code>/learn/funds</code> (App daily), <code>/market</code> (Pages hourly)</li>
        <li>SSR: <code>/learn/fund/[code]</code> (App), <code>/market/fund/[code]</code> (Pages)</li>
        <li>CSR: <code>/learn/tools</code> (App), <code>/market/compare</code> (Pages)</li>
      </ul>
      <p className="text-sm">Data from MFAPI: <code>GET /mf</code> and <code>GET /mf/&lt;schemeCode&gt;</code>. Latest NAV from <code>data[0]</code> after date-desc sorting. Returns use nearest NAV within ±3 days.</p>
    </div>
  );
}
