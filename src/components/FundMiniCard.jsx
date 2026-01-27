export default function FundMiniCard({ code, name, onOpen }) {
  return (
    <button onClick={() => onOpen?.(code)}
      className="w-full text-left rounded-lg border border-black/10 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <div className="text-xs text-black/60">{code}</div>
      <div className="font-medium line-clamp-2">{name}</div>
    </button>
  );
}
