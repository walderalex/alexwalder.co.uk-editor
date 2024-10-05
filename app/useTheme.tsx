import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(
      !!localStorage.getItem("theme-mode") ||
        matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, []);
  useEffect(() => {
    localStorage.setItem("theme-mode", isDark ? "1" : "");
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);
  return [isDark, setIsDark] as const;
}
