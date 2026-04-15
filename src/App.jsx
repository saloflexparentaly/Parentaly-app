import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream: #F9F5EF;
      --cream-2: #F2EBE0;
      --petal: #EDD5C5;
      --terra: #B96A4B;
      --terra-l: #CC8068;
      --terra-d: #9A4F32;
      --sage: #7A9178;
      --sage-l: #A8BDA6;
      --brown: #2E1F16;
      --brown-m: #6B4E3D;
      --brown-l: #9B7B6A;
      --rose: #E8CABB;
      --rose-d: #D4AE9B;
      --white: #FFFDFB;
      --shadow-s: 0 2px 12px rgba(46,31,22,0.07);
      --shadow-m: 0 6px 32px rgba(46,31,22,0.10);
      --shadow-l: 0 16px 64px rgba(46,31,22,0.13);
    }

    html, body, #root {
      height: 100%;
      font-family: 'Jost', system-ui, sans-serif;
      background: var(--cream);
      color: var(--brown);
      -webkit-font-smoothing: antialiased;
    }

    .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
    input, textarea, button { font-family: 'Jost', system-ui, sans-serif; }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--petal); border-radius: 2px; }

    .field {
      width: 100%; padding: 14px 18px; border-radius: 14px;
      border: 1.5px solid var(--petal); background: var(--white);
      color: var(--brown); font-size: 15px; font-weight: 300; outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .field:focus { border-color: var(--terra-l); box-shadow: 0 0 0 3px rgba(185,106,75,.10); }
    .field::placeholder { color: var(--brown-l); font-style: italic; }

    .chip {
      padding: 9px 18px; border-radius: 50px;
      border: 1.5px solid var(--petal); background: var(--white);
      color: var(--brown-m); font-size: 13px; cursor: pointer;
      transition: all .18s; white-space: nowrap;
    }
    .chip:hover { border-color: var(--terra-l); color: var(--terra); }
    .chip.on { background: var(--terra); border-color: var(--terra); color: #fff; }

    .btn {
      width: 100%; padding: 15px 24px; border-radius: 14px;
      font-size: 16px; font-weight: 500; cursor: pointer; border: none;
      transition: all .18s; display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-t { background: linear-gradient(135deg, var(--terra), var(--terra-d)); color: #fff; box-shadow: 0 4px 20px rgba(185,106,75,.35); }
    .btn-t:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(185,106,75,.45); }
    .btn-t:disabled { opacity: .5; cursor: default; transform: none; }
    .btn-g {
      background: transparent; color: var(--terra-d);
      border: 1.5px solid var(--rose-d);
      font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 17px;
    }
    .btn-g:hover { background: rgba(185,106,75,.05); border-color: var(--terra-l); }

    .bubble-u {
      background: linear-gradient(135deg,var(--terra),var(--terra-d));
      color: #fff; border-radius: 18px 18px 4px 18px;
      box-shadow: 0 3px 14px rgba(185,106,75,.25);
    }
    .bubble-a {
      background: var(--white); color: var(--brown);
      border-radius: 18px 18px 18px 4px;
      border: 1px solid var(--petal); box-shadow: var(--shadow-s);
    }

    .dots span {
      display: inline-block; width: 6px; height: 6px; border-radius: 50%;
      background: var(--terra-l); margin: 0 2px;
      animation: bounce 1.2s ease-in-out infinite;
    }
    .dots span:nth-child(2) { animation-delay: .2s; }
    .dots span:nth-child(3) { animation-delay: .4s; }
    @keyframes bounce {
      0%,60%,100% { transform: translateY(0); opacity: .4; }
      30% { transform: translateY(-6px); opacity: 1; }
    }

    .sos-ring { animation: sosR 2s ease-in-out infinite; }
    @keyframes sosR {
      0%,100% { box-shadow: 0 0 0 0 rgba(185,106,75,.3); }
      50% { box-shadow: 0 0 0 10px rgba(185,106,75,0); }
    }

    .step-bar { display: flex; gap: 5px; justify-content: center; margin-bottom: 36px; }
    .step-bar span { height: 3px; border-radius: 3px; background: var(--petal); transition: all .35s; }
    .step-bar span.on { background: var(--terra); }

    .av {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg,var(--terra-l),var(--sage));
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond',serif; font-size: 16px; color: #fff;
      flex-shrink: 0; box-shadow: 0 2px 10px rgba(185,106,75,.25);
    }

    /* Stripe modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(46,31,22,.45);
      backdrop-filter: blur(4px); z-index: 1000;
      display: flex; align-items: center; justify-content: center; padding: 24px;
    }
    .modal-box {
      background: var(--white); border-radius: 28px; padding: 40px 36px;
      max-width: 400px; width: 100%; box-shadow: var(--shadow-l);
      border: 1px solid var(--petal);
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

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const S = {
  async get(k) {
    try {
      const r = await window.storage.get(k);
      return r ? JSON.parse(r.value) : null;
    } catch {
      return null;
    }
  },
  async set(k, v) {
    try {
      await window.storage.set(k, JSON.stringify(v));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }
};

// ─── STRIPE MODAL ─────────────────────────────────────────────────────────────
// Price IDs from your Stripe account
const STRIPE_PRICES = {
  monthly: "price_1TMS5X9TErY2lFQD4MWT6mhu",
  annual:  "price_1TMS5X9TErY2lFQD6o86f0Tb",
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
            <Star s={12} /> Parentaly Premium
          </div>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Accompagnement complet</h2>
          <p style={{ color: "var(--brown-m)", fontSize: 14, fontWeight: 300, lineHeight: 1.5 }}>
            Mémoire longue, analyses hebdomadaires, accès illimité à Elïa.
          </p>
        </div>

        {/* Features */}
        <div style={{ background: "var(--cream)", borderRadius: 16, padding: "16px 18px", marginBottom: 24 }}>
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
            { key: "monthly", label: "Mensuel", price: "9,99€/mois", sub: "" },
            { key: "annual",  label: "Annuel",  price: "7,99€/mois", sub: "2 mois offerts" },
          ].map(p => (
            <button key={p.key} onClick={() => setSelected(p.key)}
              style={{
                padding: "14px 12px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                border: selected === p.key ? "2px solid var(--terra)" : "1.5px solid var(--petal)",
                background: selected === p.key ? "rgba(185,106,75,.07)" : "var(--white)",
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
          {loading ? "Chargement…" : "Commencer · Paiement sécurisé 🔒"}
        </button>
        <p style={{ fontSize: 11, color: "var(--brown-l)", textAlign: "center", marginTop: 10, fontStyle: "italic" }}>
          Résiliable à tout moment · Paiement via Stripe
        </p>
      </motion.div>
    </div>
  );
}

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function askElia({ profile, messages, isSos, memory }) {
  const children = profile.children
    .filter(c => c.firstName)
    .map(c =>
      `${c.firstName} (${c.age || "âge non précisé"}${c.temperament ? ", " + c.temperament : ""}${c.notes ? ", " + c.notes : ""})`
    ).join(", ") || "non renseigné";

  const memBlock = memory?.length
    ? "\n\nMÉMOIRE (échanges récents) :\n" + memory.slice(-5).map(m => "- " + m).join("\n")
    : "";

  const system = `Tu es Elïa, une assistante parentale émotionnelle et bienveillante.
Tu accompagnes ${profile.parentName} (${profile.parentRole}).
Enfants : ${children}.
${profile.challenges?.length ? "Défis déclarés : " + profile.challenges.join(", ") + "." : ""}
${profile.freeText ? "Contexte personnel : " + profile.freeText : ""}
${memBlock}

MISSION :
- Écouter profondément, valider les émotions AVANT de conseiller
- Reformuler avec douceur pour montrer que tu as compris
- Donner 1 à 3 pistes maximum, jamais une liste froide
- Ton : chaleureux, humain, jamais jugeant, jamais culpabilisant
- Phrases naturelles et fluides, comme une amie bienveillante et experte
- 1 emoji maximum par réponse
- Jamais de diagnostic médical ; si préoccupant → rediriger doucement vers un professionnel
${isSos ? `
MODE SOS — PRIORITÉ ABSOLUE :
- Réponse très courte (3-5 phrases max)
- Présence émotionnelle avant tout, pas de conseils lourds
- Propose une technique de respiration simple si pertinent
- Maximum 1 question ouverte douce` : ""}

STRUCTURE :
1. Validation émotionnelle
2. Reformulation / compréhension
3. Apport concret (si approprié)
4. Question douce d'ouverture (facultative)

Si tu te souviens d'un échange : utilise "Tu me parlais de…" naturellement.`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
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
    const mo = (now.getFullYear() - b.getFullYear()) * 12 + now.getMonth() - b.getMonth();
    if (mo < 0) return null;
    if (mo < 1) return "Nouveau-né";
    if (mo < 12) return mo + " mois";
    const y = Math.floor(mo / 12), m = mo % 12;
    return m > 0 ? y + " ans " + m + " mois" : y + " ans";
  } catch {
    return null;
  }
}
const newChild = () => ({ id: Date.now().toString(), firstName: "", birthDate: "", temperament: "", notes: "" });

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const ROLES = ["Maman", "Papa", "Co-parent", "Autre"];
const TEMPS = ["Calme & facile", "Actif & énergique", "Sensible & émotif", "Curieux & éveillé", "Timide & réservé"];
const CHALS = ["Sommeil difficile", "Pleurs & coliques", "Alimentation", "Gestion des émotions", "Fatigue & épuisement", "Anxiété parentale", "Fratrie & jalousie", "Développement", "Solitude & isolement"];

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const STEPS = 4;
  const [d, setD] = useState({
    parentName: "", parentRole: "Maman",
    children: [newChild()],
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
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
        style={{ background: "var(--white)", borderRadius: 32, padding: "44px 40px", maxWidth: 440, width: "100%", boxShadow: "var(--shadow-l)", border: "1px solid var(--petal)" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--terra)" }}>
            <Leaf s={22} />
            <span className="serif" style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--terra-d)" }}>Parentaly</span>
          </div>
        </div>

        <div className="step-bar">
          {Array.from({ length: STEPS }).map((_, i) => (
            <span key={i} className={i <= step ? "on" : ""} style={{ width: i === step ? 28 : 8 }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
              <h2 className="serif" style={{ fontSize: 30, fontWeight: 600, marginBottom: 6 }}>Bienvenue 🌸</h2>
              <p style={{ color: "var(--brown-m)", fontSize: 14, marginBottom: 28, fontWeight: 300 }}>Je suis Elïa. Dis-moi comment t'appeler.</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--brown-l)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 8 }}>Ton prénom</label>
                <input className="field" placeholder="ex. Sophie…" value={d.parentName} onChange={e => upd({ parentName: e.target.value })} />
              </div>
              <div style={{ marginBottom: 32 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--brown-l)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 10 }}>Tu es…</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {ROLES.map(r => (
                    <button key={r} className={`chip ${d.parentRole === r ? "on" : ""}`} onClick={() => upd({ parentRole: r })}>{r}</button>
                  ))}
                </div>
              </div>
              <button className="btn btn-t" onClick={() => setStep(1)} disabled={!d.parentName.trim()}>Continuer →</button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
              <h2 className="serif" style={{ fontSize: 30, fontWeight: 600, marginBottom: 6 }}>Tes enfants 💛</h2>
              <p style={{ color: "var(--brown-m)", fontSize: 14, marginBottom: 24, fontWeight: 300 }}>Pour t'accompagner au mieux, parle-moi d'eux.</p>
              <div style={{ maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                {d.children.map((c, i) => (
                  <div key={c.id} style={{ background: "var(--cream)", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid var(--petal)", position: "relative" }}>
                    {d.children.length > 1 && (
                      <button
                        onClick={() => upd({ children: d.children.filter((_, idx) => idx !== i) })}
                        style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "var(--brown-l)" }}>
                        <Xmark />
                      </button>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                      <input className="field" placeholder="Prénom" value={c.firstName} onChange={e => updChild(i, "firstName", e.target.value)} style={{ fontSize: 14 }} />
                      <input className="field" type="date" value={c.birthDate} onChange={e => updChild(i, "birthDate", e.target.value)} style={{ fontSize: 13 }} />
                    </div>
                    {c.birthDate && calcAge(c.birthDate) && (
                      <p style={{ fontSize: 12, color: "var(--terra)", marginBottom: 8, fontStyle: "italic" }}>🌿 {calcAge(c.birthDate)}</p>
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
              <button
                onClick={() => upd({ children: [...d.children, newChild()] })}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1.5px dashed var(--rose-d)", borderRadius: 12, padding: "9px 16px", color: "var(--brown-m)", cursor: "pointer", fontSize: 13, marginBottom: 22, marginTop: 8, width: "100%", justifyContent: "center" }}>
                <Plus /> Ajouter un enfant
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-g" onClick={() => setStep(0)} style={{ width: "auto", padding: "14px 18px" }}><Back /></button>
                <button className="btn btn-t" onClick={() => setStep(2)}>Continuer →</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
              <h2 className="serif" style={{ fontSize: 30, fontWeight: 600, marginBottom: 6 }}>Ce qui te pèse 🌿</h2>
              <p style={{ color: "var(--brown-m)", fontSize: 14, marginBottom: 24, fontWeight: 300 }}>Sélectionne ce qui te touche en ce moment.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                {CHALS.map(c => (
                  <button key={c}
                    className={`chip ${d.challenges.includes(c) ? "on" : ""}`}
                    onClick={() => upd({ challenges: d.challenges.includes(c) ? d.challenges.filter(x => x !== c) : [...d.challenges, c] })}>
                    {c}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-g" onClick={() => setStep(1)} style={{ width: "auto", padding: "14px 18px" }}><Back /></button>
                <button className="btn btn-t" onClick={() => setStep(3)}>Continuer →</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
              <h2 className="serif" style={{ fontSize: 30, fontWeight: 600, marginBottom: 6 }}>En quelques mots… 🤍</h2>
              <p style={{ color: "var(--brown-m)", fontSize: 14, marginBottom: 24, fontWeight: 300 }}>Y a-t-il quelque chose d'important à savoir ? Facultatif.</p>
              <textarea
                className="field"
                placeholder="ex. Je suis séparée, je gère tout seul, ma fille a été hospitalisée récemment…"
                value={d.freeText}
                onChange={e => upd({ freeText: e.target.value })}
                rows={5}
                style={{ resize: "none", lineHeight: 1.6 }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button className="btn btn-g" onClick={() => setStep(2)} style={{ width: "auto", padding: "14px 18px" }}><Back /></button>
                <button className="btn btn-t" onClick={finish}>Commencer avec Elïa 🌿</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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

function Home({ profile, onStart, onPremium }) {
  const hour = new Date().getHours();
  const greet = hour < 18 ? "Bonjour" : "Bonsoir";
  const tip = TIPS[new Date().getDate() % TIPS.length];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} style={{ maxWidth: 420, width: "100%" }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--terra)", marginBottom: 22 }}>
            <Leaf s={24} />
            <span className="serif" style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--terra-d)" }}>Parentaly</span>
          </div>
          <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.2, marginBottom: 10 }}>
            {greet},<br /><em>{profile.parentName}</em> 🌸
          </h1>
          <p style={{ color: "var(--brown-m)", fontSize: 14, fontWeight: 300 }}>Comment te sens-tu aujourd'hui ?</p>
        </div>

        {/* Tip du jour */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
          style={{ background: "var(--white)", borderRadius: 20, padding: "20px 24px", marginBottom: 16, border: "1px solid var(--petal)", boxShadow: "var(--shadow-s)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--sage)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>🌿 Pour toi aujourd'hui</p>
          <p className="serif" style={{ fontSize: 18, fontStyle: "italic", color: "var(--brown-m)", lineHeight: 1.5 }}>"{tip}"</p>
        </motion.div>

        {/* Enfants */}
        {profile.children.filter(c => c.firstName).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
            style={{ background: "var(--white)", borderRadius: 20, padding: "14px 18px", marginBottom: 16, border: "1px solid var(--petal)", display: "flex", gap: 8, flexWrap: "wrap", boxShadow: "var(--shadow-s)" }}>
            {profile.children.filter(c => c.firstName).map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--cream)", borderRadius: 50, padding: "5px 13px" }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{c.firstName}</span>
                {c.age && <span style={{ fontSize: 11, color: "var(--brown-l)", fontStyle: "italic" }}>{c.age}</span>}
              </div>
            ))}
          </motion.div>
        )}

        {/* Premium banner si pas premium */}
        {!profile.isPremium && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35 }}
            onClick={onPremium}
            style={{ background: "linear-gradient(135deg,rgba(185,106,75,.08),rgba(122,145,120,.08))", border: "1.5px solid var(--rose-d)", borderRadius: 16, padding: "14px 18px", marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
            <Star s={16} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--terra-d)", marginBottom: 2 }}>Passer à Premium</p>
              <p style={{ fontSize: 12, color: "var(--brown-m)", fontWeight: 300 }}>Mémoire longue · Analyses · Illimité</p>
            </div>
            <span style={{ fontSize: 13, color: "var(--terra)", fontWeight: 500 }}>9,99€/mois →</span>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="btn btn-t" onClick={() => onStart(false)}>Parler avec Elïa →</button>
          <button className="btn btn-g sos-ring" onClick={() => onStart(true)}>J'ai besoin d'aide là · SOS</button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
const SOS_SHORTS = ["Je suis épuisée(é)", "Mon enfant ne dort pas", "Je me sens seul(e)", "J'ai besoin de souffler"];
const FREE_MSG_LIMIT = 6;

function Chat({ profile, isSos, onBack, onPremium }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memory, setMemory] = useState([]);
  const [nudge, setNudge] = useState(false);
  const bottomRef = useRef(null);
  const taRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const mem = await S.get("elia_memory") || [];
      const cnt = await S.get("elia_sessions") || 0;
      setMemory(mem);
      await S.set("elia_sessions", cnt + 1);

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

    // Freemium gate
    if (!profile.isPremium && userMsgCount >= FREE_MSG_LIMIT) {
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
      setMsgs(prev => [...prev, am]);

      const entry = `${new Date().toLocaleDateString("fr-FR")} : "${txt.slice(0, 80)}"`;
      setMemory(prev => {
        const nm = [...prev.slice(-9), entry];
        S.set("elia_memory", nm);
        return nm;
      });

      // Show nudge after 4th user message for free users
      if (!profile.isPremium && userMsgCount + 1 >= 4) {
        setTimeout(() => setNudge(true), 800);
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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--cream)" }}>

      {/* Header */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--petal)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "var(--shadow-s)", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brown-m)", display: "flex", padding: 4 }}><Back s={19} /></button>
        <div className="av">E</div>
        <div>
          <div className="serif" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.1 }}>Elïa</div>
          <div style={{ fontSize: 11, color: isSos ? "var(--terra)" : "var(--sage)", fontStyle: "italic" }}>
            {isSos ? "🔴 Mode SOS" : "Assistante parentale"}
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
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ maxWidth: 640, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Nudge premium */}
          <AnimatePresence>
            {nudge && !profile.isPremium && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: "linear-gradient(135deg,rgba(185,106,75,.07),rgba(122,145,120,.07))", border: "1.5px dashed var(--rose-d)", borderRadius: 18, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Star s={15} />
                  <div>
                    <p className="serif" style={{ fontSize: 15, fontStyle: "italic", marginBottom: 6 }}>Je commence à percevoir des tendances dans ce que tu vis…</p>
                    <p style={{ fontSize: 13, color: "var(--brown-m)", lineHeight: 1.55, marginBottom: 12, fontWeight: 300 }}>
                      Mes analyses approfondies, ma mémoire longue et tes rapports personnalisés sont dans la version complète.
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={onPremium}
                        style={{ background: "var(--terra)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                        Découvrir · 9,99€/mois
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
      <div style={{ background: "var(--white)", borderTop: "1px solid var(--petal)", padding: "14px 16px", flexShrink: 0 }}>
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
              background: input.trim() && !loading ? "linear-gradient(135deg,var(--terra),var(--terra-d))" : "var(--petal)",
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
          Elïa ne remplace pas un professionnel de santé
        </p>
      </div>
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
    S.get("elia_profile").then(p => {
      setProfile(p);
      setScreen(p ? "home" : "onboarding");
    });

    // Handle Stripe return
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      S.get("elia_profile").then(p => {
        if (p) {
          const updated = { ...p, isPremium: true };
          S.set("elia_profile", updated);
          setProfile(updated);
        }
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleDone = async p => {
    await S.set("elia_profile", p);
    setProfile(p);
    setScreen("home");
  };

  const handleStart = s => { setSos(s); setScreen("chat"); };

  if (screen === "loading") return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ opacity: [.4, 1, .4] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: "var(--terra)" }}>
          <Leaf s={32} />
        </motion.div>
      </div>
    </>
  );

  return (
    <>
      <GlobalStyles />

      <AnimatePresence mode="wait">
        {screen === "onboarding" && (
          <motion.div key="ob" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Onboarding onDone={handleDone} />
          </motion.div>
        )}
        {screen === "home" && profile && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Home profile={profile} onStart={handleStart} onPremium={() => setShowPremium(true)} />
          </motion.div>
        )}
        {screen === "chat" && profile && (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: "100vh" }}>
            <Chat profile={profile} isSos={sos} onBack={() => setScreen("home")} onPremium={() => setShowPremium(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stripe Premium Modal */}
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
  );
}
