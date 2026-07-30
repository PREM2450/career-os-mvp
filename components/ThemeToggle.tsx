"use client";

import { useEffect } from "react";
import { useCareerStore } from "@/lib/store";

export default function ThemeToggle() {
  const theme = useCareerStore((s) => s.theme);
  const setTheme = useCareerStore((s) => s.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
      className="glass flex h-10 w-10 items-center justify-center rounded-full text-lg transition hover:shadow-glow-cyan"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
