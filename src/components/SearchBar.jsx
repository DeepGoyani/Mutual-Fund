import { useState, useEffect } from "react";

export default function SearchBar({ onSearch, placeholder = "Enter scheme code" }) {
  const [q, setQ] = useState("");
  useEffect(() => {
    const id = setTimeout(() => onSearch?.(q.trim()), 300);
    return () => clearTimeout(id);
  }, [q, onSearch]);
  return (
    <input
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm shadow-sm placeholder:text-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    />
  );
}
