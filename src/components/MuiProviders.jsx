"use client";
import * as React from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export default function MuiProviders({ children }) {
  const [mode, setMode] = React.useState("light");
  React.useEffect(() => {
    const html = document.documentElement;
    const val = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setMode(val);
    const obs = new MutationObserver(() => {
      const m = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
      setMode(m);
    });
    obs.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const theme = React.useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: "#0A2540" },
      secondary: { main: "#2ECC71" },
      background: { default: mode === "light" ? "#FAFAFA" : "#0b1220" },
    },
    typography: { fontFamily: "Inter, Roboto, system-ui, -apple-system, Segoe UI, Arial" },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
