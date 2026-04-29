import { useTheme } from "./ThemeProvider";

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <line x1="12" y1="7" x2="12" y2="12"/>
    <line x1="12" y1="12" x2="15.5" y2="14"/>
  </svg>
);

const BUTTONS = [
  { id: "light", Icon: SunIcon,  label: "Thème clair" },
  { id: "dark",  Icon: MoonIcon, label: "Thème sombre" },
  { id: "auto",  Icon: ClockIcon, label: "Automatique" },
];

export function ThemeToggle() {
  const { mode, setMode, effective } = useTheme();

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        display: "inline-flex",
        padding: 4,
        background: "var(--surface)",
        border: "1px solid var(--surface-border)",
        borderRadius: 999,
      }}>
        {BUTTONS.map(({ id, Icon, label }) => {
          const active = mode === id;
          return (
            <button
              key={id}
              aria-label={label}
              title={label}
              onClick={() => setMode(id)}
              style={{
                width: 36, height: 36, borderRadius: 999, border: "none",
                cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: active
                  ? "linear-gradient(135deg, var(--accent), var(--accent-deep))"
                  : "transparent",
                color: active ? "#FFF1E6" : "var(--ink-soft)",
                boxShadow: active ? "0 2px 8px rgba(201,117,96,0.3)" : "none",
                transition: "all 250ms ease",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--surface-tint)"; e.currentTarget.style.color = "var(--ink)"; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink-soft)"; } }}
            >
              <Icon />
            </button>
          );
        })}
      </div>
      {mode === "auto" && (
        <span style={{
          fontSize: 11, color: "var(--ink-faint)",
          fontFamily: "'Jost', system-ui, sans-serif",
          letterSpacing: ".01em",
        }}>
          Suit l'heure · {effective === "light" ? "clair jusqu'à 19h" : "sombre jusqu'à 7h"}
        </span>
      )}
    </div>
  );
}
