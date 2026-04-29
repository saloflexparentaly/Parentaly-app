import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const ThemeCtx = createContext({ mode: "auto", setMode: () => {}, effective: "dark" });

const STORAGE_KEY = "parentelia-theme";

function getEffective(mode) {
  if (mode !== "auto") return mode;
  const h = new Date().getHours();
  return h >= 7 && h < 19 ? "light" : "dark";
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || "auto"; } catch { return "auto"; }
  });
  const [effective, setEffective] = useState(() => getEffective(mode));
  const modeRef = useRef(mode);
  const effectiveRef = useRef(effective);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { effectiveRef.current = effective; }, [effective]);

  const applyTheme = useCallback((m) => {
    const eff = getEffective(m);
    document.documentElement.setAttribute("data-theme", eff);
    setEffective(eff);
  }, []);

  const setMode = useCallback((m) => {
    setModeState(m);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(m)); } catch {}
    applyTheme(m);
  }, [applyTheme]);

  useEffect(() => {
    applyTheme(mode);
    // Check every 30min for auto mode
    const interval = setInterval(() => {
      if (modeRef.current === "auto") {
        const next = getEffective("auto");
        if (next !== effectiveRef.current) {
          document.documentElement.setAttribute("data-theme", next);
          setEffective(next);
        }
      }
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  return (
    <ThemeCtx.Provider value={{ mode, setMode, effective }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
