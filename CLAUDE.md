# NERA — CLAUDE.md

Application de soutien émotionnel pour parents de jumeaux/multiples. Assistante IA **Elïa** propulsée par Claude (Anthropic).

## Stack

| Couche | Tech |
|---|---|
| Frontend | React 18 + Vite, framer-motion, lucide-react |
| Backend | Node.js Express (server.js) |
| Auth + DB | Supabase (anonymous auth + table `user_data`) |
| Paiement | Stripe (abonnements mensuel/annuel) |
| IA | Claude API — Haiku (free) / Sonnet (premium) |
| Déploiement | Railway |

## Structure

```
src/
  App.jsx               — Monolithique : tous les écrans et composants (~2200 lignes)
  supabase.js           — Client Supabase + singleton session anonyme
  theme/
    ThemeProvider.jsx   — Contexte thème (dark uniquement en pratique)
    ThemeToggle.jsx     — Inutilisé actuellement
  styles/tokens.css     — Design tokens CSS
  theme/tokens.css      — Design tokens (doublon partiel)
  CguScreen.jsx etc.    — Écrans légaux séparés
server.js               — Backend Express : /api/chat, /api/create-checkout-session,
                           /api/verify-session, /api/webhook, /api/consent
eliaPrompt.js           — Prompt système Elïa (~71KB)
```

## Commandes

```bash
npm run dev          # frontend (Vite :5173) + backend (Express :3000) en parallèle
npm run dev:frontend # Vite seul
npm run build        # build prod → dist/
npm start            # Express seul (prod)
```

## Variables d'environnement requises

Voir `.env.example`. Les clés critiques :
- `ANTHROPIC_API_KEY` — API Claude
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — backend
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — frontend (préfixe VITE_ obligatoire)
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_ANNUAL`
- `TOKEN_SECRET` — signe les tokens premium (obligatoire en prod)
- `FRONTEND_URL` — URL publique Railway

## Architecture clé

### Stockage (`S` object dans App.jsx)
Abstraction Supabase + fallback localStorage. Clés : `elia_profile`, `elia_memory`, `elia_sessions`, `elia_tracking`, `elia_last_sos`, `elia_chat_history`, `elia_daily`, `elia_sos_usage`, `elia_premium_token`, `elia_legal`.

### Auth
Session Supabase anonyme créée automatiquement à la première visite (`getOrCreateSession`). Migration localStorage → Supabase au premier login.

### Premium
Token signé HMAC-SHA256 côté serveur (`signToken`/`verifyToken`). Stocké dans Supabase. Expiré à 1 an. **Anti-replay via `usedSessions` Set en mémoire** (reset au redémarrage — bug connu).

### Quotas free
- 10 messages/jour par IP (Map en mémoire serveur — reset au redémarrage)
- 10 messages SOS/24h par IP (idem)
- Cap global : 500 messages/jour pour protéger les coûts API

### Détection de crise
`CRISIS_KEYWORDS` liste dans App.jsx → affiche `CrisisModal` avec numéros d'urgence (15, 3114, 119, 3919).

## Design
- Dark only — fond `#080608`, accent `rgba(201,117,96,x)` (terre cuite/rouille)
- Typographies : Jost (sans-serif) + Cormorant Garamond (serif italique)
- Glassmorphism + animations framer-motion

## Points de vigilance

1. **`usedSessions` Set en mémoire** → vulnérabilité replay token premium après redémarrage serveur
2. **Rate-limiting en mémoire** → inefficace en prod multi-instance ou après restart
3. **Webhook Stripe** → ne persiste rien en DB (juste un console.log)
4. **Race condition** → `init()` et vérification `session_id` Stripe s'exécutent en parallèle dans le même useEffect
5. **App.jsx monolithique** → refactorer en modules si le fichier grossit encore

## Légal / RGPD
- Consentement 4 cases (âge, disclaimer médical, CGU, RGPD)
- Log consentement serveur via `/api/consent` (console.log → Railway logs, non persisté en DB)
- Sous-traitants : Anthropic (SCC), Stripe (SCC), Railway (USA)
- DPA à signer : Supabase ✗, Anthropic ✗, Stripe ✗ (voir CHECKLIST.md)
