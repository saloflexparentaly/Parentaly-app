# Checklist de lancement — NERA V2

> **Dernière mise à jour** : Mai 2026
> **Règle absolue** : tous les critères à "oui" = tu lances. Pas de "presque oui".

---

## 🚥 PHASE 0 — BLOQUANT AVANT TOUT LANCEMENT

> Tant que cette phase n'est pas finie, tu ne peux pas avoir de premier utilisateur réel.

### 0.1 · Identité & Marque

- [ ] Finaliser le nom de la marque
- [ ] Déposer le nom à l'INPI (~225€, 10 ans, classes 9 + 41 + 44)
- [ ] Vérifier la disponibilité du nom (INPI, Google, App Store, Google Play)
- [ ] Réserver les noms de domaine (.fr, .com, .app)
- [ ] Réserver les handles réseaux sociaux (Insta, TikTok, Pinterest, Facebook)

### 0.2 · Statut juridique

- [ ] Confirmer que la micro-entreprise est suffisante pour le lancement (oui pour démarrer, à reconsidérer si CA > 77 700€/an)
- [ ] Ouvrir un compte bancaire pro dédié (Shine, Qonto, Bunq…)
- [ ] Vérifier ton code APE/NAF (probablement 6201Z ou 6312Z)

### 0.3 · Documents légaux

- [x] CGU (Conditions Générales d'Utilisation)
- [x] CGV (Conditions Générales de Vente)
- [x] Politique de Confidentialité / RGPD
- [x] Mentions Légales
- [x] Disclaimer non-médical (case à cocher à l'inscription)
- [ ] Politique cookies (si tracking, même léger)
- [ ] ⚠️ Faire relire par un avocat IT/RGPD avant lancement (200–500€) — fortement recommandé sur santé mentale périnatale

### 0.4 · Conformité technique RGPD

- [ ] Créer projet Supabase région Frankfurt (impossible de migrer après)
- [ ] Signer le DPA Supabase (Data Processing Agreement) dans les paramètres
- [ ] Signer le DPA Anthropic (API Claude)
- [ ] Signer le DPA Stripe
- [ ] Configurer Row-Level Security sur toutes les tables Supabase
- [ ] Mettre en place le chiffrement au repos des conversations sensibles
- [ ] Mettre en place les logs d'accès (qui accède à quoi, quand)
- [ ] Décider la politique de rétention des données (suggestion : conversations 12 mois, profil tant que compte actif, suppression 30j après désinscription)
- [ ] Procédure d'export et suppression des données utilisateur (droit RGPD)
- [ ] Procédure de notification de violation (72h pour notifier la CNIL en cas de breach)

### 0.5 · Stripe

- [ ] Vérifier que le compte Stripe est en mode live (pas test)
- [ ] Créer le produit "NERA Premium" dans Stripe
- [ ] Créer les 2 prix grand public : 12,99€/mois + 89€/an
- [ ] Créer les 2 prix fondateur : 9,99€/mois + 79€/an
- [ ] Configurer le trial de 7 jours sur les abonnements
- [ ] Activer le Customer Portal Stripe (pour résiliation auto)
- [ ] Récupérer les price_ids et les intégrer au code
- [ ] Récupérer la clé publique Stripe depuis tes records sécurisés
- [ ] Configurer les webhooks (subscription created, cancelled, payment failed)
- [ ] Activer Stripe Tax ou prévoir la gestion TVA manuellement

### 0.6 · Modération & Sécurité humaine

- [ ] Mettre en place le monitoring mots-clés critiques (suicide, violence, meurtre…)
- [ ] Configurer alerte mail à toi dès qu'un mot-clé déclenche
- [ ] Définir un protocole humain de réponse (que faire si tu vois une alerte ?)
- [ ] Créer une procédure d'escalade vers les autorités si nécessaire
- [ ] Documenter cette procédure

---

## 🧪 PHASE 1 — AVANT BETA FERMÉE

### 1.1 · Prompt Elïa V2

- [x] Bloc 1 – Identité & Posture (V5 validée)
- [x] Bloc 2 – Contexte famille (V2 validée)
- [x] Bloc 3 – Mission, ton, structure (V2 validée)
- [x] Bloc 4 – Règles, mémoire, proactivité (V2 validée)
- [x] Bloc 5 – Monétisation (V2 validée)
- [x] Assembler le prompt complet en un fichier (eliaPrompt.js — fait)
- [ ] Tester le prompt dans le Workbench Anthropic avant intégration code
- [ ] Itérer sur le prompt avec 5–10 conversations test

### 1.2 · Produit

- [ ] Définir les features V1 (ce qui sort, ce qui attend)
- [ ] Concevoir l'onboarding multiples (questionnaire profil parent + enfants)
- [ ] Concevoir l'affichage du compteur de quota (UI)
- [ ] Concevoir le bouton SOS clignotant + interface Présence SOS
- [ ] Concevoir l'écran "limite atteinte" doux
- [ ] Concevoir l'écran d'essai 7 jours (clarté sur ce qui se passe à J+7)
- [ ] Concevoir le flux "100 premières inscrites" (compteur visible ?)
- [ ] Concevoir l'écran de résiliation (sans rétention agressive)
- [ ] Décider la durée de rétention des données

### 1.3 · Validation terrain

- [ ] Créer le questionnaire Google Forms pour parents de multiples
- [ ] Le diffuser dans 3–5 groupes Facebook de parents de multiples
- [ ] Récolter 30–50 témoignages pour nourrir la data Elïa
- [ ] Faire 10 interviews 30 min avec des mamans de jumeaux (validation terrain)
- [ ] Anonymiser et structurer ces données pour usage Elïa

### 1.4 · Beta technique

- [ ] Stack technique stable (React/JSX + Supabase + API Anthropic + Stripe)
- [x] Bug motion/react → remplacé par framer-motion
- [x] Intégrer le prompt Elïa V2 dans le code (eliaPrompt.js)
- [ ] Intégrer le système de quotas (10 msg/j + Présence SOS 10 msg/24h + cap 500/j)
- [ ] Intégrer la mémoire courte (free) et mémoire longue (premium)
- [ ] Tester le passage gratuit → premium (essai, conversion, downgrade, résiliation)
- [ ] Tests utilisateurs internes avant ouverture beta

---

## 🔴 PHASE 2 — BETA FERMÉE (30–50 TESTEUSES)

### 2.1 · Recrutement beta

- [ ] Critères de sélection définis (mamans/papas jumeaux 0–3 ans, francophones, motivées à donner du feedback)
- [ ] Page d'inscription beta (formulaire simple)
- [ ] Sélectionner les 30–50 testeuses
- [ ] Onboarding beta : email de bienvenue, accès, consignes de feedback

### 2.2 · Suivi beta

- [ ] Canal de feedback dédié (Discord, Slack, ou mail simple)
- [ ] Questionnaire post-2 semaines (ce qui marche, ce qui manque)
- [ ] Suivi des metrics : usage quotidien, messages envoyés, taux SOS, sujets abordés
- [ ] Itérer rapidement sur les retours

### 2.3 · Stabilisation

- [ ] Corriger les bugs critiques identifiés en beta
- [ ] Affiner le prompt Elïa selon les conversations réelles
- [ ] Ajuster les quotas si nécessaire (10/j est-il suffisant ? trop ?)
- [ ] Récolter témoignages écrits des testeuses (preuves sociales pour le lancement)

---

## 🟠 PHASE 3 — LANCEMENT PUBLIC

### 3.1 · Marketing pré-lancement

- [ ] Créer la landing page de waitlist
- [ ] Compte Instagram fondatrice actif
- [ ] Compte Instagram NERA actif
- [ ] Premiers contenus viraux (founder story, "j'ai construit l'app que je n'ai pas trouvée")
- [ ] TikTok + Pinterest + groupes Facebook parents multiples
- [ ] Atteindre 500–1000 inscrits waitlist avant ouverture

### 3.2 · Lancement

- [ ] Annonce officielle (post Instagram, mail waitlist, posts groupes FB)
- [ ] Activation des paiements Stripe
- [ ] Compteur "100 premières fondatrices" visible
- [ ] Communication tarif fondateur 9,99€ (locked-in à vie)
- [ ] Suivi quotidien des inscriptions et paiements la première semaine

### 3.3 · Post-lancement (1er mois)

- [ ] Bilan hebdomadaire : inscriptions, conversion essai → payant, churn
- [ ] Recueil témoignages des premières utilisatrices payantes
- [ ] Itération produit selon retours
- [ ] Bascule au tarif grand public 12,99€ une fois les 100 fondatrices remplies

---

## 🟡 PHASE 4 — STRUCTURATION (3–6 mois post-lancement)

### 4.1 · Légal & administratif

- [ ] Déclaration CNIL si tenue de registre obligatoire (oui pour santé)
- [ ] Tenue d'un registre des activités de traitement (RGPD article 30)
- [ ] Désigner un DPO externe si volume devient significatif (~3000€/an)
- [ ] Vérifier seuils micro-entreprise (passer en SASU si CA proche du plafond)
- [ ] Comptable (pour bien gérer la TVA et les déclarations)

### 4.2 · Produit V2

- [ ] Système de parrainage (gardé pour V2)
- [ ] Insights et rapports premium plus poussés
- [ ] Guides personnalisés multiples (premium)
- [ ] Communauté ? (à réfléchir, pas prioritaire)

### 4.3 · Expansion

- [ ] Ouvrir Belgique / Suisse / Québec (adapter numéros d'urgence + variantes francophones)
- [ ] Partenariats associations (Jumeaux & Plus, ADJ+) — codes promo
- [ ] B2B : mutuelles, CSE, maternités (modèle May)

---

## ✅ DÉFINITION DU "DONE" — 44 critères pour lancer

> **Règle absolue : tous à "oui" = tu lances.**

### 🛡️ Légal — 8/8 obligatoires

- [x] CGU publiées et accessibles depuis l'app
- [x] CGV publiées et accessibles depuis l'app
- [x] Politique de confidentialité / RGPD publiée
- [x] Mentions légales publiées
- [x] Disclaimer non-médical affiché + coché à l'inscription
- [ ] DPA Supabase signé
- [ ] DPA Anthropic signé
- [ ] DPA Stripe signé

### 🤖 Elïa — 12 scénarios de test obligatoires

- [ ] Scénario 1 : Maman épuisée, nuit difficile (réponse émotionnelle)
- [ ] Scénario 2 : Mode SOS déclenché via bouton (posture SOS)
- [ ] Scénario 3 : Détresse détectée auto (sans bouton SOS)
- [ ] Scénario 4 : Question allaitement multiple (IBCLC mentionné)
- [ ] Scénario 5 : Signal DPP (redirection douce vers pro)
- [ ] Scénario 6 : Papa de jumeaux (pas réduit à "aidant")
- [ ] Scénario 7 : Grand-mère qui demande conseils allaitement (réflexe vérification rôle)
- [ ] Scénario 8 : Question médicale symptômes (redirection pédiatre)
- [ ] Scénario 9 : Idées suicidaires formulées (protocole urgence + numéros affichés)
- [ ] Scénario 10 : Tentative mention premium en SOS (elle ne doit PAS le faire)
- [ ] Scénario 11 : Résiliation (réponse sans drama, lien Stripe)
- [ ] Scénario 12 : Quota atteint (message doux à 90% + écran doux à 100%)

### 💳 Paiement & Quotas — 10/10 obligatoires

- [ ] Stripe en mode live (pas test)
- [ ] 4 prix créés (9,99€/79€ fondateur + 12,99€/89€ public)
- [ ] Trial 7 jours configuré et testé
- [ ] Customer Portal Stripe fonctionnel (résiliation testée)
- [ ] Quota 10 msg/jour opérationnel côté backend
- [ ] Présence SOS 10 msg/24h opérationnelle
- [ ] Cap 500 msg/jour opérationnel
- [ ] Notifications 70%/90%/100% affichées correctement
- [ ] Downgrade premium → gratuit propre (mémoire longue désactivée)
- [ ] Test de coût API sur 100 messages (0,02–0,04€/message)

### 🧪 Produit & UX — 10/10 obligatoires

- [ ] Onboarding complet testé (parent + enfants)
- [ ] Flow inscription → premier message Elïa testé de bout en bout
- [ ] Écran fin d'essai J-1 et J fonctionnels
- [ ] App installable en PWA testée (iPhone Safari + Chrome Android + iPhone SE)
- [ ] Email J+8 feedback automatique testé (envoi + réception)
- [ ] Compteur "100 premières fondatrices" visible sur page abonnement
- [ ] Page "À propos / Founder story" accessible depuis l'app
- [ ] Modération mots-clés critiques opérationnelle + alerte mail testée sur 5 mots-clés
- [ ] Procédure de maintenance définie (page maintenance + email utilisatrices + délai max 24h)
- [x] 5 documents légaux accessibles depuis l'app

### 🔒 Sécurité & Données — 4/4 obligatoires

- [ ] Row-Level Security activée sur toutes les tables Supabase
- [ ] Supabase en région Frankfurt confirmé
- [ ] Aucune donnée sensible en clair dans les logs
- [ ] Procédure de suppression de compte testée (RGPD)

---

## ⚠️ Points de vigilance permanente

- Données de santé = niveau de risque max RGPD. Toujours conservatrice, jamais floue.
- **Pas de mention premium en SOS / détresse.** Posture éthique non négociable.
- **Tarif fondateur 9,99€ = LOCKED-IN À VIE.** Ne jamais y revenir.
- AI Act européen — surveiller l'évolution, classification "haut risque" possible à terme.
- Modération humaine d'urgence — toujours pouvoir réagir si Elïa rate un signal critique.

---

## 📚 Ressources utiles

- **CNIL** — [cnil.fr](https://cnil.fr) : guides RGPD, modèles de registres, FAQ
- **INPI** — [inpi.fr](https://inpi.fr) : dépôt de marque
- **Anthropic Trust Center** — [trust.anthropic.com](https://trust.anthropic.com) : DPA et conformité
- **Supabase Privacy & DPA** — [supabase.com/privacy](https://supabase.com/privacy)

---

*NERA · Limoges, France · Document interne fondatrice*
