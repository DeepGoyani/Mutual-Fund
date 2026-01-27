export default function EmptyState({ title = "No results", description = "Try a different query" }) {
  return (
    <div className="text-center text-sm text-gray-600 border rounded-lg p-6 bg-white">
      <div className="font-medium mb-1">{title}</div>
      <div>{description}</div>
    </div>
  );
}
