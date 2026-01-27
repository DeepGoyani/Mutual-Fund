import Link from "next/link";

export default function AppLinkCard({ title, description, href, cta = "Open" }) {
  return (
    <Link href={href} className="group block rounded-xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <h3 className="font-semibold mb-1 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{description}</p>
      <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium">{cta}
        <span className="transition group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}
