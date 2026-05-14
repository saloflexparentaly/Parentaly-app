import "dotenv/config";
import express from "express";
import Stripe from "stripe";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { fileURLToPath } from "url";
import path from "path";
import { ELIA_SYSTEM_PROMPT } from "./eliaPrompt.js";

const app = express();
app.set("trust proxy", 1);

// ─── Token signing ────────────────────────────────────────────────────────────
const TOKEN_SECRET = process.env.TOKEN_SECRET || (() => {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ TOKEN_SECRET manquant en production — arrêt.");
    process.exit(1);
  }
  console.warn("⚠️  TOKEN_SECRET non défini — clé aléatoire temporaire (dev uniquement)");
  return crypto.randomBytes(32).toString("hex");
})();

function signToken(payload) {
  const data = JSON.stringify(payload);
  const sig = crypto.createHmac("sha256", TOKEN_SECRET).update(data).digest("hex");
  return Buffer.from(JSON.stringify({ data, sig })).toString("base64url");
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const { data, sig } = JSON.parse(Buffer.from(token, "base64url").toString());
    const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(data).digest("hex");
    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
    const payload = JSON.parse(data);
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch { return null; }
}

// ─── Replay prevention ────────────────────────────────────────────────────────
const usedSessions = new Set();

// ─── Daily limits (free tier, in-memory par IP) ───────────────────────────────
const FREE_DAILY_LIMIT = 10;
const dailyUsage = new Map();

function getClientId(req) {
  return (req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "unknown");
}

function checkFreeLimit(clientId) {
  const today = new Date().toISOString().slice(0, 10);
  const key = `${clientId}:${today}`;
  const count = dailyUsage.get(key) || 0;
  if (count >= FREE_DAILY_LIMIT) return false;
  dailyUsage.set(key, count + 1);
  // Nettoyage entrées > 2 jours
  if (dailyUsage.size > 50000) {
    const cutoff = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
    for (const k of dailyUsage.keys()) {
      if (k.split(":")[1] < cutoff) dailyUsage.delete(k);
    }
  }
  return true;
}

// ─── Sanitize ─────────────────────────────────────────────────────────────────
const INJECT_RE = /\[INST\]|\[\/INST\]|<\|system\|>|<\|user\|>|<\|assistant\|>|\{\{.*?\}\}/gi;

function sanitize(str, maxLen = 200) {
  if (!str || typeof str !== "string") return "";
  return str.slice(0, maxLen).replace(INJECT_RE, "").replace(/\n{4,}/g, "\n\n").trim();
}

// ─── Helpers prompt ───────────────────────────────────────────────────────────
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
  } catch { return null; }
}

function detectMultiple(children) {
  const dated = (children || []).filter(c => c.birthDate && c.firstName);
  if (dated.length < 2) return null;
  const ms = dated.map(c => new Date(c.birthDate).getTime()).filter(n => !isNaN(n));
  const groups = new Set();
  for (let i = 0; i < ms.length; i++) {
    for (let j = i + 1; j < ms.length; j++) {
      if (Math.abs(ms[i] - ms[j]) / 86400000 <= 90) { groups.add(i); groups.add(j); }
    }
  }
  if (groups.size >= 3) return "Triplés";
  if (groups.size === 2) return "Jumeaux";
  return null;
}

function buildSystemPrompt(profile, isSos, memory, isPremium) {
  const parentName = sanitize(profile.parentName, 50);
  const parentRole = sanitize(profile.parentRole, 30);
  const freeText   = sanitize(profile.freeText, 400);

  const children = (profile.children || [])
    .slice(0, 15)
    .filter(c => c.firstName)
    .map(c => {
      const name   = sanitize(c.firstName, 30);
      const age    = calcAge(c.birthDate) || "âge non précisé";
      const temp   = sanitize(c.temperament, 50);
      const notes  = sanitize(c.notes, 100);
      const extras = [temp, notes].filter(Boolean).join(", ");
      return `${name} (${age}${extras ? ", " + extras : ""})`;
    }).join(", ") || "non renseigné";

  const multipleLabel = detectMultiple(profile.children);
  const birthTypes = (profile.birthTypes || []).slice(0, 10).map(t => sanitize(t, 30)).filter(Boolean);
  const birthCtx   = birthTypes.length ? `Naissance : ${birthTypes.join(", ")}.` : "";
  const challenges = (profile.challenges || []).slice(0, 15).map(c => sanitize(c, 50)).filter(Boolean);

  const memLimit = isPremium ? 20 : 3;
  const memBlock = (memory || []).length
    ? "\nMÉMOIRE LONGUE :\n" + memory.slice(-memLimit).map(m => "- " + sanitize(m, 120)).join("\n")
    : "";

  const tierBlock = isPremium
    ? `NIVEAU : Premium — mémoire longue active, analyse des patterns sur la durée, 2-3 pistes concrètes + question d'approfondissement.`
    : `NIVEAU : Gratuit — réponses courtes et bienveillantes (4-6 phrases max), validation émotionnelle prioritaire, 1 piste maximum.`;

  const sosBlock = isSos
    ? `\nMODE SOS ACTIF — présence resserrée, 2-4 phrases max, aucune mention du premium.`
    : "";

  const profileBlock = `
━━━ PROFIL FAMILLE ━━━
Parent : ${parentName || "non renseigné"}${parentRole ? ` (${parentRole})` : ""}
Enfants : ${children}${multipleLabel ? ` — ${multipleLabel}` : ""}
${birthCtx}${challenges.length ? `\nDéfis déclarés : ${challenges.join(", ")}.` : ""}${freeText ? `\nContexte personnel : ${freeText}` : ""}
${memBlock}
${tierBlock}${sosBlock}`;

  return ELIA_SYSTEM_PROMPT + profileBlock;
}

// ─── Sécurité headers ────────────────────────────────────────────────────────
app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:    ["'self'", "https://fonts.gstatic.com"],
      scriptSrc:  ["'self'"],
      connectSrc: ["'self'"],
      imgSrc:     ["'self'", "data:"],
      frameSrc:   ["https://js.stripe.com"],
    }
  }
}));

const ALLOWED_ORIGINS = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({ origin: ALLOWED_ORIGINS, methods: ["GET", "POST"] }));

// ─── Rate limiting ────────────────────────────────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Trop de requêtes. Merci de patienter." },
  standardHeaders: true,
  legacyHeaders: false,
});
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Trop de tentatives. Merci de patienter." },
});
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Trop de tentatives." },
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── Webhook Stripe (body brut requis) ───────────────────────────────────────
app.post("/api/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    console.log("✅ Paiement confirmé :", event.data.object.customer_email);
  }
  res.json({ received: true });
});

app.use(express.json({ limit: "50kb" }));

// ─── Log consentement RGPD (preuve serveur, art. 7 RGPD) ─────────────────────
app.post("/api/consent", (req, res) => {
  const ip      = getClientId(req);
  const ts      = new Date().toISOString();
  const version = typeof req.body?.version === "string" ? req.body.version.slice(0, 20) : "1.0";
  const ua      = (req.headers["user-agent"] || "").slice(0, 200);
  console.log(JSON.stringify({ event: "consent_accepted", ip, ts, cgu_version: version, ua }));
  res.json({ ok: true });
});

// ─── Chat API ─────────────────────────────────────────────────────────────────
app.post("/api/chat", chatLimiter, async (req, res) => {
  const { profile, messages, isSos, memory, premiumToken } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages invalides." });
  }
  if (messages.length > 60) {
    return res.status(400).json({ error: "Trop de messages." });
  }
  for (const m of messages) {
    if (!["user", "assistant"].includes(m?.role)) {
      return res.status(400).json({ error: "Format message invalide." });
    }
    if (typeof m.content !== "string" || m.content.length > 4000) {
      return res.status(400).json({ error: "Message trop long." });
    }
  }

  // Vérification premium côté serveur — le client ne peut pas falsifier ceci
  const tokenPayload = verifyToken(premiumToken);
  const isPremium    = tokenPayload?.premium === true;

  // Limite journalière pour les utilisateurs gratuits
  if (!isPremium) {
    const clientId = getClientId(req);
    if (!checkFreeLimit(clientId)) {
      return res.status(429).json({ error: "Limite journalière atteinte.", dailyLimit: true });
    }
  }

  // Prompt construit côté serveur — le client ne peut pas l'injecter
  const system     = buildSystemPrompt(profile || {}, Boolean(isSos), Array.isArray(memory) ? memory.slice(0, 100) : [], isPremium);
  const model      = isPremium ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001";
  const max_tokens = isPremium ? 1200 : 600;
  const msgLimit   = isPremium ? messages.length : Math.min(messages.length, 10);

  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":          process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model, max_tokens, system,
        messages: messages.slice(-msgLimit).map(m => ({
          role:    m.role,
          content: String(m.content).slice(0, 4000),
        })),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await response.json();
    if (data.error) return res.status(400).json(data);
    res.json(data);
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") return res.status(504).json({ error: "Délai dépassé. Réessaie." });
    console.error("Anthropic error:", err.message);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// ─── Stripe Checkout ──────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

app.post("/api/create-checkout-session", checkoutLimiter, async (req, res) => {
  const { priceId, email, parentName } = req.body;

  if (!priceId || !email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Données invalides." });
  }

  const allowedPrices = [
    process.env.STRIPE_PRICE_MONTHLY,
    process.env.STRIPE_PRICE_ANNUAL,
    "price_1TOHRf9TErY2lFQDoObZAF6t",
    "price_1TOHS59TErY2lFQDZz2AterS",
  ].filter(Boolean);

  if (!allowedPrices.includes(priceId)) {
    return res.status(400).json({ error: "Offre invalide." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode:                 "subscription",
      payment_method_types: ["card"],
      customer_email:        email.slice(0, 254),
      line_items:           [{ price: priceId, quantity: 1 }],
      success_url:          `${process.env.FRONTEND_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:           `${process.env.FRONTEND_URL}?canceled=1`,
      metadata:             { parentName: sanitize(parentName, 100) },
      locale:               "fr",
      subscription_data:    { metadata: { parentName: sanitize(parentName, 100) } },
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "Erreur paiement." });
  }
});

// ─── Vérification session Stripe → retourne token signé ──────────────────────
app.get("/api/verify-session", verifyLimiter, async (req, res) => {
  const { id } = req.query;
  if (!id || typeof id !== "string" || !id.startsWith("cs_")) {
    return res.status(400).json({ paid: false });
  }
  // Anti-replay : une session ne peut activer premium qu'une seule fois
  if (usedSessions.has(id)) {
    return res.status(400).json({ paid: false });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    if (session.payment_status !== "paid") return res.json({ paid: false });
    usedSessions.add(id);
    const token = signToken({ premium: true, exp: Date.now() + 366 * 24 * 60 * 60 * 1000 });
    res.json({ paid: true, token });
  } catch {
    res.status(400).json({ paid: false });
  }
});

// ─── Serve React build ────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌿 Parentelïa server on port ${PORT}`));
