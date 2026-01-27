"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("mf-theme");
    const initial = stored || "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") localStorage.setItem("mf-theme", next);
    document.documentElement.setAttribute("data-theme", next === "dark" ? "dark" : "light");
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-xs font-medium shadow-sm hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <span className="inline-block h-4 w-4 rounded-full"
        style={{ background: theme === "dark" ? "#0A1F44" : "#1ABC9C" }} />
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
