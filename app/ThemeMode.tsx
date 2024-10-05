"use client";

import { Switch } from "@fluentui/react-components";
import { useTheme } from "./useTheme";

export default function ThemeModeControl() {
  const [isDark, setIsDark] = useTheme();
  return (
    <div>
      <Switch
        label={isDark ? "Dark mode" : "Light mode"}
        checked={isDark}
        onChange={() => setIsDark((c) => !c)}
      ></Switch>
    </div>
  );
}
