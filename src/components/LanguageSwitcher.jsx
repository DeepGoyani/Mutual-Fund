"use client";
import { useSyncExternalStore } from "react";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
];

function getStoredLang() {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem("mf-lang") || "en";
}

function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function LanguageSwitcher({ onChange }) {
  const lang = useSyncExternalStore(
    subscribe,
    getStoredLang,
    () => "en"
  );

  function handleChange(e) {
    const val = e.target.value;
    if (typeof window !== "undefined") {
      localStorage.setItem("mf-lang", val);
      window.dispatchEvent(new StorageEvent("storage", { key: "mf-lang" }));
    }
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
