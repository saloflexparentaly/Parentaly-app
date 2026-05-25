import { createContext, useContext, useEffect } from "react";

const ThemeCtx = createContext({ mode: "dark", setMode: () => {}, effective: "dark" });

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return (
    <ThemeCtx.Provider value={{ mode: "dark", setMode: () => {}, effective: "dark" }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
