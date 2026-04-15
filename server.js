// server.js — Backend Parentaly (Node.js + Express + Stripe)
// Déploie sur Railway, Render, ou Vercel Functions

import express from "express";
import Stripe from "stripe";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // clé secrète dans les variables d'env

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// ─── Serve React build (si même serveur) ────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "dist")));

// ─── Créer une session Stripe Checkout ──────────────────────────────────────
app.post("/api/create-checkout-session", async (req, res) => {
  const { priceId, email, parentName, successUrl, cancelUrl } = req.body;

  if (!priceId || !email) {
    return res.status(400).json({ error: "priceId et email sont requis" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${process.env.FRONTEND_URL}?success=1`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}?canceled=1`,
      metadata: { parentName: parentName || "" },
      locale: "fr",
      subscription_data: {
        metadata: { parentName: parentName || "" }
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Webhook Stripe (pour confirmer paiements) ──────────────────────────────
app.post("/api/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Paiement confirmé :", session.customer_email);
    // Ici tu peux mettre à jour une DB, envoyer un email, etc.
  }

  res.json({ received: true });
});

// ─── Catch-all → React app ───────────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌿 Parentaly server running on port ${PORT}`));
