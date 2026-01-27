"use client";
import { useEffect, useState } from "react";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
];

export default function LanguageSwitcher({ onChange }) {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("mf-lang");
    const initial = stored || "en";
    setLang(initial);
    onChange?.(initial);
  }, [onChange]);

  function handleChange(e) {
    const val = e.target.value;
    setLang(val);
    if (typeof window !== "undefined") localStorage.setItem("mf-lang", val);
    onChange?.(val);
  }

  return (
    <select aria-label="Language selector" value={lang} onChange={handleChange}
      className="rounded-md border border-black/10 bg-white px-2.5 py-2 text-xs shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      {LANGS.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
