import { useState, useEffect, useRef, useCallback, Component } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import MentionsLegalesScreen from "./MentionsLegalesScreen";
import ConfidentialiteScreen from "./ConfidentialiteScreen";
import CguScreen from "./CguScreen";
import CgvScreen from "./CgvScreen";
import CookiesScreen from "./CookiesScreen";
import { supabase, getOrCreateSession } from "./supabase.js";
import { calcAge, detectMultiple } from "../shared.js";

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base-1,#1F1418)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", marginBottom: 16 }}>Une erreur est survenue. Merci de recharger la page.</p>
          <button onClick={() => window.location.reload()} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#B96A4B,#9A4F32)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 15 }}>Recharger</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}


// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body, #root {
      height: 100%;
      font-family: 'Jost', system-ui, sans-serif;
      color: var(--ink);
      background: var(--bg-base-1);
      -webkit-font-smoothing: antialiased;
    }

    .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
    input, textarea, button { font-family: 'Jost', system-ui, sans-serif; }

    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--surface-border-s); border-radius: 2px; }

    ::selection { background: rgba(201,117,96,0.35); color: #FFF1E6; }

    .field {
      width: 100%; padding: 13px 16px; border-radius: 10px;
      border: 1px solid var(--surface-border-s); background: rgba(245,237,230,0.07);
      color: var(--ink); font-size: 15px; font-weight: 300; outline: none;
    }
    .field:focus { border-color: var(--accent-light); box-shadow: 0 0 0 3px rgba(201,117,96,.15); }
    .field::placeholder { color: var(--ink-faint); }

    .chip {
      padding: 8px 16px; border-radius: 8px;
      border: 1px solid var(--surface-border-s); background: var(--surface-tint);
      color: var(--ink-soft); font-size: 13px; cursor: pointer;
      white-space: nowrap; font-weight: 400;
    }
    .chip:hover { border-color: var(--accent-light); color: var(--ink); background: var(--surface-header); }
    .chip.on { background: var(--accent); border-color: var(--accent); color: #fff; }

    .btn {
      width: 100%; padding: 14px 24px; border-radius: 10px;
      font-size: 15px; font-weight: 500; cursor: pointer; border: none;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      letter-spacing: .03em;
    }
    .btn-t { background: linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%); color: #fff; box-shadow: var(--shadow-cta); }
    .btn-t:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.06); }
    .btn-t:disabled { opacity: .38; cursor: default; transform: none; box-shadow: none; }
    .btn-g {
      background: var(--surface-tint); color: var(--ink-soft);
      border: 1px solid var(--surface-border-s);
      font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 17px;
      backdrop-filter: blur(12px);
    }
    .btn-g:hover { border-color: var(--accent-light); color: var(--ink); background: var(--surface-header); }

    .bubble-u {
      background: linear-gradient(135deg, var(--accent), var(--accent-deep));
      color: #fff; border-radius: 18px 18px 4px 18px;
      box-shadow: 0 4px 16px rgba(201,117,96,.28);
    }
    .bubble-a {
      background: var(--surface-header); color: var(--ink);
      border-radius: 18px 18px 18px 4px;
      border: 1px solid var(--surface-border);
      backdrop-filter: blur(20px);
    }

    .dots span {
      display: inline-block; width: 5px; height: 5px; border-radius: 50%;
      background: var(--ink-soft); margin: 0 2px;
      animation: bounce 1.2s ease-in-out infinite;
    }
    .dots span:nth-child(2) { animation-delay: .2s; }
    .dots span:nth-child(3) { animation-delay: .4s; }
    @keyframes bounce {
      0%,60%,100% { transform: translateY(0); opacity: .3; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    .sos-ring { animation: sosR 2.5s ease-in-out infinite; }
    @keyframes sosR {
      0%,100% { box-shadow: 0 0 0 0 rgba(201,117,96,.35); }
      50% { box-shadow: 0 0 0 12px rgba(201,117,96,0); }
    }
    @keyframes sweepGlow {
      0%   { transform: translateX(-160%); }
      100% { transform: translateX(320%); }
    }
    .sweep-glow { animation: sweepGlow 4.8s linear infinite; }

    @keyframes wispDrift {
      0%   { transform: rotate(var(--r)) translateX(0px); }
      50%  { transform: rotate(var(--r)) translateX(18px); }
      100% { transform: rotate(var(--r)) translateX(0px); }
    }
    @keyframes orbPulse {
      0%,100% { box-shadow: 0 0 60px 20px rgba(201,117,96,0.45), 0 0 120px 50px rgba(180,90,60,0.22), 0 0 200px 90px rgba(130,55,40,0.12); }
      50%      { box-shadow: 0 0 80px 30px rgba(220,130,100,0.55), 0 0 160px 70px rgba(190,100,65,0.28), 0 0 260px 110px rgba(140,60,45,0.16); }
    }
    @keyframes ringPulse {
      0%,100% { opacity: 0.18; transform: scale(1); }
      50%      { opacity: 0.36; transform: scale(1.06); }
    }
    @keyframes particle1 {
      0%   { transform: rotate(0deg)   translateX(90px) rotate(0deg);   opacity: 0.7; }
      100% { transform: rotate(360deg) translateX(90px) rotate(-360deg); opacity: 0.7; }
    }
    @keyframes particle2 {
      0%   { transform: rotate(120deg)  translateX(75px) rotate(-120deg);  opacity: 0.4; }
      100% { transform: rotate(480deg)  translateX(75px) rotate(-480deg);  opacity: 0.4; }
    }
    @keyframes particle3 {
      0%   { transform: rotate(240deg)  translateX(110px) rotate(-240deg);  opacity: 0.25; }
      100% { transform: rotate(600deg)  translateX(110px) rotate(-600deg);  opacity: 0.25; }
    }
    .orb-particle { position: absolute; top: 50%; left: 50%; width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%; background: #FFE8D8; box-shadow: 0 0 8px 3px rgba(255,220,190,0.80); }
    .orb-p1 { animation: particle1 8s linear infinite; }
    .orb-p2 { animation: particle2 12s linear infinite; }
    .orb-p3 { animation: particle3 18s linear infinite; }

    .step-bar { display: flex; gap: 4px; justify-content: center; margin-bottom: 36px; }
    .step-bar span { height: 2px; border-radius: 2px; background: var(--surface-border-s); }
    .step-bar span.on { background: var(--accent); }

    .av {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent-deep));
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond',serif; font-size: 15px; color: #fff;
      flex-shrink: 0;
      box-shadow: 0 2px 10px rgba(201,117,96,.35);
    }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.65);
      backdrop-filter: blur(14px); z-index: 1000;
      display: flex; align-items: center; justify-content: center; padding: 24px;
    }
    .modal-box {
      background: var(--surface-modal); border-radius: 24px; padding: 36px 32px;
      max-width: 400px; width: 100%; box-shadow: var(--shadow-l);
      border: 1px solid var(--surface-border-s);
      backdrop-filter: blur(28px);
      position: relative;
    }

    .btn-sos {
      height: 52px; width: 100%; border-radius: 10px;
      background: rgba(201,117,96,0.18); border: 1.5px solid rgba(201,117,96,0.55);
      color: var(--ink); font-family: 'Jost', system-ui, sans-serif;
      font-size: 14px; font-weight: 500; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
    }
    .btn-sos:hover { background: rgba(201,117,96,0.28); border-color: rgba(201,117,96,0.75); }

    /* ── DESKTOP : orbe réduite ── */
    @media (min-width: 800px) {
      .orb-zone { width: 200px !important; height: 200px !important; }
    }
  `}</style>
);

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Leaf = ({ s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);
const Send = ({ s = 17 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const Back = ({ s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);
const Plus = ({ s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const Xmark = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const Star = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);
const Check = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const HomeIcon = ({ s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const ChatIcon = ({ s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const UserIcon = ({ s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const Sparkles = ({ s = 15, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M12 2L10.2 9.2 3 11l7.2 1.8L12 20l1.8-7.2L21 11l-7.2-1.8Z" opacity="0.9"/>
    <path d="M5 3.5L4 7l-3.5 1L4 9.5 5 13l1-3.5 3.5-1L6 7Z" opacity="0.65"/>
    <path d="M19 12.5l-.8 3-3 .8 3 .8.8 3 .8-3 3-.8-3-.8Z" opacity="0.65"/>
  </svg>
);
const AlertCircle = ({ s = 15, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ─── DAILY LIMIT ─────────────────────────────────────────────────────────────
const FREE_DAILY_LIMIT = 10;
const SOS_DAILY_LIMIT  = 10;

async function getDailyUsage() {
  const today = new Date().toISOString().slice(0, 10);
  const data = await S.get("elia_daily") || { date: "", count: 0 };
  return data.date === today ? data.count : 0;
}

async function incrementDailyUsage() {
  const today = new Date().toISOString().slice(0, 10);
  const data = await S.get("elia_daily") || { date: "", count: 0 };
  const count = data.date === today ? data.count + 1 : 1;
  await S.set("elia_daily", { date: today, count });
  return count;
}

async function getSosUsage() {
  const data = await S.get("elia_sos_usage") || { timestamps: [] };
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return data.timestamps.filter(ts => ts > cutoff).length;
}

async function incrementSosUsage() {
  const data = await S.get("elia_sos_usage") || { timestamps: [] };
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const timestamps = [...data.timestamps.filter(ts => ts > cutoff), Date.now()];
  await S.set("elia_sos_usage", { timestamps });
  return timestamps.length;
}

// ─── STORAGE (Supabase + localStorage fallback) ───────────────────────────────
const LS_KEYS = ["elia_profile","elia_legal","elia_memory","elia_sessions",
                 "elia_tracking","elia_last_sos","elia_chat_history","elia_daily","elia_sos_usage","elia_premium_token"];

async function migrateLocalStorageToSupabase(userId) {
  if (localStorage.getItem("elia_sb_migrated")) return;
  const rows = LS_KEYS
    .map(key => { try { const v = localStorage.getItem(key); return v ? { user_id: userId, key, value: JSON.parse(v) } : null; } catch { return null; } })
    .filter(Boolean);
  if (rows.length) await supabase.from("user_data").upsert(rows, { onConflict: "user_id,key", ignoreDuplicates: true });
  localStorage.setItem("elia_sb_migrated", "1");
}

const S = {
  async get(k) {
    try {
      const session = await getOrCreateSession();
      if (!session) throw new Error("no session");
      const { data, error } = await supabase
        .from("user_data")
        .select("value")
        .eq("user_id", session.user.id)
        .eq("key", k)
        .maybeSingle();
      if (error) throw error;
      return data?.value ?? null;
    } catch {
      try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; }
    }
  },
  async set(k, v) {
    try {
      const session = await getOrCreateSession();
      if (!session) throw new Error("no session");
      if (v === null || v === undefined) {
        await supabase.from("user_data").delete().eq("user_id", session.user.id).eq("key", k);
      } else {
        const { error } = await supabase.from("user_data").upsert(
          { user_id: session.user.id, key: k, value: v, updated_at: new Date().toISOString() },
          { onConflict: "user_id,key" }
        );
        if (error) throw error;
      }
    } catch {
      try {
        if (v === null || v === undefined) localStorage.removeItem(k);
        else localStorage.setItem(k, JSON.stringify(v));
      } catch {}
    }
  }
};

// ─── LEGAL CONSENT ────────────────────────────────────────────────────────────
function LegalConsent({ onAccept }) {
  const [age,        setAge]        = useState(false);
  const [disclaimer, setDisclaimer] = useState(false);
  const [cgu,        setCgu]        = useState(false);
  const [rgpd,       setRgpd]       = useState(false);
  const [overlay,    setOverlay]    = useState(null); // null | 'disclaimer' | 'cgu' | 'rgpd'
  const canContinue = age && disclaimer && cgu && rgpd;

  const checkboxStyle = (val) => ({
    width: 20, height: 20, borderRadius: 6,
    border: `2px solid ${val ? "var(--accent)" : "var(--surface-border-s)"}`,
    background: val ? "var(--accent)" : "var(--surface-border-s)",
    flexShrink: 0, display: "flex", alignItems: "center",
    justifyContent: "center", transition: "all .15s", marginTop: 1,
  });

  const linkBtn = (key, label) => (
    <button onClick={e => { e.preventDefault(); setOverlay(key); }} style={{
      background: "none", border: "none", color: "var(--accent)",
      cursor: "pointer", fontSize: 13, textDecoration: "underline", padding: 0,
    }}>{label}</button>
  );

  // Overlay plein écran — utilise les écrans légaux existants
  if (overlay === 'cgu') return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto", background: "var(--bg-base-1)" }}>
      <CguScreen onBack={() => setOverlay(null)} />
    </div>
  );
  if (overlay === 'rgpd') return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto", background: "var(--bg-base-1)" }}>
      <ConfidentialiteScreen onBack={() => setOverlay(null)} />
    </div>
  );
  if (overlay === 'disclaimer') return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto", background: "var(--bg-base-1)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px 48px" }}>
        <div style={{ position: "sticky", top: 0, background: "rgba(8,6,8,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(245,237,230,0.07)", padding: "16px 0", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setOverlay(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,237,230,0.5)", display: "flex", padding: 4 }}><Back s={20} /></button>
          <span className="serif" style={{ fontSize: 17, fontWeight: 400, color: "rgba(245,237,230,0.85)" }}>Déclaration médicale</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.85, fontWeight: 300 }}>
          <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--ink)" }}>Ce que NERA est</strong><br />
          Application de soutien émotionnel pour parents de jumeaux et multiples. Accompagnement émotionnel, informations générales, gestion de la charge mentale.</p>

          <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--ink)" }}>Ce que NERA n'est pas</strong><br />
          Ni service médical, ni psychothérapie, ni substitut à un suivi médical ou psychiatrique, ni dispositif médical au sens européen, ni service d'urgence.</p>

          <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--ink)" }}>Elïa ne peut pas</strong><br />
          Poser un diagnostic · prescrire un traitement · remplacer un professionnel de santé · fournir une assistance d'urgence.</p>

          <div style={{ background: "rgba(201,117,96,0.08)", border: "1px solid rgba(201,117,96,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
            <strong style={{ color: "var(--accent)", display: "block", marginBottom: 8 }}>En cas d'urgence</strong>
            <strong>15</strong> — SAMU · <strong>17</strong> — Police · <strong>18</strong> — Pompiers · <strong>112</strong> — Européen<br />
            <strong>3114</strong> — Prévention suicide · <strong>119</strong> — Enfance en danger · <strong>3919</strong> — Violences femmes
          </div>

          <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--ink)" }}>En cochant cette case, tu reconnais</strong><br />
          Avoir lu ce document · comprendre qu'Elïa est une IA, non un professionnel de santé · t'engager à consulter un professionnel pour toute question médicale · avoir 16 ans ou plus.</p>

          <p style={{ fontSize: 11, color: "var(--ink-faint)", fontStyle: "italic" }}>Document soumis au droit français — NERA · Mai 2026</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflowY: "auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "var(--surface-modal)", borderRadius: 28, padding: "36px 32px", maxWidth: 440, width: "100%", boxShadow: "var(--shadow-l)", border: "1px solid var(--surface-border-s)", backdropFilter: "blur(24px)" }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <span className="serif" style={{ fontStyle: "italic", fontSize: 18, fontWeight: 400, color: "var(--brand)", letterSpacing: ".04em" }}>NERA</span>
          </div>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Avant de commencer</h2>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 300, lineHeight: 1.6 }}>
            Elïa est une présence bienveillante, <strong>pas un professionnel de santé</strong>.
            En cas d'urgence, contacte le <strong>15</strong> (SAMU) ou le <strong>3114</strong> (prévention du suicide).
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>

          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
            <div onClick={() => setAge(!age)} style={checkboxStyle(age)}>
              {age && <Check s={12} />}
            </div>
            <span style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5, fontWeight: 300 }}>
              J'ai <strong>16 ans</strong> ou plus
            </span>
          </label>

          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
            <div onClick={() => setDisclaimer(!disclaimer)} style={checkboxStyle(disclaimer)}>
              {disclaimer && <Check s={12} />}
            </div>
            <span style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5, fontWeight: 300 }}>
              J'ai lu et j'accepte la{" "}
              {linkBtn("disclaimer", "Déclaration de non-substitution médicale")}
            </span>
          </label>

          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
            <div onClick={() => setCgu(!cgu)} style={checkboxStyle(cgu)}>
              {cgu && <Check s={12} />}
            </div>
            <span style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5, fontWeight: 300 }}>
              J'accepte les{" "}
              {linkBtn("cgu", "Conditions Générales d'Utilisation")}
            </span>
          </label>

          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
            <div onClick={() => setRgpd(!rgpd)} style={checkboxStyle(rgpd)}>
              {rgpd && <Check s={12} />}
            </div>
            <span style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5, fontWeight: 300 }}>
              J'ai lu la{" "}
              {linkBtn("rgpd", "Politique de confidentialité")}{" "}(RGPD)
            </span>
          </label>

        </div>

        <button className="btn btn-t" onClick={onAccept} disabled={!canContinue}
          style={{ opacity: canContinue ? 1 : .45 }}>
          Continuer →
        </button>
      </motion.div>
    </div>
  );
}

// ─── NUMÉROS D'URGENCE ────────────────────────────────────────────────────────
const EMERGENCY_NUMBERS = [
  { num: "15", label: "SAMU", desc: "Urgence médicale" },
  { num: "3114", label: "Prévention suicide", desc: "24h/24, gratuit" },
  { num: "119", label: "Enfance en danger", desc: "Signalement" },
  { num: "3919", label: "Violences conjugales", desc: "Écoute et orientation" },
];

const CRISIS_KEYWORDS = ["me faire du mal", "me tuer", "suicide", "mourir", "en finir", "plus envie de vivre", "je veux mourir", "tuer mon enfant", "secouer", "frapper mon enfant"];

function CrisisModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <motion.div className="modal-box" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .95 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 className="serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Je suis là avec toi</h2>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 300, lineHeight: 1.6 }}>
            Ce que tu traverses est très difficile. Tu n'es pas seul(e). Des professionnels formés sont disponibles maintenant, gratuitement.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {EMERGENCY_NUMBERS.map(e => (
            <a key={e.num} href={`tel:${e.num}`}
              style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", borderRadius: 14, padding: "12px 16px", textDecoration: "none", border: "1px solid var(--surface-border-s)" }}>
              <div style={{ background: "var(--accent)", color: "#fff", borderRadius: 10, padding: "6px 12px", fontSize: 15, fontWeight: 600, flexShrink: 0 }}>{e.num}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{e.label}</p>
                <p style={{ fontSize: 11, color: "var(--ink-faint)", fontWeight: 300 }}>{e.desc}</p>
              </div>
            </a>
          ))}
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: 13, width: "100%", textAlign: "center", fontStyle: "italic" }}>
          Continuer à parler avec Elia
        </button>
      </motion.div>
    </div>
  );
}

// ─── STRIPE MODAL ─────────────────────────────────────────────────────────────

function StripeModal({ profile, onClose }) {
  const [selected, setSelected] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [retractWaiver, setRetractWaiver] = useState(false);

  const handleCheckout = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Merci d'entrer une adresse email valide.");
      return;
    }
    if (!retractWaiver) {
      setError("Merci d'accepter les conditions de démarrage immédiat du service.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let userId = null;
      try { const s = await getOrCreateSession(); userId = s?.user?.id; } catch {}
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selected,
          email,
          parentName: profile.parentName,
          userId,
        }),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setError("Impossible de démarrer le paiement. Vérifie ta connexion.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal-box" initial={{ opacity: 0, scale: .95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95 }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)" }}><Xmark s={18} /></button>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", borderRadius: 50, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 500, marginBottom: 16 }}>
            <Star s={12} /> NERA Premium
          </div>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Accompagnement complet</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 14, fontWeight: 300, lineHeight: 1.5 }}>
            Mémoire longue, analyses hebdomadaires, accès illimité à Elïa.
          </p>
        </div>

        {/* Features */}
        <div style={{ background: "var(--surface-tint)", borderRadius: 16, padding: "16px 18px", marginBottom: 24 }}>
          {["Conversations illimitées avec Elïa", "Mémoire longue & suivi personnalisé", "Analyses et tendances hebdomadaires", "Accès prioritaire aux nouvelles fonctions"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ color: "var(--sage)", flexShrink: 0 }}><Check s={14} /></div>
              <span style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 300 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Plan selector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { key: "monthly", label: "Mensuel", price: "12,99€ TTC/mois", sub: "" },
            { key: "annual",  label: "Annuel",  price: "99€ TTC/an",  sub: "~5€/mois offerts" },
          ].map(p => (
            <button key={p.key} onClick={() => setSelected(p.key)}
              style={{
                padding: "14px 12px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                border: selected === p.key ? "2px solid var(--accent)" : "1.5px solid var(--surface-border-s)",
                background: selected === p.key ? "rgba(201,117,96,.14)" : "var(--surface-tint)",
                transition: "all .18s", position: "relative",
              }}>
              {p.sub && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "var(--sage)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 50, whiteSpace: "nowrap", fontWeight: 500 }}>{p.sub}</div>}
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 2 }}>{p.label}</div>
              <div className="serif" style={{ fontSize: 17, fontWeight: 600, color: "var(--accent)" }}>{p.price}</div>
            </button>
          ))}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <input className="field" type="email" placeholder="Ton adresse email" value={email} onChange={e => setEmail(e.target.value)} style={{ fontSize: 14 }} />
        </div>

        {/* Waiver rétractation — obligatoire légalement (art. L221-28 C. conso.) */}
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16, cursor: "pointer" }}>
          <div onClick={() => setRetractWaiver(v => !v)}
            style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
              border: `2px solid ${retractWaiver ? "var(--accent)" : "var(--surface-border-s)"}`,
              background: retractWaiver ? "var(--accent)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
            {retractWaiver && <Check s={11} />}
          </div>
          <span style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.55, fontWeight: 300 }}>
            Je demande le démarrage immédiat du service et je reconnais expressément renoncer à mon droit de rétractation de 14 jours dès le début de l'exécution (art. L221-28 du Code de la consommation).
          </span>
        </label>

        {error && <p style={{ color: "var(--accent-deep)", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{error}</p>}

        <button className="btn btn-t" onClick={handleCheckout} disabled={loading || !retractWaiver}>
          {loading ? "Chargement…" : "Commencer · Paiement sécurisé"}
        </button>
        <p style={{ fontSize: 11, color: "var(--ink-faint)", textAlign: "center", marginTop: 10, fontStyle: "italic" }}>
          Résiliable à tout moment · Paiement via Stripe
        </p>
      </motion.div>
    </div>
  );
}

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function askElia({ profile, messages, isSos, memory, premiumToken }) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 35000);
  try {
    const resp = await fetch("/api/chat", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ profile, messages, isSos, memory, premiumToken }),
      signal:  controller.signal,
    });
    clearTimeout(timeoutId);
    if (resp.status === 429 || resp.status === 503) {
      const data = await resp.json();
      if (data.sosLimit)   throw Object.assign(new Error("Limite SOS"),         { sosLimit: true });
      if (data.dailyLimit) throw Object.assign(new Error("Limite journalière"), { dailyLimit: true });
      throw new Error("Trop de requêtes. Réessaie dans un instant.");
    }
    if (!resp.ok) throw new Error("API " + resp.status);
    const data = await resp.json();
    return data.content.map(b => b.text || "").join("");
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
let _childId = 0;
const newChild = () => ({ id: `c-${Date.now()}-${++_childId}`, firstName: "", birthDate: "", temperament: "", notes: "" });

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const ROLES = ["Maman", "Papa", "Co-parent", "Grand-parent", "Beau-parent", "Autre"];
const TEMPS = ["Calme & facile", "Actif & énergique", "Sensible & émotif", "Curieux & éveillé", "Timide & réservé"];
const CHALS = [
  "Fatigue & épuisement",
  "Sommeil difficile",
  "Pleurs simultanés",
  "Alimentation",
  "Allaitement multiple",
  "Prématurité / NICU",
  "Gestion des émotions",
  "Anxiété parentale",
  "Solitude & isolement",
  "Dynamique fraternelle",
  "Identité individuelle",
  "Culpabilité d'inégalité",
  "Développement",
];
const BIRTH_TYPES = ["Voie basse", "Césarienne", "Déclenchement", "Naissance prématurée", "Forceps / ventouse", "Grossesse à risque"];

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const STEPS = 4;
  const [d, setD] = useState({
    parentName: "", parentRole: "Maman",
    children: [newChild(), newChild()],
    birthTypes: [],
    challenges: [], freeText: "", isPremium: false
  });

  const upd = patch => setD(p => ({ ...p, ...patch }));
  const updChild = (i, field, val) => {
    const c = [...d.children];
    c[i] = { ...c[i], [field]: val };
    upd({ children: c });
  };

  const finish = () => {
    const enriched = {
      ...d,
      children: d.children.map(c => ({ ...c, age: calcAge(c.birthDate) }))
    };
    onDone(enriched);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "0 32px 48px", background: "linear-gradient(180deg, #0D090D 0%, #080608 100%)", position: "relative", overflow: "hidden" }}>
      {/* Halo atmosphérique onboarding */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(80,35,22,0.22) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Progress bar – full width, top, segments */}
        <div style={{ display: "flex", gap: 6, paddingTop: 52, marginBottom: 40 }}>
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i <= step ? "var(--accent)" : "var(--surface-border-s)", transition: "background .4s" }} />
          ))}
        </div>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span className="serif" style={{ fontStyle: "normal", fontSize: 22, fontWeight: 400, color: "rgba(245,237,230,0.60)", letterSpacing: ".32em" }}>NERA</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .2 }}>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: .38 }}>
                <h2 className="serif" style={{ fontSize: 34, fontWeight: 400, marginBottom: 8, color: "rgba(245,237,230,0.90)" }}>Bienvenue</h2>
                <p style={{ color: "rgba(245,237,230,0.48)", fontSize: 14, fontWeight: 300, lineHeight: 1.65 }}>Je suis Elïa. Dis-moi comment t'appeler.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .06, duration: .38 }}
                style={{ marginTop: 48 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 12 }}>Ton prénom</label>
                <input className="field" placeholder="ex. Sophie…" value={d.parentName} onChange={e => upd({ parentName: e.target.value })} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .38 }}
                style={{ marginTop: 40 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 12 }}>Tu es…</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {ROLES.map(r => (
                    <button key={r} className={`chip ${d.parentRole === r ? "on" : ""}`}
                      style={{ borderRadius: 999, padding: "11px 22px" }}
                      onClick={() => upd({ parentRole: r })}>{r}</button>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .38 }}
                style={{ marginTop: 56 }}>
                <button className="btn btn-t" onClick={() => setStep(1)} disabled={!d.parentName.trim()}
                  style={{ fontWeight: 500 }}>
                  Continuer →
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
              <h2 className="serif" style={{ fontSize: 34, fontWeight: 400, marginBottom: 8, color: "rgba(245,237,230,0.90)" }}>Tes enfants</h2>
              <p style={{ color: "rgba(245,237,230,0.48)", fontSize: 14, marginBottom: 24, fontWeight: 300 }}>Pour t'accompagner au mieux, parle-moi d'eux.</p>
              {detectMultiple(d.children) && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", borderRadius: 50, padding: "5px 14px", color: "#fff", fontSize: 12, fontWeight: 500, marginBottom: 12 }}>
                  {detectMultiple(d.children)} détectés
                </div>
              )}
              <div>
                {d.children.map((c, i) => (
                  <div key={c.id} style={{ background: "var(--surface-tint)", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid var(--surface-border-s)", position: "relative", overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 10, gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".08em", flex: 1 }}>
                        Enfant {i + 1}
                      </span>
                      {d.children.length > 2 && (
                        <button onClick={() => upd({ children: d.children.filter((_, idx) => idx !== i) })}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", padding: 4 }}>
                          <Xmark />
                        </button>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <input className="field" placeholder="Prénom" value={c.firstName} onChange={e => updChild(i, "firstName", e.target.value)} style={{ fontSize: 14 }} />
                      <input className="field" type="date" value={c.birthDate} onChange={e => updChild(i, "birthDate", e.target.value)} style={{ fontSize: 13, minWidth: 0 }} />
                    </div>
                    {c.birthDate && calcAge(c.birthDate) && (
                      <p style={{ fontSize: 12, color: "var(--accent)", marginBottom: 8, fontStyle: "italic" }}>{calcAge(c.birthDate)}</p>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {TEMPS.map(t => (
                        <button key={t} className={`chip ${c.temperament === t ? "on" : ""}`} style={{ fontSize: 11, padding: "5px 11px" }} onClick={() => updChild(i, "temperament", c.temperament === t ? "" : t)}>{t}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 8 }}>Type de naissance</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {BIRTH_TYPES.map(t => (
                    <button key={t} className={`chip ${d.birthTypes.includes(t) ? "on" : ""}`} style={{ fontSize: 11, padding: "5px 11px" }}
                      onClick={() => upd({ birthTypes: d.birthTypes.includes(t) ? d.birthTypes.filter(x => x !== t) : [...d.birthTypes, t] })}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => upd({ children: [...d.children, newChild()] })}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px dashed var(--surface-border-s)", borderRadius: 12, padding: "9px 16px", color: "var(--ink-soft)", cursor: "pointer", fontSize: 13, marginBottom: 22, marginTop: 8, width: "100%", justifyContent: "center" }}>
                <Plus /> Ajouter un enfant
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-g" onClick={() => setStep(0)} style={{ width: "auto", padding: "14px 18px" }}><Back /></button>
                <button className="btn btn-t" onClick={() => setStep(2)} style={{ fontWeight: 500 }}>Continuer →</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
              <h2 className="serif" style={{ fontSize: 34, fontWeight: 400, marginBottom: 8, color: "rgba(245,237,230,0.90)" }}>Ce qui t'importe</h2>
              <p style={{ color: "rgba(245,237,230,0.48)", fontSize: 14, marginBottom: 24, fontWeight: 300 }}>Qu'est-ce qui compte le plus pour toi en ce moment ?</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
                {CHALS.map(c => (
                  <button key={c} className={`chip ${d.challenges.includes(c) ? "on" : ""}`}
                    onClick={() => upd({ challenges: d.challenges.includes(c) ? d.challenges.filter(x => x !== c) : [...d.challenges, c] })}>
                    {c}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-g" onClick={() => setStep(1)} style={{ width: "auto", padding: "14px 18px" }}><Back /></button>
                <button className="btn btn-t" onClick={() => setStep(3)} style={{ fontWeight: 500 }}>Continuer →</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
              <h2 className="serif" style={{ fontSize: 34, fontWeight: 400, marginBottom: 8, color: "rgba(245,237,230,0.90)" }}>En quelques mots</h2>
              <p style={{ color: "rgba(245,237,230,0.48)", fontSize: 14, marginBottom: 24, fontWeight: 300 }}>Y a-t-il quelque chose d'important à savoir ? Facultatif.</p>
              <textarea className="field"
                placeholder="ex. Je suis séparée, je gère tout seul, ma fille a été hospitalisée récemment…"
                value={d.freeText} onChange={e => upd({ freeText: e.target.value })}
                maxLength={400}
                rows={5} style={{ resize: "none", lineHeight: 1.6 }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button className="btn btn-g" onClick={() => setStep(2)} style={{ width: "auto", padding: "14px 18px" }}><Back /></button>
                <button className="btn btn-t" onClick={finish} style={{ fontWeight: 500 }}>Commencer avec Elïa</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
const TIPS = [
  "Tu es exactement le parent dont ils ont besoin. Pas parfait — présent.",
  "Élever des multiples demande une force rare. Tu l'as déjà en toi.",
  "Prendre soin de toi, c'est le plus beau cadeau que tu leur fais.",
  "Chaque moment partagé avec eux compte, même les plus ordinaires.",
  "Tu construis quelque chose d'unique et d'extraordinaire, jour après jour.",
  "Ils grandissent parce que tu es là. C'est déjà tout.",
  "La famille que tu bâtis — elle est belle, elle est à toi.",
];
const SIGNATURES = [
  "pour les parents présents et imparfaits",
  "pour les créateurs de famille hors du commun",
  "pour toi, en premier",
  "pour les petites grandes victoires du quotidien",
  "pour les bâtisseurs de foyers uniques",
  "pour chaque instant qui compte",
  "pour les aventuriers du double",
];
const CHECKIN_MOODS = ["Épuisée", "Débordée", "Douce", "Lumineuse"];

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function Home({ profile, onStart, onPremium }) {
  const TODAY   = new Date().toISOString().slice(0, 10);
  const tipIdx  = new Date().getDate() % TIPS.length;
  const tip     = TIPS[tipIdx];
  const sig     = SIGNATURES[tipIdx];

  const namedChildren = profile.children.filter(c => c.firstName);
  const firstChild    = namedChildren[0];
  const childAge      = firstChild ? (calcAge(firstChild.birthDate) || firstChild.age) : null;
  const dayNum        = firstChild?.birthDate
    ? Math.max(1, Math.floor((new Date() - new Date(firstChild.birthDate)) / 86400000) + 1)
    : null;

  const [tracking,  setTracking]  = useState(null);
  const [sosBanner, setSosBanner] = useState(false);
  const [mouse, setMouse]         = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered]     = useState(false);
  const orbRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    S.get("elia_tracking").then(t => setTracking(t?.find(d => d.date === TODAY) || null));
    if (profile.isPremium) {
      S.get("elia_last_sos").then(ts => {
        if (!ts) return;
        const h = (Date.now() - ts) / 3600000;
        if (h >= 4 && h <= 36) setSosBanner(true);
      });
    }
  }, []);

  // Smooth mouse tracking with lerp
  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.06);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.06);
      setMouse({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!orbRef.current) return;
    const rect = orbRef.current.getBoundingClientRect();
    targetRef.current = {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetRef.current = { x: 0.5, y: 0.5 };
    setHovered(false);
  }, []);

  const saveCheckin = async (mood) => {
    const t = await S.get("elia_tracking") || [];
    const existing = t.find(d => d.date === TODAY) || {};
    const checkin  = existing.checkin === mood ? null : mood;
    await S.set("elia_tracking", [...t.filter(d => d.date !== TODAY), { ...existing, date: TODAY, checkin }]);
    setTracking(prev => ({ ...prev, checkin }));
  };

  // Specular highlight position based on mouse
  const specX = 18 + mouse.x * 44;  // 18% → 62%
  const specY = 14 + mouse.y * 32;  // 14% → 46%
  const tiltX = (mouse.y - 0.5) * 12;
  const tiltY = (mouse.x - 0.5) * -12;

  return (
    <div style={{ position: "relative", overflow: "hidden", background: "#080608", minHeight: "calc(100vh - 68px)" }}>

      {/* ── FOND ATMOSPHÉRIQUE ─────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {/* Gradient de fond profond */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(90,42,32,0.55) 0%, transparent 65%), radial-gradient(ellipse 100% 50% at 50% 0%, rgba(60,28,48,0.45) 0%, transparent 55%), linear-gradient(180deg, #100A10 0%, #060406 100%)" }} />
        {/* Lueur centrale pulsante — grande, douce */}
        <motion.div
          animate={{ opacity: [0.28, 0.42, 0.28], scale: [1, 1.12, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", left: "50%", top: "34%", height: 600, width: 600, transform: "translate(-50%, -50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(185,90,55,0.22) 0%, rgba(140,55,35,0.12) 40%, transparent 70%)", filter: "blur(60px)" }} />
        {/* Lueur violette secondaire */}
        <motion.div
          animate={{ opacity: [0.10, 0.18, 0.10], x: [-15, 15, -15] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", right: -80, top: "20%", height: 350, width: 350, borderRadius: "50%", background: "rgba(100,45,80,0.25)", filter: "blur(100px)" }} />
        {/* Grain texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.038, mixBlendMode: "soft-light", backgroundImage: NOISE_SVG, backgroundSize: "220px 220px" }} />
      </div>

      {/* ── CONTENU ────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "calc(100vh - 68px)", padding: "0 24px 28px" }}>

        {/* HEADER */}
        <header style={{ paddingTop: 20, paddingBottom: 0 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="serif" style={{ fontSize: 48, letterSpacing: "0.36em", color: "rgba(245,237,230,0.92)", fontStyle: "normal", fontWeight: 400, lineHeight: 1, margin: 0 }}>
              NERA
            </h1>
            <p style={{ marginTop: 10, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.32em", color: "rgba(245,237,230,0.22)", fontWeight: 400 }}>
              présence émotionnelle
            </p>
          </div>
        </header>

        {/* SOS FOLLOW-UP BANNER */}
        <AnimatePresence>
          {sosBanner && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 18, background: "rgba(201,117,96,0.10)", border: "1px solid rgba(201,117,96,0.22)", borderRadius: 18, padding: "14px 16px", backdropFilter: "blur(20px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(245,237,230,0.90)", marginBottom: 3 }}>Comment ça va depuis hier ?</p>
                  <p style={{ fontSize: 12, color: "rgba(245,237,230,0.48)", fontWeight: 300, lineHeight: 1.5 }}>Tu avais besoin d'aide. Je voulais prendre de tes nouvelles.</p>
                </div>
                <button onClick={() => setSosBanner(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,237,230,0.35)", padding: "0 0 0 8px" }}><Xmark /></button>
              </div>
              <button onClick={() => { setSosBanner(false); onStart(false); }}
                style={{ marginTop: 10, background: "rgba(201,117,96,0.28)", color: "rgba(245,237,230,0.90)", border: "1px solid rgba(201,117,96,0.35)", borderRadius: 10, padding: "7px 14px", fontSize: 12, cursor: "pointer", fontWeight: 500, fontFamily: "'Jost', system-ui, sans-serif" }}>
                En parler avec Elïa →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── HÉRO ─────────────────────────────────────────── */}
        <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

          {/* ── ORB ZONE interactive ────────────────────────── */}
          <motion.div
            ref={orbRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={() => onStart(false)}
            animate={{ scale: hovered ? 1.04 : 1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="orb-zone"
            style={{ position: "relative", width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, flexShrink: 0, cursor: "pointer" }}
          >

            {/* ── WISPS DERRIÈRE L'ORBE ────────────────────── */}

            {/* Halo de fond très large — aurora */}
            <motion.div
              animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,80,45,0.30) 0%, rgba(150,60,35,0.15) 40%, transparent 70%)", filter: "blur(40px)", zIndex: 0 }}
            />

            {/* Wisp 1 — grand diagonal haut-gauche → bas-droite, diffus */}
            <motion.div
              animate={{ opacity: [0.5, 0.85, 0.5], scaleX: [1, 1.04, 1] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0 }}
              style={{ position: "absolute", width: 420, height: 55, top: "50%", left: "50%", marginTop: -120, marginLeft: -210, borderRadius: 999, background: "linear-gradient(90deg, transparent 0%, rgba(160,68,38,0.22) 18%, rgba(210,100,58,0.52) 38%, rgba(235,140,90,0.65) 50%, rgba(210,100,58,0.48) 62%, rgba(160,68,38,0.20) 82%, transparent 100%)", filter: "blur(18px)", transform: "rotate(-22deg)", transformOrigin: "center", zIndex: 1 }}
            />
            {/* Wisp 1 ligne lumineuse fine */}
            <motion.div
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              style={{ position: "absolute", width: 440, height: 2.5, top: "50%", left: "50%", marginTop: -107, marginLeft: -220, background: "linear-gradient(90deg, transparent 5%, rgba(195,105,65,0.6) 22%, rgba(248,175,130,1) 48%, rgba(195,105,65,0.6) 74%, transparent 95%)", filter: "blur(1px)", transform: "rotate(-22deg)", transformOrigin: "center", zIndex: 2 }}
            />
            {/* Wisp 1b — ligne lumineuse secondaire parallèle */}
            <motion.div
              animate={{ opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              style={{ position: "absolute", width: 300, height: 1.5, top: "50%", left: "50%", marginTop: -90, marginLeft: -80, background: "linear-gradient(90deg, transparent 0%, rgba(220,140,95,0.70) 30%, rgba(252,185,148,0.90) 55%, rgba(220,140,95,0.55) 80%, transparent 100%)", filter: "blur(0.5px)", transform: "rotate(-19deg)", transformOrigin: "center", zIndex: 2 }}
            />

            {/* ANNEAUX atmosphériques — concentriques */}
            <motion.div
              style={{ position: "absolute", width: 290, height: 290, borderRadius: "50%", border: "1px solid rgba(210,120,80,0.12)", zIndex: 3 }}
              animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.04, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              style={{ position: "absolute", width: 230, height: 230, borderRadius: "50%", border: "1px solid rgba(220,135,90,0.18)", background: "rgba(180,80,45,0.04)", backdropFilter: "blur(8px)", zIndex: 3 }}
              animate={{ opacity: [0.20, 0.38, 0.20], scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              style={{ position: "absolute", width: 185, height: 185, borderRadius: "50%", border: "1px solid rgba(240,160,115,0.22)", background: "rgba(200,100,60,0.05)", backdropFilter: "blur(16px)", zIndex: 3 }}
              animate={{ opacity: [0.28, 0.50, 0.28], scale: [1, 1.025, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />

            {/* ── NOYAU — SPHÈRE 3D INTERACTIVE ────────────── */}
            <motion.div
              style={{
                position: "relative", width: 148, height: 148, borderRadius: "50%",
                zIndex: 5, flexShrink: 0,
                transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                transition: "transform 0.05s linear",
                animation: "orbPulse 5s ease-in-out infinite",
              }}
            >
              {/* Lueur extérieure diffuse — réagit à la position souris */}
              <div style={{
                position: "absolute", inset: -28, borderRadius: "50%",
                background: `radial-gradient(circle at ${specX}% ${specY}%, rgba(240,160,110,0.55) 0%, rgba(200,105,60,0.35) 35%, rgba(140,58,30,0.20) 60%, transparent 80%)`,
                filter: "blur(22px)",
              }} />
              {/* Corps principal — gradient 3D multi-couches */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: `radial-gradient(circle at ${specX}% ${specY}%, #FFDCC8 0%, #F0A878 14%, #D47550 30%, #A8512E 52%, #6E2E1A 72%, #3A1510 88%, #1E0B09 100%)`,
                boxShadow: "inset 0 -18px 40px rgba(0,0,0,0.60), inset 0 8px 20px rgba(255,200,160,0.12)",
              }} />
              {/* Couche de subsurface scattering — chaleur interne */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: `radial-gradient(circle at ${60 - mouse.x * 20}% ${70 - mouse.y * 20}%, rgba(220,100,50,0.45) 0%, transparent 55%)`,
                mixBlendMode: "screen",
              }} />
              {/* Reflet spéculaire principal — se déplace avec la souris */}
              <div style={{
                position: "absolute",
                top: `${specY - 8}%`, left: `${specX - 8}%`,
                width: "36%", height: "22%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(255,245,235,0.55) 0%, rgba(255,230,210,0.25) 50%, transparent 100%)",
                filter: "blur(4px)",
                transform: "rotate(-18deg)",
                transition: "top 0.05s, left 0.05s",
              }} />
              {/* Reflet secondaire, plus petit */}
              <div style={{
                position: "absolute",
                top: `${specY + 14}%`, left: `${specX + 10}%`,
                width: "14%", height: "8%",
                borderRadius: "50%",
                background: "rgba(255,235,210,0.28)",
                filter: "blur(2px)",
                transition: "top 0.05s, left 0.05s",
              }} />
              {/* Bord lumineux — rim light chaud */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "radial-gradient(circle at 85% 80%, rgba(220,120,70,0.40) 0%, transparent 40%)",
                mixBlendMode: "screen",
              }} />
            </motion.div>

            {/* Particules orbitales */}
            <div className="orb-particle orb-p1" style={{ zIndex: 6 }} />
            <div className="orb-particle orb-p2" style={{ width: 3, height: 3, margin: "-1.5px 0 0 -1.5px", opacity: 0.5, zIndex: 6 }} />
            <div className="orb-particle orb-p3" style={{ width: 2.5, height: 2.5, margin: "-1.25px 0 0 -1.25px", opacity: 0.3, background: "#F0D0B8", zIndex: 6 }} />

            {/* ── WISPS DEVANT L'ORBE ──────────────────────── */}

            {/* Wisp 2 — diagonal bas, diffus */}
            <motion.div
              animate={{ opacity: [0.45, 0.75, 0.45], scaleX: [1, 1.05, 1] }}
              transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              style={{ position: "absolute", width: 380, height: 48, top: "50%", left: "50%", marginTop: 95, marginLeft: -190, borderRadius: 999, background: "linear-gradient(90deg, transparent 0%, rgba(145,58,30,0.22) 20%, rgba(195,92,50,0.48) 42%, rgba(218,125,78,0.58) 52%, rgba(195,92,50,0.42) 64%, rgba(145,58,30,0.18) 82%, transparent 100%)", filter: "blur(16px)", transform: "rotate(16deg)", transformOrigin: "center", zIndex: 7 }}
            />
            {/* Wisp 2 ligne lumineuse */}
            <motion.div
              animate={{ opacity: [0.50, 0.92, 0.50] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              style={{ position: "absolute", width: 360, height: 2, top: "50%", left: "50%", marginTop: 108, marginLeft: -180, background: "linear-gradient(90deg, transparent 8%, rgba(185,90,52,0.65) 28%, rgba(240,152,100,0.98) 50%, rgba(185,90,52,0.58) 72%, transparent 92%)", filter: "blur(0.8px)", transform: "rotate(16deg)", transformOrigin: "center", zIndex: 8 }}
            />
            {/* Wisp 2b — fragment flottant à gauche */}
            <motion.div
              animate={{ opacity: [0.18, 0.45, 0.18], x: [-6, 6, -6] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
              style={{ position: "absolute", width: 160, height: 1.5, top: "50%", left: "50%", marginTop: 78, marginLeft: -195, background: "linear-gradient(90deg, transparent 0%, rgba(200,105,65,0.55) 40%, rgba(228,148,100,0.72) 60%, transparent 100%)", filter: "blur(0.5px)", transform: "rotate(10deg)", transformOrigin: "center", zIndex: 8 }}
            />

          </motion.div>

          {/* TEXTE + SIGNATURE */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, ease: "easeOut" }}
            style={{ maxWidth: 320, textAlign: "center", marginBottom: 20 }}
          >
            <p className="serif" style={{ fontSize: 30, lineHeight: 1.22, letterSpacing: "-0.01em", color: "rgba(245,237,230,0.90)", fontStyle: "italic", fontWeight: 400 }}>
              {tip}
            </p>
            <p style={{ marginTop: 12, fontSize: 11.5, color: "rgba(245,237,230,0.32)", letterSpacing: "0.06em", fontStyle: "italic" }}>
              — {sig}
            </p>
            {namedChildren.length > 0 && (
              <p style={{ marginTop: 6, fontSize: 11, color: "rgba(245,237,230,0.18)", letterSpacing: "0.05em" }}>
                {namedChildren.map(c => c.firstName).join(" & ")}
                {childAge ? ` · ${childAge}` : ""}
                {dayNum ? ` · jour ${dayNum}` : ""}
              </p>
            )}
          </motion.div>

          {/* ── CTAs ─────────────────────────────────────────── */}
          <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Parler avec Elïa — glassmorphism pill avec sweep */}
            <motion.button
              whileTap={{ scale: 0.975 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onStart(false)}
              style={{ position: "relative", overflow: "hidden", borderRadius: 999, border: "1px solid rgba(242,175,148,0.22)", background: "rgba(255,255,255,0.045)", padding: "17px 28px", backdropFilter: "blur(32px)", cursor: "pointer", width: "100%" }}
            >
              <div className="sweep-glow" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "45%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)", filter: "blur(20px)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(201,117,96,0.32) 0%, rgba(160,80,55,0.08) 60%, rgba(255,255,255,0.02) 100%)" }} />
              <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <Sparkles s={14} style={{ color: "rgba(255,218,195,0.88)" }} />
                <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.02em", color: "#FFF0E8", fontFamily: "'Jost', system-ui, sans-serif" }}>Parler avec Elïa</span>
              </div>
            </motion.button>

            {/* Mode SOS */}
            <motion.button
              whileTap={{ scale: 0.975 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onStart(true)}
              className="sos-ring"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 999, border: "1px solid rgba(201,117,96,0.22)", background: "rgba(201,117,96,0.06)", padding: "13px", color: "rgba(245,237,230,0.55)", backdropFilter: "blur(20px)", cursor: "pointer", fontSize: 13.5, fontFamily: "'Jost', system-ui, sans-serif", letterSpacing: "0.02em", width: "100%" }}
            >
              <AlertCircle s={14} />
              Mode SOS
            </motion.button>

          </div>

          {/* ÉTAT DU SOIR */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(245,237,230,0.32)", marginBottom: 10 }}>État du moment</p>
            <div style={{ display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap" }}>
              {CHECKIN_MOODS.map(m => {
                const active = tracking?.checkin === m;
                return (
                  <motion.button
                    key={m}
                    onClick={() => saveCheckin(m)}
                    animate={{ scale: active ? 1.06 : 1 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.18 }}
                    style={{ padding: "6px 16px", borderRadius: 999, border: active ? "1px solid rgba(201,117,96,0.65)" : "1px solid rgba(245,237,230,0.09)", background: active ? "rgba(201,117,96,0.22)" : "rgba(255,255,255,0.02)", color: active ? "rgba(245,237,230,0.95)" : "rgba(245,237,230,0.32)", fontSize: 12, cursor: "pointer", fontFamily: "'Jost', system-ui, sans-serif", boxShadow: active ? "0 0 12px rgba(201,117,96,0.30)" : "none", transition: "background 0.2s, border 0.2s, color 0.2s, box-shadow 0.2s" }}
                  >{m}</motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 12 }}>
          <motion.div
            animate={{ opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ borderRadius: 999, border: "1px solid rgba(201,117,96,0.12)", background: "rgba(201,117,96,0.04)", padding: "5px 16px", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", gap: 6 }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(201,117,96,0.80)", boxShadow: "0 0 6px rgba(201,117,96,0.70)" }} />
            <p style={{ fontSize: 10, letterSpacing: "0.20em", color: "rgba(245,237,230,0.30)", textTransform: "uppercase", fontFamily: "'Jost', system-ui, sans-serif" }}>Elïa présente</p>
          </motion.div>
        </footer>

      </div>
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
const SOS_SHORTS = ["Je suis épuisée", "Mes enfants ne dorment pas", "Je me sens seul(e)", "J'ai besoin de souffler", "Je n'en peux plus", "Je culpabilise"];

function Chat({ profile, isSos, onBack, onPremium, premiumToken }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memory, setMemory] = useState([]);
  const [nudge, setNudge] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [sosCount, setSosCount] = useState(0);
  const bottomRef = useRef(null);
  const taRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const mem = await S.get("elia_memory") || [];
      const cnt = await S.get("elia_sessions") || 0;
      const [daily, sos] = await Promise.all([getDailyUsage(), getSosUsage()]);
      setMemory(mem);
      setDailyCount(daily);
      setSosCount(sos);
      await S.set("elia_sessions", cnt + 1);
      if (isSos) await S.set("elia_last_sos", Date.now());

      if (!isSos) {
        const saved = await S.get("elia_chat_history") || [];
        if (saved.length > 0) {
          setMsgs(saved);
          return;
        }
      }

      let welcome;
      if (isSos) {
        welcome = `Je suis là. Respire avec moi un instant… 🌿\n\nInspire lentement par le nez (4 secondes) — retiens (4 secondes) — expire par la bouche (6 secondes).\n\nQu'est-ce qui se passe en ce moment ?`;
      } else if (cnt > 0 && mem.length) {
        welcome = `Bonjour ${profile.parentName} 🌸 Je pensais à toi… comment ça va depuis notre dernier échange ?`;
      } else {
        welcome = `Bonjour ${profile.parentName} 🌸\n\nJe suis Elïa. Je suis là pour t'écouter, sans jugement, à ton rythme.\n\nDe quoi as-tu besoin aujourd'hui ?`;

      }
      setMsgs([{ role: "assistant", content: welcome, id: "welcome" }]);
    };
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = useCallback(async (text) => {
    const txt = (text || "").trim();
    if (!txt || loading) return;

    // Détection de crise
    const triggeredKeyword = CRISIS_KEYWORDS.find(k => txt.toLowerCase().includes(k));
    if (triggeredKeyword) {
      setCrisis(true);
      fetch("/api/crisis-alert", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ keyword: triggeredKeyword }),
      }).catch(() => {});
    }

    // Quotas gratuit
    if (!profile.isPremium) {
      if (isSos && sosCount >= SOS_DAILY_LIMIT) {
        if (!msgs.some(m => m.id === "limit-msg")) {
          setMsgs(prev => [...prev, {
            role: "assistant",
            content: `Tu as utilisé tes ${SOS_DAILY_LIMIT} messages SOS pour les dernières 24h 🌿\n\nReviens dans quelques heures, ou passe à Premium pour un accès illimité au Mode SOS.`,
            id: "limit-msg",
          }]);
        }
        return;
      }
      if (!isSos && dailyCount >= FREE_DAILY_LIMIT) {
        if (!msgs.some(m => m.id === "limit-msg")) {
          setMsgs(prev => [...prev, {
            role: "assistant",
            content: `Tu as atteint ta limite de ${FREE_DAILY_LIMIT} messages pour aujourd'hui 🌿\n\nPasse à Premium pour continuer sans limite, avec des analyses approfondies et ma mémoire longue. Ou reviens demain.`,
            id: "limit-msg",
          }]);
        }
        setNudge(true);
        return;
      }
    }

    const um = { role: "user", content: txt, id: "u" + Date.now() };
    setMsgs(prev => [...prev, um]);
    setInput("");
    if (taRef.current) {
      taRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const allMsgs = [...msgs, um];
      const reply = await askElia({
        profile,
        messages: allMsgs.map(m => ({ role: m.role, content: m.content })),
        isSos,
        memory,
        premiumToken,
      });
      const am = { role: "assistant", content: reply, id: "a" + Date.now() };
      setMsgs(prev => {
        const updated = [...prev, am];
        if (!isSos) S.set("elia_chat_history", updated);
        return updated;
      });

      const entry = `${new Date().toLocaleDateString("fr-FR")} : "${txt.slice(0, 80)}"`;
      setMemory(prev => {
        const nm = [...prev.slice(-9), entry];
        S.set("elia_memory", nm);
        return nm;
      });

      if (!profile.isPremium) {
        if (isSos) {
          const newSos = await incrementSosUsage();
          setSosCount(newSos);
        } else {
          const newCount = await incrementDailyUsage();
          setDailyCount(newCount);
          if (newCount >= FREE_DAILY_LIMIT - 1) {
            setTimeout(() => setNudge(true), 800);
          }
        }
      }
    } catch (err) {
      if (err.sosLimit) {
        setSosCount(SOS_DAILY_LIMIT);
        setMsgs(prev => {
          if (prev.some(m => m.id === "limit-msg")) return prev;
          return [...prev, {
            role: "assistant",
            content: `Tu as utilisé tes ${SOS_DAILY_LIMIT} messages SOS pour les dernières 24h 🌿\n\nReviens dans quelques heures, ou passe à Premium pour un accès illimité.`,
            id: "limit-msg",
          }];
        });
      } else if (err.dailyLimit) {
        setMsgs(prev => {
          if (prev.some(m => m.id === "limit-msg")) return prev;
          return [...prev, {
            role: "assistant",
            content: `Tu as atteint ta limite de ${FREE_DAILY_LIMIT} messages pour aujourd'hui 🌿\n\nPasse à Premium pour continuer sans limite, ou reviens demain.`,
            id: "limit-msg",
          }];
        });
        setNudge(true);
      } else {
        console.error(err);
        setMsgs(prev => [...prev, {
          role: "assistant",
          content: err.message?.includes("Délai")
            ? "Je mets un peu de temps à répondre… 🌿 Réessaie dans un instant."
            : "Je suis là, mais j'ai une petite difficulté technique. Respire un grand coup… 🌿 Réessaie dans un instant.",
          id: "err" + Date.now(),
        }]);
      }
    }
    setLoading(false);
  }, [msgs, loading, profile, isSos, memory, premiumToken, dailyCount, sosCount]);

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div style={{ height: "calc(100vh - 68px)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

      {/* Fond atmosphérique Chat */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(120,52,35,0.55) 0%, rgba(80,30,50,0.30) 40%, transparent 70%), linear-gradient(180deg, #1A0E14 0%, #120A10 50%, #0C070B 100%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 10, background: "rgba(22,12,18,0.85)", borderBottom: "1px solid rgba(245,237,230,0.09)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, backdropFilter: "blur(28px)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,237,230,0.45)", display: "flex", padding: 4 }}><Back s={19} /></button>
        {/* Avatar Elïa */}
        <motion.div
          animate={{ boxShadow: ["0 0 10px rgba(201,117,96,0.40)", "0 0 22px rgba(201,117,96,0.70)", "0 0 10px rgba(201,117,96,0.40)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FFDCC8 0%, #D47550 35%, #7E3020 75%)", flexShrink: 0 }}
        />
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.1, color: "rgba(245,237,230,0.92)", letterSpacing: "0.02em" }}>Elïa</div>
          <div style={{ fontSize: 11, fontStyle: "italic", marginTop: 1 }}>
            {isSos
              ? <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(201,117,96,0.90)" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(201,117,96,1)", display: "inline-block", boxShadow: "0 0 6px rgba(201,117,96,0.90)" }} />Mode SOS</span>
              : <span style={{ color: "rgba(245,237,230,0.38)" }}>Présence émotionnelle</span>}
          </div>
        </div>
        {!profile.isPremium && (
          <button onClick={onPremium} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg, rgba(201,117,96,0.85), rgba(168,85,63,0.90))", border: "none", borderRadius: 50, padding: "6px 14px", fontSize: 12, color: "#fff", cursor: "pointer", fontWeight: 500, boxShadow: "0 2px 10px rgba(201,117,96,0.35)" }}>
            <Star s={11} /> Premium
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ maxWidth: 640, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Nudge premium */}
          <AnimatePresence>
            {nudge && !profile.isPremium && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: "linear-gradient(135deg,rgba(201,117,96,.10),rgba(138,168,154,.08))", border: "1px solid rgba(201,117,96,.25)", borderRadius: 18, padding: 18, backdropFilter: "blur(16px)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Star s={15} />
                  <div>
                    <p className="serif" style={{ fontSize: 15, fontStyle: "italic", marginBottom: 6 }}>
                      {dailyCount >= FREE_DAILY_LIMIT ? "Tu as atteint ta limite de 10 messages aujourd'hui." : "Je commence à percevoir des tendances dans ce que tu vis…"}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 12, fontWeight: 300 }}>
                      {dailyCount >= FREE_DAILY_LIMIT
                        ? "Reviens demain ou passe à Premium pour un accès illimité avec Elia."
                        : "Mes analyses approfondies, ma mémoire longue et tes rapports personnalisés sont dans la version complète."}
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={onPremium}
                        style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                        Découvrir · 12,99€ TTC/mois
                      </button>
                      <button onClick={() => setNudge(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: 13 }}>Plus tard</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {msgs.map((m, i) => (
            <motion.div
              key={m.id || i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}
              style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 9, alignItems: "flex-end" }}>
              {m.role === "assistant" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FFDCC8 0%, #D47550 38%, #7E3020 78%)", boxShadow: "0 0 10px rgba(201,117,96,0.45)", flexShrink: 0 }} />
              )}
              <div style={{
                maxWidth: "78%", padding: "13px 17px", fontSize: 15, lineHeight: 1.75, fontWeight: 300, whiteSpace: "pre-wrap",
                ...(m.role === "user"
                  ? { background: "linear-gradient(135deg, rgba(201,117,96,0.90), rgba(168,85,63,0.95))", color: "#FFF0E8", borderRadius: "18px 18px 4px 18px", boxShadow: "0 4px 18px rgba(201,117,96,0.30)" }
                  : { background: "rgba(245,237,230,0.09)", color: "rgba(245,237,230,0.92)", borderRadius: "18px 18px 18px 4px", border: "1px solid rgba(245,237,230,0.13)", backdropFilter: "blur(20px)", boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }
                ),
              }}>
                {m.content}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "flex-end", gap: 9 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FFDCC8 0%, #D47550 38%, #7E3020 78%)", boxShadow: "0 0 10px rgba(201,117,96,0.45)", flexShrink: 0 }} />
              <div style={{ background: "rgba(245,237,230,0.09)", border: "1px solid rgba(245,237,230,0.13)", borderRadius: "18px 18px 18px 4px", padding: "13px 17px", backdropFilter: "blur(20px)", boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>
                <div className="dots"><span /><span /><span /></div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* SOS shortcuts */}
      {isSos && msgs.length <= 1 && (
        <div style={{ position: "relative", zIndex: 2, padding: "0 16px 10px", display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
          {SOS_SHORTS.map(s => (
            <button key={s} onClick={() => send(s)} style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid rgba(201,117,96,0.22)", background: "rgba(201,117,96,0.08)", color: "rgba(245,237,230,0.62)", fontSize: 12, cursor: "pointer", fontFamily: "'Jost', system-ui, sans-serif", backdropFilter: "blur(16px)" }}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ position: "relative", zIndex: 10, background: "rgba(20,12,18,0.90)", borderTop: "1px solid rgba(245,237,230,0.09)", padding: "14px 16px", flexShrink: 0, backdropFilter: "blur(32px)" }}>
        {!profile.isPremium && (isSos ? sosCount >= SOS_DAILY_LIMIT : dailyCount >= FREE_DAILY_LIMIT) ? (
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--accent-deep)", marginBottom: 12 }}>
              {isSos
                ? `Limite de ${SOS_DAILY_LIMIT} messages SOS atteinte (24h)`
                : `Limite de ${FREE_DAILY_LIMIT} messages atteinte pour aujourd'hui`}
            </p>
            <button className="btn btn-t" onClick={onPremium} style={{ marginBottom: 8 }}>
              Passer à Premium — illimité
            </button>
            <p style={{ fontSize: 11, color: "var(--ink-faint)", fontStyle: "italic" }}>
              {isSos ? "Ou reviens dans quelques heures" : "Ou reviens demain pour de nouveaux messages gratuits"}
            </p>
          </div>
        ) : (
          <>
            <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={taRef}
                className="field"
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKey}
                placeholder="Écris ici…"
                rows={1}
                style={{ resize: "none", lineHeight: 1.55, maxHeight: 120, overflow: "auto" }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: input.trim() && !loading ? "linear-gradient(135deg,var(--accent),var(--accent-deep))" : "var(--surface-border)",
                  border: "none",
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all .2s",
                  boxShadow: input.trim() && !loading ? "0 3px 12px rgba(185,106,75,.3)" : "none"
                }}>
                <Send s={17} />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "var(--ink-faint)", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
              Elia ne remplace pas un professionnel de santé · Urgences : <a href="tel:15" style={{ color: "var(--accent)", textDecoration: "none" }}>15</a> · <a href="tel:3114" style={{ color: "var(--accent)", textDecoration: "none" }}>3114</a>
            </p>
            {!profile.isPremium && (() => {
              const remaining = isSos ? SOS_DAILY_LIMIT - sosCount : FREE_DAILY_LIMIT - dailyCount;
              const total     = isSos ? SOS_DAILY_LIMIT : FREE_DAILY_LIMIT;
              const label     = isSos ? "SOS" : "aujourd'hui";
              if (remaining <= 0) return null;
              return (
                <p style={{ fontSize: 11, color: remaining <= Math.round(total * 0.3) ? "var(--accent)" : "var(--ink-faint)", textAlign: "center", marginTop: 2 }}>
                  {remaining} message{remaining > 1 ? "s" : ""} restant{remaining > 1 ? "s" : ""} {label}
                </p>
              );
            })()}
          </>
        )}
      </div>

      {/* Crisis modal */}
      <AnimatePresence>
        {crisis && <CrisisModal onClose={() => setCrisis(false)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ screen, onNavigate }) {
  const tabs = [
    { id: "home",    label: "Accueil", Icon: HomeIcon },
    { id: "chat",    label: "El\u00EFa",    Icon: ChatIcon },
    { id: "profile", label: "Profil",  Icon: UserIcon },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(8,6,8,0.88)",
      borderTop: "1px solid rgba(245,237,230,0.07)",
      display: "flex", zIndex: 100,
      backdropFilter: "blur(28px)",
      boxShadow: "0 -8px 32px rgba(0,0,0,0.60)",
    }}>
      {tabs.map(({ id, label, Icon }) => {
        const active = screen === id;
        return (
          <motion.button
            key={id}
            onClick={() => onNavigate(id)}
            whileTap={{ scale: 0.88 }}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 4, padding: "10px 0 12px",
              background: "none", border: "none", cursor: "pointer",
              color: active ? "rgba(201,117,96,0.95)" : "rgba(245,237,230,0.28)",
              transition: "color .2s ease", position: "relative",
            }}>
            <motion.div animate={{ scale: active ? 1.12 : 1, y: active ? -1 : 0 }} transition={{ duration: 0.2 }}>
              <Icon s={21} />
            </motion.div>
            <span style={{ fontSize: 10, fontWeight: active ? 500 : 400, letterSpacing: ".04em" }}>{label}</span>
            {active && (
              <motion.span
                layoutId="nav-indicator"
                style={{ position: "absolute", bottom: 0, width: 28, height: 2.5, background: "rgba(201,117,96,0.90)", borderRadius: 2, boxShadow: "0 0 10px rgba(201,117,96,0.70)" }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ profile, onSave, onPremium, onLegal, onConfidentialite, onCgu, onCgv, onCookies }) {
  const [d, setD] = useState({ ...profile, children: profile.children.map(c => ({ ...c })), birthTypes: profile.birthTypes || [] });
  const [saved, setSaved] = useState(false);

  const upd = patch => setD(p => ({ ...p, ...patch }));
  const updChild = (i, field, val) => {
    const c = [...d.children];
    c[i] = { ...c[i], [field]: val };
    upd({ children: c });
  };

  const save = async () => {
    const enriched = { ...d, children: d.children.map(c => ({ ...c, age: calcAge(c.birthDate) || c.age })) };
    await S.set("elia_profile", enriched);
    onSave(enriched);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80, background: "linear-gradient(180deg, #0D090D 0%, #080608 100%)", position: "relative", overflow: "hidden" }}>
      {/* Halo atmosphérique */}
      <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 400, height: 280, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(100,42,28,0.38) 0%, transparent 70%)", filter: "blur(45px)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, background: "rgba(18,10,16,0.80)", borderBottom: "1px solid rgba(245,237,230,0.09)", padding: "20px 24px", backdropFilter: "blur(28px)" }}>
        <div style={{ marginBottom: 4 }}>
          <span className="serif" style={{ fontStyle: "normal", fontSize: 16, fontWeight: 400, color: "rgba(245,237,230,0.35)", letterSpacing: ".28em" }}>NERA</span>
        </div>
        <h1 className="serif" style={{ fontSize: 26, fontWeight: 400, color: "rgba(245,237,230,0.90)" }}>Mon profil</h1>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Premium badge */}
        {profile.isPremium ? (
          <div style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            <Star s={16} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 500 }}>Abonnement Premium actif</p>
              <p style={{ fontSize: 12, opacity: .85, fontWeight: 300 }}>Mémoire longue · Analyses · Illimité</p>
            </div>
          </div>
        ) : (
          <div onClick={onPremium} style={{ background: "rgba(201,117,96,.10)", border: "1px solid rgba(201,117,96,.28)", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", backdropFilter: "blur(16px)" }}>
            <Star s={16} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--accent-deep)" }}>Passer à Premium</p>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 300 }}>12,99€ TTC/mois · Résiliable à tout moment</p>
            </div>
            <span style={{ fontSize: 13, color: "var(--accent)" }}>→</span>
          </div>
        )}

        {/* Identité */}
        <div style={{ background: "rgba(245,237,230,0.03)", borderRadius: 20, padding: "20px", border: "1px solid rgba(245,237,230,0.08)", backdropFilter: "blur(24px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Identité</p>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "var(--ink-faint)", display: "block", marginBottom: 6 }}>Prénom</label>
            <input className="field" value={d.parentName} onChange={e => upd({ parentName: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--ink-faint)", display: "block", marginBottom: 8 }}>Tu es…</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ROLES.map(r => (
                <button key={r} className={`chip ${d.parentRole === r ? "on" : ""}`} onClick={() => upd({ parentRole: r })}>{r}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Enfants */}
        <div style={{ background: "rgba(245,237,230,0.03)", borderRadius: 20, padding: "20px", border: "1px solid rgba(245,237,230,0.08)", backdropFilter: "blur(24px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Mes enfants</p>
          {d.children.map((c, i) => (
            <div key={c.id} style={{ background: "var(--surface-tint)", borderRadius: 14, padding: 14, marginBottom: 10, border: "1px solid var(--surface-border)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 10, gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".08em", flex: 1 }}>Enfant {i + 1}</span>
                {d.children.length > 2 && (
                  <button onClick={() => upd({ children: d.children.filter((_, idx) => idx !== i) })}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", padding: 4 }}>
                    <Xmark />
                  </button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <input className="field" placeholder="Prénom" value={c.firstName} onChange={e => updChild(i, "firstName", e.target.value)} style={{ fontSize: 14 }} />
                <input className="field" type="date" value={c.birthDate} onChange={e => updChild(i, "birthDate", e.target.value)} style={{ fontSize: 13, minWidth: 0 }} />
              </div>
              {c.birthDate && calcAge(c.birthDate) && (
                <p style={{ fontSize: 12, color: "var(--accent)", marginBottom: 8, fontStyle: "italic" }}>{calcAge(c.birthDate)}</p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TEMPS.map(t => (
                  <button key={t} className={`chip ${c.temperament === t ? "on" : ""}`} style={{ fontSize: 11, padding: "5px 11px" }} onClick={() => updChild(i, "temperament", c.temperament === t ? "" : t)}>{t}</button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => upd({ children: [...d.children, newChild()] })}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px dashed var(--surface-border-s)", borderRadius: 12, padding: "9px 16px", color: "var(--ink-soft)", cursor: "pointer", fontSize: 13, width: "100%", justifyContent: "center" }}>
            <Plus /> Ajouter un enfant
          </button>
          {detectMultiple(d.children) && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", borderRadius: 50, padding: "5px 14px", color: "#fff", fontSize: 12, fontWeight: 500, marginTop: 8 }}>
              {detectMultiple(d.children)} détectés automatiquement
            </div>
          )}
        </div>

        {/* Type de naissance */}
        <div style={{ background: "rgba(245,237,230,0.03)", borderRadius: 20, padding: "20px", border: "1px solid rgba(245,237,230,0.08)", backdropFilter: "blur(24px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Type de naissance</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {BIRTH_TYPES.map(t => (
              <button key={t} className={`chip ${d.birthTypes.includes(t) ? "on" : ""}`}
                onClick={() => upd({ birthTypes: d.birthTypes.includes(t) ? d.birthTypes.filter(x => x !== t) : [...d.birthTypes, t] })}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Défis */}
        <div style={{ background: "rgba(245,237,230,0.03)", borderRadius: 20, padding: "20px", border: "1px solid rgba(245,237,230,0.08)", backdropFilter: "blur(24px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Ce qui me touche</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CHALS.map(c => (
              <button key={c} className={`chip ${d.challenges.includes(c) ? "on" : ""}`}
                onClick={() => upd({ challenges: d.challenges.includes(c) ? d.challenges.filter(x => x !== c) : [...d.challenges, c] })}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Contexte */}
        <div style={{ background: "rgba(245,237,230,0.03)", borderRadius: 20, padding: "20px", border: "1px solid rgba(245,237,230,0.08)", backdropFilter: "blur(24px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Mon contexte</p>
          <textarea className="field" placeholder="ex. Je suis séparée, je gère tout seul…" value={d.freeText} onChange={e => upd({ freeText: e.target.value })} maxLength={400} rows={4} style={{ resize: "none", lineHeight: 1.6 }} />
        </div>

        {/* Save */}
        <button className="btn btn-t" onClick={save} style={{ position: "relative" }}>
          {saved ? <><Check s={16} /> Sauvegardé !</> : "Enregistrer les modifications"}
        </button>

        {/* Reset */}
        <button onClick={async () => {
          const isPremium = profile.isPremium || false;
          await S.set("elia_profile", isPremium ? { isPremium: true } : null);
          await Promise.all([
            S.set("elia_memory", null), S.set("elia_sessions", null),
            S.set("elia_tracking", null), S.set("elia_last_sos", null),
            S.set("elia_chat_history", null), S.set("elia_daily", null),
            S.set("elia_sos_usage", null),
          ]);
          window.location.reload();
        }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: 12, textAlign: "center", padding: "8px", fontStyle: "italic" }}>
          Réinitialiser mon profil
        </button>

        <div style={{ borderTop: "1px solid rgba(245,237,230,0.06)", paddingTop: 16, display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
          {[
            { label: "Mentions légales", fn: onLegal },
            { label: "Confidentialité", fn: onConfidentialite },
            { label: "CGU", fn: onCgu },
            { label: "CGV", fn: onCgv },
            { label: "Cookies", fn: onCookies },
          ].map(({ label, fn }, i, arr) => (
            <span key={label} style={{ display: "flex", alignItems: "center" }}>
              <button onClick={fn} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,237,230,0.22)", fontSize: 11, padding: "4px 8px", fontFamily: "'Jost', system-ui, sans-serif", letterSpacing: ".02em" }}>{label}</button>
              {i < arr.length - 1 && <span style={{ color: "rgba(245,237,230,0.10)", fontSize: 11 }}>·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function AppInner() {
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState("loading");
  const [sos, setSos] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [premiumToken, setPremiumToken] = useState(null);

  useEffect(() => {
    const init = async () => {
      // 1. Session Supabase
      let session = null;
      try {
        session = await getOrCreateSession();
        if (session) await migrateLocalStorageToSupabase(session.user.id);
      } catch {}

      // 2. Vérification Stripe AVANT de charger le profil (évite la race condition)
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");
      if (sessionId) {
        window.history.replaceState({}, "", window.location.pathname);
        try {
          const r = await fetch(`/api/verify-session?id=${encodeURIComponent(sessionId)}`);
          const { paid, token } = await r.json();
          if (paid) {
            if (token) await S.set("elia_premium_token", token);
            const existing = await S.get("elia_profile");
            if (existing) await S.set("elia_profile", { ...existing, isPremium: true });
          }
        } catch {}
      }

      // 3. Charger profil, consentement légal et token premium en parallèle
      const [p, legal, token] = await Promise.all([
        S.get("elia_profile"),
        S.get("elia_legal"),
        S.get("elia_premium_token"),
      ]);
      // isPremium dérivé du token (source de vérité) — évite toute désync
      const profileWithPremium = p ? { ...p, isPremium: !!token } : p;
      setProfile(profileWithPremium);
      if (token) setPremiumToken(token);
      if (!legal) setScreen("legal");
      else setScreen(p?.parentName ? "home" : "onboarding");
    };
    init();
  }, []);

  const handleDone = async p => {
    const existing = await S.get("elia_profile");
    const merged = { ...p, isPremium: existing?.isPremium || false };
    await S.set("elia_profile", merged);
    setProfile(merged);
    setScreen("home");
  };

  const handleNavigate = s => {
    if (s === "chat") { setSos(false); }
    setScreen(s);
  };

  const updateProfile = p => { setProfile(p); };

  const showNav = ["home", "chat", "profile"].includes(screen);

  if (screen === "loading") return (
    <ErrorBoundary>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: "#080608", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 320, height: 320, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(180,80,45,0.18) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <motion.div animate={{ opacity: [0.18, 0.85, 0.18] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ textAlign: "center" }}>
          <span className="serif" style={{ fontStyle: "normal", fontSize: 32, fontWeight: 400, color: "rgba(245,237,230,0.85)", letterSpacing: ".36em" }}>NERA</span>
        </motion.div>
      </div>
    </ErrorBoundary>
  );

  return (
    <ErrorBoundary>
    <>
      <GlobalStyles />
      {/* Extra padding for bottom nav */}
      {showNav && <style>{`.has-nav { padding-bottom: 68px; }`}</style>}

      <AnimatePresence mode="wait">
        {screen === "legal" && (
          <motion.div key="legal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.32, ease: "easeOut" }}>
            <LegalConsent onAccept={async () => {
              await S.set("elia_legal", true);
              fetch("/api/consent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ version: "1.0" }),
              }).catch(() => {});
              const p = await S.get("elia_profile");
              setScreen(p ? "home" : "onboarding");
            }} />
          </motion.div>
        )}
        {screen === "onboarding" && (
          <motion.div key="ob" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.32, ease: "easeOut" }}>
            <Onboarding onDone={handleDone} />
          </motion.div>
        )}
        {screen === "home" && profile && (
          <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease: "easeOut" }} className="has-nav">
            <Home profile={profile} onStart={s => { setSos(s); setScreen("chat"); }} onPremium={() => setShowPremium(true)} />
          </motion.div>
        )}
        {screen === "chat" && profile && (
          <motion.div key="chat" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: "easeOut" }} style={{ height: "calc(100vh - 68px)" }}>
            <Chat profile={profile} isSos={sos} onBack={() => setScreen("home")} onPremium={() => setShowPremium(true)} premiumToken={premiumToken} />
          </motion.div>
        )}
        {screen === "profile" && profile && (
          <motion.div key="profile" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: "easeOut" }} className="has-nav">
            <ProfileScreen profile={profile} onSave={updateProfile} onPremium={() => setShowPremium(true)} onLegal={() => setScreen("mentions-legales")} onConfidentialite={() => setScreen("confidentialite")} onCgu={() => setScreen("cgu")} onCgv={() => setScreen("cgv")} onCookies={() => setScreen("cookies")} />
          </motion.div>
        )}
        {screen === "mentions-legales" && (
          <motion.div key="mentions-legales" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: "easeOut" }}>
            <MentionsLegalesScreen onBack={() => setScreen("profile")} />
          </motion.div>
        )}
        {screen === "confidentialite" && (
          <motion.div key="confidentialite" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: "easeOut" }}>
            <ConfidentialiteScreen onBack={() => setScreen("profile")} />
          </motion.div>
        )}
        {screen === "cgu" && (
          <motion.div key="cgu" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: "easeOut" }}>
            <CguScreen onBack={() => setScreen("profile")} />
          </motion.div>
        )}
        {screen === "cgv" && (
          <motion.div key="cgv" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: "easeOut" }}>
            <CgvScreen onBack={() => setScreen("profile")} />
          </motion.div>
        )}
        {screen === "cookies" && (
          <motion.div key="cookies" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: "easeOut" }}>
            <CookiesScreen onBack={() => setScreen("profile")} />
          </motion.div>
        )}
      </AnimatePresence>

      {showNav && <BottomNav screen={screen} onNavigate={handleNavigate} />}

      <AnimatePresence>
        {showPremium && profile && (
          <StripeModal
            profile={profile}
            onClose={() => setShowPremium(false)}
          />
        )}
      </AnimatePresence>
    </>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
