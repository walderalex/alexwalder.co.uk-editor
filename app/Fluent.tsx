"use client";

import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import { ReactNode, useEffect, useState } from "react";

export default function Fluent({ children }: { children?: ReactNode }) {
  const [theme, setTheme] = useState(webLightTheme);
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    function updateThemePref(isDark: boolean) {
      const savedIsDark = !!localStorage.getItem("theme-mode");
      setTheme(isDark || savedIsDark ? webDarkTheme : webLightTheme);
    }
    const body = document.body;
    const mutObs = new MutationObserver(() => {
      const isDark = document.body.getAttribute("data-theme") === "dark";
      updateThemePref(isDark);
    });
    mutObs.observe(body, { attributes: true, attributeFilter: ["data-theme"] });
    updateThemePref(mq.matches);
    function listener(e: MediaQueryListEvent) {
      updateThemePref(e.matches);
    }
    mq.addEventListener("change", listener);
    return () => {
      mq.removeEventListener("change", listener);
      mutObs.disconnect();
    };
  }, []);
  return (
    <FluentProvider theme={theme} className="h-full">
      {children}
    </FluentProvider>
  );
}
