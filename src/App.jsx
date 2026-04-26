import { useState, useEffect, useRef, useCallback, Component } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return (
      <div style={{ minHeight: "100vh", background: "#1A0F0A", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "rgba(249,245,239,0.62)", marginBottom: 16 }}>Une erreur est survenue. Merci de recharger la page.</p>
          <button onClick={() => window.location.reload()} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#B96A4B,#9A4F32)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 15 }}>Recharger</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

// ─── SANITIZE ─────────────────────────────────────────────────────────────────
const sanitize = str => (str || "").slice(0, 500).replace(/\[INST\]|\[\/INST\]|<\|system\|>|<\|user\|>/gi, "").replace(/\n{4,}/g, "\n\n");

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream:   #1A0F0A;
      --cream-2: #140C08;
      --petal:   rgba(255,255,255,0.10);
      --terra:   #B96A4B;
      --terra-l: #C87B5A;
      --terra-d: #9A4F32;
      --sage:    #7A9178;
      --sage-l:  #A8BDA6;
      --brown:   #F9F5EF;
      --brown-m: rgba(249,245,239,0.62);
      --brown-l: rgba(249,245,239,0.35);
      --rose:    rgba(255,255,255,0.04);
      --rose-d:  rgba(255,255,255,0.10);
      --white:   rgba(255,255,255,0.06);
      --shadow-s: 0 4px 16px rgba(0,0,0,0.32);
      --shadow-m: 0 8px 32px rgba(0,0,0,0.40);
      --shadow-l: 0 20px 60px rgba(0,0,0,0.55);
    }

    html, body, #root {
      height: 100%;
      font-family: 'Jost', system-ui, sans-serif;
      color: var(--brown);
      -webkit-font-smoothing: antialiased;
    }

    .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
    input, textarea, button { font-family: 'Jost', system-ui, sans-serif; }

    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 2px; }

    ::selection { background: rgba(185,106,75,0.38); color: #F9F5EF; }

    .field {
      width: 100%; padding: 13px 16px; border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06);
      color: var(--brown); font-size: 15px; font-weight: 300; outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .field:focus { border-color: rgba(255,255,255,0.28); box-shadow: 0 0 0 3px rgba(185,106,75,.18); }
    .field::placeholder { color: var(--brown-l); }

    .chip {
      padding: 8px 16px; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04);
      color: var(--brown-m); font-size: 13px; cursor: pointer;
      transition: all .15s; white-space: nowrap; font-weight: 400;
    }
    .chip:hover { border-color: rgba(255,255,255,0.25); color: var(--brown); background: rgba(255,255,255,0.08); }
    .chip.on { background: var(--terra); border-color: var(--terra); color: #fff; }

    .btn {
      width: 100%; padding: 14px 24px; border-radius: 10px;
      font-size: 15px; font-weight: 500; cursor: pointer; border: none;
      transition: all .18s; display: flex; align-items: center; justify-content: center; gap: 8px;
      letter-spacing: .03em;
    }
    .btn-t { background: linear-gradient(135deg, var(--terra) 0%, var(--terra-d) 100%); color: #fff; box-shadow: 0 4px 20px rgba(185,106,75,.30); }
    .btn-t:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(185,106,75,.45); filter: brightness(1.08); }
    .btn-t:disabled { opacity: .35; cursor: default; transform: none; box-shadow: none; }
    .btn-g {
      background: rgba(255,255,255,0.05); color: var(--brown-m);
      border: 1px solid rgba(255,255,255,0.12);
      font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 17px;
      backdrop-filter: blur(12px);
    }
    .btn-g:hover { border-color: rgba(255,255,255,0.28); color: var(--brown); background: rgba(255,255,255,0.09); }

    .bubble-u {
      background: linear-gradient(135deg, var(--terra), var(--terra-d));
      color: #fff; border-radius: 18px 18px 4px 18px;
      box-shadow: 0 4px 16px rgba(185,106,75,.28);
    }
    .bubble-a {
      background: rgba(255,255,255,0.06); color: var(--brown);
      border-radius: 18px 18px 18px 4px;
      border: 1px solid rgba(255,255,255,0.10);
      backdrop-filter: blur(20px);
    }

    .dots span {
      display: inline-block; width: 5px; height: 5px; border-radius: 50%;
      background: var(--brown-m); margin: 0 2px;
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
      0%,100% { box-shadow: 0 0 0 0 rgba(185,106,75,.35); }
      50% { box-shadow: 0 0 0 12px rgba(185,106,75,0); }
    }

    .step-bar { display: flex; gap: 4px; justify-content: center; margin-bottom: 36px; }
    .step-bar span { height: 2px; border-radius: 2px; background: rgba(255,255,255,0.12); transition: all .35s; }
    .step-bar span.on { background: var(--terra); }

    .av {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, var(--terra), var(--terra-d));
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond',serif; font-size: 15px; color: #fff;
      flex-shrink: 0;
      box-shadow: 0 2px 10px rgba(185,106,75,.35);
    }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.72);
      backdrop-filter: blur(14px); z-index: 1000;
      display: flex; align-items: center; justify-content: center; padding: 24px;
    }
    .modal-box {
      background: rgba(26,15,10,0.90); border-radius: 24px; padding: 36px 32px;
      max-width: 400px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,.65);
      border: 1px solid rgba(255,255,255,0.12);
      backdrop-filter: blur(28px);
      position: relative;
    }

    .btn-sos {
      height: 52px; width: 100%; border-radius: 10px;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10);
      color: rgba(249,245,239,0.62); font-family: 'Jost', system-ui, sans-serif;
      font-size: 14px; font-weight: 500; cursor: pointer; transition: all .2s;
      display: flex; align-items: center; justify-content: center;
    }
    .btn-sos:hover { border-color: rgba(185,106,75,0.45); color: #B96A4B; }
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

// ─── DAILY LIMIT ─────────────────────────────────────────────────────────────
const FREE_DAILY_LIMIT = 10;

async function getDailyUsage() {
  const today = new Date().toLocaleDateString("fr-FR");
  const data = await S.get("elia_daily") || { date: "", count: 0 };
  return data.date === today ? data.count : 0;
}

async function incrementDailyUsage() {
  const today = new Date().toLocaleDateString("fr-FR");
  const data = await S.get("elia_daily") || { date: "", count: 0 };
  const count = data.date === today ? data.count + 1 : 1;
  await S.set("elia_daily", { date: today, count });
  return count;
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const S = {
  async get(k) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  async set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }
};

// ─── LEGAL CONSENT ────────────────────────────────────────────────────────────
function LegalConsent({ onAccept }) {
  const [age, setAge] = useState(false);
  const [cgu, setCgu] = useState(false);
  const [rgpd, setRgpd] = useState(false);
  const [showCgu, setShowCgu] = useState(false);
  const [showRgpd, setShowRgpd] = useState(false);
  const canContinue = age && cgu && rgpd;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "rgba(26,15,10,0.85)", borderRadius: 28, padding: "36px 32px", maxWidth: 440, width: "100%", boxShadow: "var(--shadow-l)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(24px)" }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--terra)", marginBottom: 16 }}>
            <Leaf s={22} />
            <span className="serif" style={{ fontSize: 15, fontWeight: 600, letterSpacing: ".04em", color: "var(--terra-d)" }}>Parentelïa</span>
          </div>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Avant de commencer</h2>
          <p style={{ fontSize: 13, color: "var(--brown-m)", fontWeight: 300, lineHeight: 1.6 }}>
            Elia est une assistante bienveillante, <strong>pas un professionnel de santé</strong>. En cas d'urgence médicale, contacte le <strong>15</strong> (SAMU) ou le <strong>3114</strong> (numéro national de prévention du suicide).
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {[
            { val: age, set: setAge, label: "J'ai 18 ans ou plus" },
            { val: cgu, set: setCgu, label: null, cguLabel: true },
            { val: rgpd, set: setRgpd, label: null, rgpdLabel: true },
          ].map((item, i) => (
            <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <div onClick={() => item.set(!item.val)}
                style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${item.val ? "var(--terra)" : "rgba(255,255,255,0.20)"}`, background: item.val ? "var(--terra)" : "rgba(255,255,255,0.08)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", marginTop: 1 }}>
                {item.val && <Check s={12} />}
              </div>
              <span style={{ fontSize: 13, color: "var(--brown-m)", lineHeight: 1.5, fontWeight: 300 }}>
                {item.label}
                {item.cguLabel && <>J'accepte les <button onClick={() => setShowCgu(!showCgu)} style={{ background: "none", border: "none", color: "var(--terra)", cursor: "pointer", fontSize: 13, textDecoration: "underline", padding: 0 }}>Conditions Générales d'Utilisation</button></>}
                {item.rgpdLabel && <>J'ai lu la <button onClick={() => setShowRgpd(!showRgpd)} style={{ background: "none", border: "none", color: "var(--terra)", cursor: "pointer", fontSize: 13, textDecoration: "underline", padding: 0 }}>Politique de confidentialité</button> (RGPD)</>}
              </span>
            </label>
          ))}
        </div>

        {/* CGU */}
        <AnimatePresence>
          {showCgu && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, fontSize: 12, color: "var(--brown-m)", lineHeight: 1.7, fontWeight: 300 }}>
              <strong style={{ display: "block", marginBottom: 6 }}>CGU — Parentelïa</strong>
              L'application Parentelïa fournit un soutien émotionnel et des informations générales à titre indicatif uniquement. Elle ne remplace en aucun cas un avis médical, psychologique ou thérapeutique professionnel.<br /><br />
              L'utilisateur s'engage à utiliser le service de bonne foi, à ne pas tenter d'en détourner le fonctionnement, et à ne pas transmettre de données personnelles de tiers sans leur consentement.<br /><br />
              En cas de situation d'urgence médicale ou de danger pour vous ou autrui, contactez immédiatement les services d'urgence (15, 17, 18 ou 112).<br /><br />
              Parentelïa se réserve le droit de modifier les présentes CGU. L'utilisation continue du service vaut acceptation des modifications.
            </motion.div>
          )}
        </AnimatePresence>

        {/* RGPD */}
        <AnimatePresence>
          {showRgpd && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, fontSize: 12, color: "var(--brown-m)", lineHeight: 1.7, fontWeight: 300 }}>
              <strong style={{ display: "block", marginBottom: 6 }}>Politique de confidentialité — RGPD</strong>
              <strong>Données collectées :</strong> prénom, rôle parental, informations sur les enfants, défis déclarés et échanges avec Elia. Ces données sont stockées <em>uniquement sur votre appareil</em> (localStorage) et ne sont pas transmises à nos serveurs.<br /><br />
              <strong>Traitement IA :</strong> les messages envoyés à Elia sont traités par l'API d'Anthropic (Claude) de manière anonyme. Aucune donnée identifiante n'est conservée par Anthropic au-delà du traitement de la requête.<br /><br />
              <strong>Vos droits (RGPD) :</strong> vous pouvez à tout moment supprimer l'intégralité de vos données via "Réinitialiser mon profil" dans les paramètres. Droit d'accès, de rectification et d'opposition garantis.<br /><br />
              <strong>Responsable de traitement :</strong> Parentelïa — contact : privacy@parentelia.com
            </motion.div>
          )}
        </AnimatePresence>

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
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal-box" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .95 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ color: "var(--terra)", marginBottom: 12 }}><Leaf s={28} /></div>
          <h2 className="serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Je suis là avec toi</h2>
          <p style={{ fontSize: 13, color: "var(--brown-m)", fontWeight: 300, lineHeight: 1.6 }}>
            Ce que tu traverses est très difficile. Tu n'es pas seul(e). Des professionnels formés sont disponibles maintenant, gratuitement.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {EMERGENCY_NUMBERS.map(e => (
            <a key={e.num} href={`tel:${e.num}`}
              style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "12px 16px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ background: "var(--terra)", color: "#fff", borderRadius: 10, padding: "6px 12px", fontSize: 15, fontWeight: 600, flexShrink: 0 }}>{e.num}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--brown)" }}>{e.label}</p>
                <p style={{ fontSize: 11, color: "var(--brown-l)", fontWeight: 300 }}>{e.desc}</p>
              </div>
            </a>
          ))}
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brown-l)", fontSize: 13, width: "100%", textAlign: "center", fontStyle: "italic" }}>
          Continuer à parler avec Elia
        </button>
      </motion.div>
    </div>
  );
}

// ─── STRIPE MODAL ─────────────────────────────────────────────────────────────
// Price IDs from your Stripe account
const STRIPE_PRICES = {
  monthly: "price_1TOHRf9TErY2lFQDoObZAF6t",
  annual:  "price_1TOHS59TErY2lFQDZz2AterS",
};

function StripeModal({ profile, onClose, onSuccess }) {
  const [selected, setSelected] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Merci d'entrer une adresse email valide.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Redirect to Stripe Checkout
      // In production, this call goes to YOUR backend which creates a Stripe Checkout Session
      // and returns a URL. Here we show the flow clearly.
      const priceId = STRIPE_PRICES[selected];

      // ⚠️ THIS REQUIRES A BACKEND — see deployment guide below
      // For now, we show a placeholder that will work once deployed
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          email,
          parentName: profile.parentName,
          successUrl: window.location.origin + "?success=1",
          cancelUrl: window.location.origin + "?canceled=1",
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
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "var(--brown-l)" }}><Xmark s={18} /></button>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,var(--terra),var(--terra-d))", borderRadius: 50, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 500, marginBottom: 16 }}>
            <Star s={12} /> Parentelïa Premium
          </div>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Accompagnement complet</h2>
          <p style={{ color: "var(--brown-m)", fontSize: 14, fontWeight: 300, lineHeight: 1.5 }}>
            Mémoire longue, analyses hebdomadaires, accès illimité à Elïa.
          </p>
        </div>

        {/* Features */}
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "16px 18px", marginBottom: 24 }}>
          {["Conversations illimitées avec Elïa", "Mémoire longue & suivi personnalisé", "Analyses et tendances hebdomadaires", "Accès prioritaire aux nouvelles fonctions"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ color: "var(--sage)", flexShrink: 0 }}><Check s={14} /></div>
              <span style={{ fontSize: 13, color: "var(--brown-m)", fontWeight: 300 }}>{f}</span>
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
                border: selected === p.key ? "2px solid var(--terra)" : "1.5px solid rgba(255,255,255,0.12)",
                background: selected === p.key ? "rgba(185,106,75,.14)" : "rgba(255,255,255,0.05)",
                transition: "all .18s", position: "relative",
              }}>
              {p.sub && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "var(--sage)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 50, whiteSpace: "nowrap", fontWeight: 500 }}>{p.sub}</div>}
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--brown)", marginBottom: 2 }}>{p.label}</div>
              <div className="serif" style={{ fontSize: 17, fontWeight: 600, color: "var(--terra)" }}>{p.price}</div>
            </button>
          ))}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <input className="field" type="email" placeholder="Ton adresse email" value={email} onChange={e => setEmail(e.target.value)} style={{ fontSize: 14 }} />
        </div>

        {error && <p style={{ color: "var(--terra-d)", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{error}</p>}

        <button className="btn btn-t" onClick={handleCheckout} disabled={loading}>
          {loading ? "Chargement…" : "Commencer · Paiement sécurisé"}
        </button>
        <p style={{ fontSize: 11, color: "var(--brown-l)", textAlign: "center", marginTop: 10, fontStyle: "italic" }}>
          Résiliable à tout moment · Droit de rétractation 14j · Paiement via Stripe
        </p>
      </motion.div>
    </div>
  );
}

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function askElia({ profile, messages, isSos, memory }) {
  const isPremium = profile.isPremium;

  const children = profile.children
    .filter(c => c.firstName)
    .map(c => {
      const age = calcAge(c.birthDate) || c.age || "âge non précisé";
      const extras = [c.temperament, c.notes].filter(Boolean).join(", ");
      return `${c.firstName} (${age}${extras ? ", " + extras : ""})`;
    }).join(", ") || "non renseigné";

  const multipleLabel = detectMultiple(profile.children);
  const birthCtx = profile.birthTypes?.length
    ? `Naissance : ${profile.birthTypes.join(", ")}.` : "";

  const memLimit = isPremium ? 20 : 3;
  const memBlock = memory?.length
    ? "\n\nMÉMOIRE :\n" + memory.slice(-memLimit).map(m => "- " + m).join("\n")
    : "";

  const premiumBlock = isPremium ? `
NIVEAU PREMIUM — réponses approfondies :
- Analyse les patterns et tendances dans ce que vit ${profile.parentName}
- Personnalise chaque réponse selon l'historique partagé
- Quand pertinent, propose doucement une orientation vers un professionnel :
  • Pédiatre : santé physique, développement, courbe de croissance
  • Ostéopathe : tensions posturales, coliques, sommeil agité
  • Kinésithérapeute : motricité, tonus, retard moteur
  • Psychologue/psy périnatal : anxiété parentale, baby blues, dépression
  • Sage-femme : suivi postnatal, allaitement, périnée
  Toujours avec une phrase d'explication douce sur POURQUOI ce professionnel peut aider.
- Réponses structurées : validation → analyse → pistes concrètes → question d'approfondissement` : `
NIVEAU GRATUIT :
- Réponses courtes et bienveillantes (4-6 phrases max)
- Validation émotionnelle prioritaire
- 1 piste concrète maximum`;

  const system = `Tu es Elia, une assistante parentale émotionnelle et bienveillante.
Tu accompagnes ${sanitize(profile.parentName)} (${sanitize(profile.parentRole)}).
Enfants : ${children}.${multipleLabel ? ` (${multipleLabel})` : ""}
${birthCtx}
${profile.challenges?.length ? "Défis déclarés : " + profile.challenges.join(", ") + "." : ""}
${profile.freeText ? "Contexte personnel : " + sanitize(profile.freeText) : ""}
${memBlock}
${premiumBlock}

TON TOUJOURS :
- Chaleureux, humain, jamais jugeant, jamais culpabilisant
- Phrases naturelles et fluides, comme une amie bienveillante et experte
- 1 emoji maximum par réponse
- Jamais de diagnostic médical
${isSos ? `
MODE SOS — PRIORITÉ ABSOLUE :
- Réponse très courte (3-5 phrases max)
- Présence émotionnelle avant tout
- Propose une technique de respiration simple si pertinent
- 1 question ouverte douce maximum` : ""}

Si tu te souviens d'un échange : utilise "Tu me parlais de…" naturellement.`;

  const msgLimit = isPremium ? messages.length : Math.min(messages.length, 10);
  const resp = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tier: isPremium ? "premium" : "free",
      max_tokens: isPremium ? 1200 : 600,
      system,
      messages: messages.slice(-msgLimit).map(m => ({ role: m.role, content: m.content }))
    })
  });

  if (!resp.ok) throw new Error("API " + resp.status);
  const data = await resp.json();
  return data.content.map(b => b.text || "").join("");
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function calcAge(birth) {
  if (!birth) return null;
  try {
    const b = new Date(birth);
    if (isNaN(b.getTime())) return null;
    const now = new Date();
    let mo = (now.getFullYear() - b.getFullYear()) * 12 + now.getMonth() - b.getMonth();
    if (now.getDate() < b.getDate()) mo--;
    if (mo < 0) return null;
    if (mo === 0) return "Nouveau-né";
    if (mo < 12) return mo + " mois";
    const y = Math.floor(mo / 12), m = mo % 12;
    return m > 0 ? `${y} ans ${m} mois` : `${y} ans`;
  } catch {
    return null;
  }
}
let _childId = 0;
const newChild = () => ({ id: `c-${Date.now()}-${++_childId}`, firstName: "", birthDate: "", temperament: "", notes: "" });

function detectMultiple(children) {
  const dated = children.filter(c => c.birthDate && c.firstName);
  if (dated.length < 2) return null;
  const ms = dated.map(c => new Date(c.birthDate).getTime());
  const groups = new Set();
  for (let i = 0; i < ms.length; i++) {
    for (let j = i + 1; j < ms.length; j++) {
      if (Math.abs(ms[i] - ms[j]) / 86400000 <= 90) {
        groups.add(i); groups.add(j);
      }
    }
  }
  if (groups.size >= 3) return "Triplés";
  if (groups.size === 2) return "Jumeaux";
  return null;
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const ROLES = ["Maman", "Papa", "Co-parent", "Autre"];
const TEMPS = ["Calme & facile", "Actif & énergique", "Sensible & émotif", "Curieux & éveillé", "Timide & réservé"];
const CHALS = ["Sommeil difficile", "Pleurs & coliques", "Alimentation", "Gestion des émotions", "Fatigue & épuisement", "Anxiété parentale", "Fratrie & jalousie", "Développement", "Solitude & isolement"];
const BIRTH_TYPES = ["Voie basse", "Césarienne", "Déclenchement", "Prématuré", "Forceps / ventouse"];

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const STEPS = 4;
  const [d, setD] = useState({
    parentName: "", parentRole: "Maman",
    children: [newChild()],
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
    <div style={{ minHeight: "100vh", padding: "0 32px 48px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>

        {/* Progress bar – full width, top, segments */}
        <div style={{ display: "flex", gap: 6, paddingTop: 52, marginBottom: 40 }}>
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i <= step ? "var(--terra)" : "rgba(255,255,255,0.08)", transition: "background .4s" }} />
          ))}
        </div>

        {/* Logo – wordmark only */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span className="serif" style={{ fontStyle: "italic", fontSize: 18, fontWeight: 400, color: "#E8CABB", letterSpacing: ".04em" }}>Parentelïa</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .2 }}>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: .38 }}>
                <h2 className="serif" style={{ fontSize: 34, fontWeight: 600, marginBottom: 8 }}>Bienvenue</h2>
                <p style={{ color: "var(--brown-m)", fontSize: 14, fontWeight: 300, lineHeight: 1.65 }}>Je suis Elïa. Dis-moi comment t'appeler.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .06, duration: .38 }}
                style={{ marginTop: 48 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--brown-l)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 12 }}>Ton prénom</label>
                <input className="field" placeholder="ex. Sophie…" value={d.parentName} onChange={e => upd({ parentName: e.target.value })}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .38 }}
                style={{ marginTop: 40 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--brown-l)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 12 }}>Tu es…</label>
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
                  style={{ color: "#F9F5EF", fontWeight: 500 }}>
                  Continuer →
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
              <h2 className="serif" style={{ fontSize: 34, fontWeight: 600, marginBottom: 8 }}>Tes enfants</h2>
              <p style={{ color: "var(--brown-m)", fontSize: 14, marginBottom: 24, fontWeight: 300 }}>Pour t'accompagner au mieux, parle-moi d'eux.</p>
              {detectMultiple(d.children) && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,var(--terra),var(--terra-d))", borderRadius: 50, padding: "5px 14px", color: "#fff", fontSize: 12, fontWeight: 500, marginBottom: 12 }}>
                  {detectMultiple(d.children)} détectés
                </div>
              )}
              <div style={{ maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
                {d.children.map((c, i) => (
                  <div key={c.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid rgba(255,255,255,0.10)", position: "relative" }}>
                    {d.children.length > 1 && (
                      <button onClick={() => upd({ children: d.children.filter((_, idx) => idx !== i) })}
                        style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "var(--brown-l)" }}>
                        <Xmark />
                      </button>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                      <input className="field" placeholder="Prénom" value={c.firstName} onChange={e => updChild(i, "firstName", e.target.value)} style={{ fontSize: 14 }} />
                      <input className="field" type="date" value={c.birthDate} onChange={e => updChild(i, "birthDate", e.target.value)} style={{ fontSize: 13 }} />
                    </div>
                    {c.birthDate && calcAge(c.birthDate) && (
                      <p style={{ fontSize: 12, color: "var(--terra)", marginBottom: 8, fontStyle: "italic" }}>{calcAge(c.birthDate)}</p>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                      {TEMPS.map(t => (
                        <button key={t} className={`chip ${c.temperament === t ? "on" : ""}`} style={{ fontSize: 11, padding: "5px 11px" }} onClick={() => updChild(i, "temperament", c.temperament === t ? "" : t)}>{t}</button>
                      ))}
                    </div>
                    <input className="field" placeholder="Particularités… (optionnel)" value={c.notes} onChange={e => updChild(i, "notes", e.target.value)} style={{ fontSize: 13 }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--brown-l)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 8 }}>Type de naissance</label>
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
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px dashed rgba(255,255,255,0.18)", borderRadius: 12, padding: "9px 16px", color: "var(--brown-m)", cursor: "pointer", fontSize: 13, marginBottom: 22, marginTop: 8, width: "100%", justifyContent: "center" }}>
                <Plus /> Ajouter un enfant
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-g" onClick={() => setStep(0)} style={{ width: "auto", padding: "14px 18px" }}><Back /></button>
                <button className="btn btn-t" onClick={() => setStep(2)} style={{ color: "#F9F5EF", fontWeight: 500 }}>Continuer →</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
              <h2 className="serif" style={{ fontSize: 34, fontWeight: 600, marginBottom: 8 }}>Ce qui te pèse</h2>
              <p style={{ color: "var(--brown-m)", fontSize: 14, marginBottom: 24, fontWeight: 300 }}>Sélectionne ce qui te touche en ce moment.</p>
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
                <button className="btn btn-t" onClick={() => setStep(3)} style={{ color: "#F9F5EF", fontWeight: 500 }}>Continuer →</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
              <h2 className="serif" style={{ fontSize: 34, fontWeight: 600, marginBottom: 8 }}>En quelques mots</h2>
              <p style={{ color: "var(--brown-m)", fontSize: 14, marginBottom: 24, fontWeight: 300 }}>Y a-t-il quelque chose d'important à savoir ? Facultatif.</p>
              <textarea className="field"
                placeholder="ex. Je suis séparée, je gère tout seul, ma fille a été hospitalisée récemment…"
                value={d.freeText} onChange={e => upd({ freeText: e.target.value })}
                rows={5} style={{ resize: "none", lineHeight: 1.6 }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button className="btn btn-g" onClick={() => setStep(2)} style={{ width: "auto", padding: "14px 18px" }}><Back /></button>
                <button className="btn btn-t" onClick={finish} style={{ color: "#F9F5EF", fontWeight: 500 }}>Commencer avec Elïa</button>
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
  "Un parent imparfait présent vaut mille parents parfaits absents.",
  "Ce que tu traverses est difficile. Ce que tu fais est précieux.",
  "Prendre soin de soi, c'est aussi prendre soin de son enfant.",
  "Toutes les émotions que tu ressens sont valides. Même la culpabilité.",
  "Tu n'as pas à tout réussir. Tu as juste à essayer.",
];
const SIGNATURES = [
  "— pour les nuits courtes",
  "— pour les moments difficiles",
  "— pour les parents épuisés",
  "— pour quand c'est trop lourd",
  "— pour les jours sans lumière",
];
const CHECKIN_MOODS = ["Difficile", "Mitigée", "Douce", "Lumineuse"];

function Home({ profile, onStart, onPremium }) {
  const TODAY = new Date().toLocaleDateString("fr-FR");
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const tipIdx = new Date().getDate() % TIPS.length;
  const tip = TIPS[tipIdx];
  const sig = SIGNATURES[tipIdx];

  const firstChild = profile.children.filter(c => c.firstName)[0];
  const childAge = firstChild ? (calcAge(firstChild.birthDate) || firstChild.age) : null;
  const dayNum = firstChild?.birthDate
    ? Math.max(1, Math.floor((new Date() - new Date(firstChild.birthDate)) / 86400000) + 1)
    : null;
  const subtitle = firstChild
    ? [firstChild.firstName, childAge, dayNum ? `jour ${dayNum}` : null].filter(Boolean).join(" · ")
    : null;

  const [tracking, setTracking] = useState(null);
  const [sosBanner, setSosBanner] = useState(false);

  useEffect(() => {
    S.get("elia_tracking").then(t => {
      const today = t?.find(d => d.date === TODAY);
      setTracking(today || null);
    });
    if (profile.isPremium) {
      S.get("elia_last_sos").then(ts => {
        if (!ts) return;
        const hours = (Date.now() - ts) / 3600000;
        if (hours >= 4 && hours <= 36) setSosBanner(true);
      });
    }
  }, []);

  const saveCheckin = async (checkin) => {
    const t = await S.get("elia_tracking") || [];
    const existing = t.find(d => d.date === TODAY) || {};
    const updated = [...t.filter(d => d.date !== TODAY), { ...existing, date: TODAY, checkin }];
    await S.set("elia_tracking", updated);
    setTracking(prev => ({ ...prev, date: TODAY, checkin }));
  };

  const fd = (delay) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: .4 } });

  return (
    <div style={{ minHeight: "100vh", padding: "0 24px 24px" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>

        {/* Wordmark */}
        <motion.div {...fd(0)} style={{ textAlign: "center", paddingTop: 52, marginBottom: 48 }}>
          <span className="serif" style={{ fontStyle: "italic", fontSize: 18, fontWeight: 400, color: "#E8CABB", letterSpacing: ".04em" }}>Parentelïa</span>
        </motion.div>

        {/* Greeting */}
        <motion.div {...fd(.06)} style={{ textAlign: "center", marginBottom: subtitle ? 10 : 40 }}>
          <h1 className="serif" style={{ fontSize: 52, fontWeight: 400, lineHeight: 1.1, color: "#F9F5EF", margin: 0 }}>
            {greet},<br /><em>{profile.parentName}</em>
          </h1>
        </motion.div>

        {/* Subtitle */}
        {subtitle && (
          <motion.div {...fd(.12)} style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 14, color: "rgba(249,245,239,0.55)", fontWeight: 400 }}>{subtitle}</p>
          </motion.div>
        )}

        {/* SOS follow-up banner (premium only) */}
        <AnimatePresence>
          {sosBanner && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "16px 18px", marginBottom: 16, backdropFilter: "blur(20px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--terra-d)", marginBottom: 4 }}>Comment ça va depuis hier ?</p>
                  <p style={{ fontSize: 12, color: "var(--brown-m)", fontWeight: 300, lineHeight: 1.5 }}>Tu avais besoin d'aide. Je voulais prendre de tes nouvelles.</p>
                </div>
                <button onClick={() => setSosBanner(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brown-l)", flexShrink: 0 }}><Xmark /></button>
              </div>
              <button onClick={() => { setSosBanner(false); onStart(false); }}
                style={{ marginTop: 10, background: "var(--terra)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                En parler avec Elia →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card – Pour toi aujourd'hui */}
        <motion.div {...fd(.18)}
          style={{ background: "rgba(255,255,255,0.06)", borderRadius: 22, padding: 28, marginBottom: 16, border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(20px)", position: "relative", overflow: "hidden" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "rgba(249,245,239,0.45)", textTransform: "uppercase", letterSpacing: ".22em", marginBottom: 18 }}>Pour toi aujourd'hui</p>
          <div style={{ position: "relative", paddingLeft: 10 }}>
            <span className="serif" style={{ position: "absolute", top: -22, left: -6, fontSize: 56, lineHeight: 1, color: "var(--terra)", opacity: 0.4, fontWeight: 400, userSelect: "none" }}>«</span>
            <p className="serif" style={{ fontStyle: "italic", fontSize: 22, lineHeight: 1.4, color: "#F9F5EF", paddingTop: 10 }}>{tip}</p>
          </div>
          <p style={{ fontSize: 12, fontStyle: "italic", color: "var(--brown-m)", textAlign: "right", marginTop: 18 }}>{sig}</p>
        </motion.div>

        {/* Card – Check-in du soir */}
        <motion.div {...fd(.24)}
          style={{ background: "rgba(255,255,255,0.06)", borderRadius: 22, padding: 28, marginBottom: 16, border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(20px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "rgba(249,245,239,0.45)", textTransform: "uppercase", letterSpacing: ".22em", marginBottom: 14 }}>Check-in du soir</p>
          <p className="serif" style={{ fontSize: 26, fontWeight: 400, color: "#F9F5EF", marginBottom: 20, lineHeight: 1.2 }}>Comment s'est passée ta journée ?</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {CHECKIN_MOODS.map(m => (
              <button key={m} className={`chip ${tracking?.checkin === m ? "on" : ""}`}
                style={{ borderRadius: 999 }}
                onClick={() => saveCheckin(tracking?.checkin === m ? null : m)}>
                {m}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Presence indicator + CTAs */}
        <motion.div {...fd(.30)} style={{ marginTop: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7A9178", boxShadow: "0 0 8px rgba(122,145,120,0.65)", flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontSize: 13, color: "rgba(249,245,239,0.6)", fontWeight: 400 }}>Elia est là, disponible</span>
          </div>

          <button className="btn btn-t" onClick={() => onStart(false)}
            style={{ height: 56, color: "#F9F5EF", fontWeight: 500, marginBottom: 12 }}>
            Parler avec Elia →
          </button>

          <button className="btn-sos sos-ring" onClick={() => onStart(true)}>
            Besoin d'aide maintenant
          </button>
        </motion.div>

      </div>
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
const SOS_SHORTS = ["Je suis épuisée(é)", "Mon enfant ne dort pas", "Je me sens seul(e)", "J'ai besoin de souffler"];

function Chat({ profile, isSos, onBack, onPremium }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memory, setMemory] = useState([]);
  const [nudge, setNudge] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const bottomRef = useRef(null);
  const taRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const mem = await S.get("elia_memory") || [];
      const cnt = await S.get("elia_sessions") || 0;
      const daily = await getDailyUsage();
      setMemory(mem);
      setDailyCount(daily);
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

  const userMsgCount = msgs.filter(m => m.role === "user").length;

  const send = useCallback(async (text) => {
    const txt = (text || "").trim();
    if (!txt || loading) return;

    // Détection de crise
    if (CRISIS_KEYWORDS.some(k => txt.toLowerCase().includes(k))) {
      setCrisis(true);
    }

    // Limite journalière gratuit
    if (!profile.isPremium && dailyCount >= FREE_DAILY_LIMIT) {
      const alreadyBlocked = msgs.some(m => m.id === "limit-msg");
      if (!alreadyBlocked) {
        setMsgs(prev => [...prev, {
          role: "assistant",
          content: `Tu as atteint ta limite de ${FREE_DAILY_LIMIT} messages pour aujourd'hui 🌿\n\nPasse à Premium pour continuer à me parler sans limite, avec des analyses approfondies et ma mémoire longue. Ou reviens demain pour de nouveaux messages gratuits.`,
          id: "limit-msg"
        }]);
      }
      setNudge(true);
      return;
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
        memory
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
        const newCount = await incrementDailyUsage();
        setDailyCount(newCount);
        if (newCount >= FREE_DAILY_LIMIT - 2) {
          setTimeout(() => setNudge(true), 800);
        }
      }
    } catch (err) {
      console.error(err);
      setMsgs(prev => [...prev, {
        role: "assistant",
        content: "Je suis là, mais j'ai une petite difficulté technique. Respire un grand coup… 🌿 Réessaie dans un instant.",
        id: "err" + Date.now()
      }]);
    }
    setLoading(false);
  }, [msgs, loading, profile, isSos, memory, userMsgCount]);

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: "rgba(26,15,10,0.80)", borderBottom: "1px solid rgba(255,255,255,0.10)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "var(--shadow-s)", flexShrink: 0, backdropFilter: "blur(20px)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brown-m)", display: "flex", padding: 4 }}><Back s={19} /></button>
        <div className="av">E</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.1 }}>Elia</div>
          <div style={{ fontSize: 11, color: isSos ? "var(--terra)" : "var(--sage)", fontStyle: "italic" }}>
            {isSos ? <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terra)", display: "inline-block" }} />Mode SOS</span> : "Assistante parentale"}
          </div>
        </div>
        {!profile.isPremium && (
          <button
            onClick={onPremium}
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg, var(--terra), var(--terra-d))", border: "none", borderRadius: 50, padding: "6px 14px", fontSize: 12, color: "#fff", cursor: "pointer", fontWeight: 500 }}>
            <Star s={11} /> Premium
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14, background: "transparent" }}>
        <div style={{ maxWidth: 640, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Nudge premium */}
          <AnimatePresence>
            {nudge && !profile.isPremium && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: "linear-gradient(135deg,rgba(185,106,75,.12),rgba(122,145,120,.09))", border: "1px solid rgba(185,106,75,.28)", borderRadius: 18, padding: 18, backdropFilter: "blur(16px)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Star s={15} />
                  <div>
                    <p className="serif" style={{ fontSize: 15, fontStyle: "italic", marginBottom: 6 }}>
                      {dailyCount >= FREE_DAILY_LIMIT ? "Tu as atteint ta limite de 10 messages aujourd'hui." : "Je commence à percevoir des tendances dans ce que tu vis…"}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--brown-m)", lineHeight: 1.55, marginBottom: 12, fontWeight: 300 }}>
                      {dailyCount >= FREE_DAILY_LIMIT
                        ? "Reviens demain ou passe à Premium pour un accès illimité avec Elia."
                        : "Mes analyses approfondies, ma mémoire longue et tes rapports personnalisés sont dans la version complète."}
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={onPremium}
                        style={{ background: "var(--terra)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                        Découvrir · 12,99€ TTC/mois
                      </button>
                      <button onClick={() => setNudge(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brown-l)", fontSize: 13 }}>Plus tard</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {msgs.map((m, i) => (
            <motion.div
              key={m.id || i}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}
              style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
              {m.role === "assistant" && <div className="av" style={{ width: 30, height: 30, fontSize: 13 }}>E</div>}
              <div
                className={m.role === "user" ? "bubble-u" : "bubble-a"}
                style={{ maxWidth: "78%", padding: "13px 17px", fontSize: 15, lineHeight: 1.7, fontWeight: 300, whiteSpace: "pre-wrap" }}>
                {m.content}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <div className="av" style={{ width: 30, height: 30, fontSize: 13 }}>E</div>
              <div className="bubble-a" style={{ padding: "13px 17px" }}>
                <div className="dots"><span /><span /><span /></div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* SOS shortcuts */}
      {isSos && msgs.length <= 1 && (
        <div style={{ padding: "0 16px 10px", display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
          {SOS_SHORTS.map(s => (
            <button key={s} className="chip" style={{ fontSize: 12 }} onClick={() => send(s)}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ background: "rgba(26,15,10,0.80)", borderTop: "1px solid rgba(255,255,255,0.10)", padding: "14px 16px", flexShrink: 0, backdropFilter: "blur(20px)" }}>
        {!profile.isPremium && dailyCount >= FREE_DAILY_LIMIT ? (
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--terra-d)", marginBottom: 12 }}>
              Limite de {FREE_DAILY_LIMIT} messages atteinte pour aujourd'hui
            </p>
            <button className="btn btn-t" onClick={onPremium} style={{ marginBottom: 8 }}>
              Passer à Premium — illimité
            </button>
            <p style={{ fontSize: 11, color: "var(--brown-l)", fontStyle: "italic" }}>
              Ou reviens demain pour de nouveaux messages gratuits
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
                  background: input.trim() && !loading ? "linear-gradient(135deg,var(--terra),var(--terra-d))" : "rgba(255,255,255,0.10)",
                  border: "none",
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all .2s",
                  boxShadow: input.trim() && !loading ? "0 3px 12px rgba(185,106,75,.3)" : "none"
                }}>
                <Send s={17} />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "var(--brown-l)", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
              Elia ne remplace pas un professionnel de santé · Urgences : <a href="tel:15" style={{ color: "var(--terra)", textDecoration: "none" }}>15</a> · <a href="tel:3114" style={{ color: "var(--terra)", textDecoration: "none" }}>3114</a>
            </p>
            {!profile.isPremium && (
              <p style={{ fontSize: 11, color: FREE_DAILY_LIMIT - dailyCount <= 2 ? "var(--terra)" : "var(--brown-l)", textAlign: "center", marginTop: 2 }}>
                {FREE_DAILY_LIMIT - dailyCount > 0
                  ? `${FREE_DAILY_LIMIT - dailyCount} message${FREE_DAILY_LIMIT - dailyCount > 1 ? "s" : ""} restant${FREE_DAILY_LIMIT - dailyCount > 1 ? "s" : ""} aujourd'hui`
                  : ""}
              </p>
            )}
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
    { id: "chat",    label: "El\u200Cia",    Icon: ChatIcon },
    { id: "profile", label: "Profil",  Icon: UserIcon },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(18,8,4,0.82)", borderTop: "1px solid rgba(255,255,255,0.09)",
      display: "flex", zIndex: 100, boxShadow: "0 -4px 32px rgba(0,0,0,.45)",
      backdropFilter: "blur(20px)"
    }}>
      {tabs.map(({ id, label, Icon }) => {
        const active = screen === id;
        return (
          <button key={id} onClick={() => onNavigate(id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 4, padding: "10px 0 12px",
            background: "none", border: "none", cursor: "pointer",
            color: active ? "var(--terra)" : "var(--brown-l)",
            transition: "color .18s", position: "relative"
          }}>
            <Icon s={21} />
            <span style={{ fontSize: 10, fontWeight: active ? 500 : 400, letterSpacing: ".03em", fontVariantLigatures: "none" }}>{label}</span>
            {active && <span style={{ position: "absolute", bottom: 0, width: 24, height: 2, background: "var(--terra)", borderRadius: 2 }} />}
          </button>
        );
      })}
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ profile, onSave, onPremium }) {
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
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ background: "rgba(26,15,10,0.80)", borderBottom: "1px solid rgba(255,255,255,0.10)", padding: "20px 24px", boxShadow: "var(--shadow-s)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--terra)", marginBottom: 4 }}>
          <Leaf s={18} />
          <span className="serif" style={{ fontSize: 15, fontWeight: 600, letterSpacing: ".04em", color: "var(--terra-d)" }}>Parentelïa</span>
        </div>
        <h1 className="serif" style={{ fontSize: 26, fontWeight: 600 }}>Mon profil</h1>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Premium badge */}
        {profile.isPremium ? (
          <div style={{ background: "linear-gradient(135deg,var(--terra),var(--terra-d))", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            <Star s={16} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 500 }}>Abonnement Premium actif</p>
              <p style={{ fontSize: 12, opacity: .85, fontWeight: 300 }}>Mémoire longue · Analyses · Illimité</p>
            </div>
          </div>
        ) : (
          <div onClick={onPremium} style={{ background: "rgba(185,106,75,.10)", border: "1px solid rgba(185,106,75,.28)", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", backdropFilter: "blur(16px)" }}>
            <Star s={16} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--terra-d)" }}>Passer à Premium</p>
              <p style={{ fontSize: 12, color: "var(--brown-m)", fontWeight: 300 }}>12,99€ TTC/mois · Résiliable à tout moment</p>
            </div>
            <span style={{ fontSize: 13, color: "var(--terra)" }}>→</span>
          </div>
        )}

        {/* Identité */}
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "var(--shadow-s)", backdropFilter: "blur(20px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--brown-l)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Identité</p>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "var(--brown-l)", display: "block", marginBottom: 6 }}>Prénom</label>
            <input className="field" value={d.parentName} onChange={e => upd({ parentName: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--brown-l)", display: "block", marginBottom: 8 }}>Tu es…</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ROLES.map(r => (
                <button key={r} className={`chip ${d.parentRole === r ? "on" : ""}`} onClick={() => upd({ parentRole: r })}>{r}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Enfants */}
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "var(--shadow-s)", backdropFilter: "blur(20px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--brown-l)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Mes enfants</p>
          {d.children.map((c, i) => (
            <div key={c.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 14, marginBottom: 10, border: "1px solid rgba(255,255,255,0.09)", position: "relative" }}>
              {d.children.length > 1 && (
                <button onClick={() => upd({ children: d.children.filter((_, idx) => idx !== i) })}
                  style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "var(--brown-l)" }}>
                  <Xmark />
                </button>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <input className="field" placeholder="Prénom" value={c.firstName} onChange={e => updChild(i, "firstName", e.target.value)} style={{ fontSize: 14 }} />
                <input className="field" type="date" value={c.birthDate} onChange={e => updChild(i, "birthDate", e.target.value)} style={{ fontSize: 13 }} />
              </div>
              {c.birthDate && calcAge(c.birthDate) && (
                <p style={{ fontSize: 12, color: "var(--terra)", marginBottom: 8, fontStyle: "italic" }}>{calcAge(c.birthDate)}</p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TEMPS.map(t => (
                  <button key={t} className={`chip ${c.temperament === t ? "on" : ""}`} style={{ fontSize: 11, padding: "5px 11px" }} onClick={() => updChild(i, "temperament", c.temperament === t ? "" : t)}>{t}</button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => upd({ children: [...d.children, newChild()] })}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px dashed rgba(255,255,255,0.18)", borderRadius: 12, padding: "9px 16px", color: "var(--brown-m)", cursor: "pointer", fontSize: 13, width: "100%", justifyContent: "center" }}>
            <Plus /> Ajouter un enfant
          </button>
          {detectMultiple(d.children) && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,var(--terra),var(--terra-d))", borderRadius: 50, padding: "5px 14px", color: "#fff", fontSize: 12, fontWeight: 500, marginTop: 8 }}>
              {detectMultiple(d.children)} détectés automatiquement
            </div>
          )}
        </div>

        {/* Type de naissance */}
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "var(--shadow-s)", backdropFilter: "blur(20px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--brown-l)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Type de naissance</p>
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
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "var(--shadow-s)", backdropFilter: "blur(20px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--brown-l)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Ce qui me touche</p>
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
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "var(--shadow-s)", backdropFilter: "blur(20px)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--brown-l)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Mon contexte</p>
          <textarea className="field" placeholder="ex. Je suis séparée, je gère tout seul…" value={d.freeText} onChange={e => upd({ freeText: e.target.value })} rows={4} style={{ resize: "none", lineHeight: 1.6 }} />
        </div>

        {/* Save */}
        <button className="btn btn-t" onClick={save} style={{ position: "relative" }}>
          {saved ? <><Check s={16} /> Sauvegardé !</> : "Enregistrer les modifications"}
        </button>

        {/* Reset */}
        <button onClick={async () => {
          const isPremium = profile.isPremium || false;
          await S.set("elia_profile", isPremium ? { isPremium: true } : null);
          await S.set("elia_memory", null); await S.set("elia_sessions", null);
          await S.set("elia_tracking", null); await S.set("elia_last_sos", null);
          await S.set("elia_chat_history", null); await S.set("elia_daily", null);
          window.location.reload();
        }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brown-l)", fontSize: 12, textAlign: "center", padding: "8px", fontStyle: "italic" }}>
          Réinitialiser mon profil
        </button>

        <MentionsLegales />
      </div>
    </div>
  );
}

function MentionsLegales() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brown-l)", fontSize: 11, textAlign: "center", width: "100%", textDecoration: "underline" }}>
        Mentions légales
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "16px 18px", marginTop: 8, fontSize: 11, color: "var(--brown-m)", lineHeight: 1.8, border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(16px)" }}>
            <strong style={{ display: "block", marginBottom: 8 }}>Mentions légales — Parentelïa</strong>
            <strong>Éditeur :</strong> [Nom / Raison sociale à renseigner]<br />
            <strong>Siège social :</strong> [Adresse à renseigner]<br />
            <strong>SIRET :</strong> [Numéro à renseigner]<br />
            <strong>Directeur de publication :</strong> [Nom à renseigner]<br /><br />
            <strong>Hébergement :</strong> Railway (Railway Corp, 340 S Lemon Ave #4133, Walnut, CA 91789, USA)<br /><br />
            <strong>Contact :</strong> privacy@parentelia.com<br /><br />
            <strong>Droit de rétractation :</strong> Conformément à l'article L221-18 du Code de la consommation, vous disposez de 14 jours à compter de la souscription pour exercer votre droit de rétractation, sauf si vous avez expressément renoncé à ce droit après début d'exécution du service. Pour exercer ce droit : privacy@parentelia.com<br /><br />
            <strong>Traitement des données :</strong> Les messages sont traités par l'API Anthropic (Claude), entreprise américaine. Ce transfert hors UE est encadré par les clauses contractuelles types de la Commission européenne.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState("loading");
  const [sos, setSos] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    Promise.all([S.get("elia_profile"), S.get("elia_legal")]).then(([p, legal]) => {
      setProfile(p);
      if (!legal) setScreen("legal");
      else setScreen(p?.parentName ? "home" : "onboarding");
    });

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      window.history.replaceState({}, "", window.location.pathname);
      fetch(`/api/verify-session?id=${encodeURIComponent(sessionId)}`)
        .then(r => r.json())
        .then(({ paid }) => {
          if (paid) {
            S.get("elia_profile").then(p => {
              if (p) {
                const updated = { ...p, isPremium: true };
                S.set("elia_profile", updated);
                setProfile(updated);
              }
            });
          }
        })
        .catch(() => {});
    }
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ opacity: [.4, 1, .4] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: "var(--terra)" }}>
          <Leaf s={32} />
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
          <motion.div key="legal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LegalConsent onAccept={async () => {
              await S.set("elia_legal", true);
              const p = await S.get("elia_profile");
              setScreen(p ? "home" : "onboarding");
            }} />
          </motion.div>
        )}
        {screen === "onboarding" && (
          <motion.div key="ob" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Onboarding onDone={handleDone} />
          </motion.div>
        )}
        {screen === "home" && profile && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="has-nav">
            <Home profile={profile} onStart={s => { setSos(s); setScreen("chat"); }} onPremium={() => setShowPremium(true)} />
          </motion.div>
        )}
        {screen === "chat" && profile && (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: "100vh" }}>
            <Chat profile={profile} isSos={sos} onBack={() => setScreen("home")} onPremium={() => setShowPremium(true)} />
          </motion.div>
        )}
        {screen === "profile" && profile && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="has-nav">
            <ProfileScreen profile={profile} onSave={updateProfile} onPremium={() => setShowPremium(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {showNav && <BottomNav screen={screen} onNavigate={handleNavigate} />}

      <AnimatePresence>
        {showPremium && profile && (
          <StripeModal
            profile={profile}
            onClose={() => setShowPremium(false)}
            onSuccess={() => {
              const updated = { ...profile, isPremium: true };
              S.set("elia_profile", updated);
              setProfile(updated);
              setShowPremium(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
    </ErrorBoundary>
  );
}
