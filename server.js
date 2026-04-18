import "dotenv/config";
import express from "express";
import Stripe from "stripe";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import path from "path";

const app = express();

// ─── Sécurité headers ────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      frameSrc: ["https://js.stripe.com"],
    }
  }
}));
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));

// ─── Rate limiting ────────────────────────────────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 20,                    // 20 requêtes/min par IP
  message: { error: "Trop de requêtes. Merci de patienter." },
  standardHeaders: true,
  legacyHeaders: false,
});

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,
  message: { error: "Trop de tentatives. Merci de patienter." },
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

// ─── Chat API ─────────────────────────────────────────────────────────────────
app.post("/api/chat", chatLimiter, async (req, res) => {
  const { model, max_tokens, system, messages } = req.body;

  // Validation basique
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages invalides." });
  }
  if (!max_tokens || typeof max_tokens !== "number" || max_tokens > 1500) {
    return res.status(400).json({ error: "max_tokens invalide." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({ model, max_tokens, system, messages })
    });
    const data = await response.json();
    if (data.error) return res.status(400).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// ─── Stripe Checkout ──────────────────────────────────────────────────────────
app.post("/api/create-checkout-session", checkoutLimiter, async (req, res) => {
  const { priceId, email, parentName, successUrl, cancelUrl } = req.body;

  if (!priceId || !email || !email.includes("@")) {
    return res.status(400).json({ error: "Données invalides." });
  }

  const allowedPrices = [
    process.env.STRIPE_PRICE_MONTHLY,
    process.env.STRIPE_PRICE_ANNUAL,
    "price_1TNFXv9TErY2lFQDN082ETex",
    "price_1TNFXv9TErY2lFQDVoQGb1li",
  ].filter(Boolean);

  if (!allowedPrices.includes(priceId)) {
    return res.status(400).json({ error: "Offre invalide." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}?canceled=1`,
      metadata: { parentName: (parentName || "").slice(0, 100) },
      locale: "fr",
      subscription_data: { metadata: { parentName: (parentName || "").slice(0, 100) } }
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "Erreur paiement." });
  }
});

// ─── Vérification session Stripe ─────────────────────────────────────────────
app.get("/api/verify-session", async (req, res) => {
  const { id } = req.query;
  if (!id || typeof id !== "string" || !id.startsWith("cs_")) {
    return res.status(400).json({ paid: false });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    res.json({ paid: session.payment_status === "paid" });
  } catch {
    res.status(400).json({ paid: false });
  }
});

// ─── Serve React build ────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌿 Parentelïa server running on port ${PORT}`));
