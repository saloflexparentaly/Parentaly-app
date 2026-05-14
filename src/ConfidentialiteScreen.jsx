import { motion } from "framer-motion";

// ─── À renseigner avant mise en production ────────────────────────────────────
const NOM_DOMAINE = "DOMAINE_À_RENSEIGNER"; // TODO: domaine final

// TODO: section 3 "Sous-traitants" — ce document liste Supabase/Vercel
// comme infrastructure cible. Tant que l'app tourne sur Railway,
// remplacer Supabase/Vercel par Railway dans ce tableau pour rester
// conforme à la réalité (obligation RGPD art. 28).

// ─── Composants utilitaires ───────────────────────────────────────────────────
function Section({ id, title, children }) {
  return (
    <div style={{
      background: "var(--surface)",
      borderRadius: 20,
      padding: "20px 18px",
      border: "1px solid var(--surface-border-s)",
      backdropFilter: "blur(20px)",
    }}>
      <p style={{
        fontSize: 11, fontWeight: 500, color: "var(--ink-faint)",
        textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12,
      }}>
        {id && <span style={{ color: "var(--accent)", marginRight: 6 }}>{id}.</span>}
        {title}
      </p>
      <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.8, fontWeight: 300 }}>
        {children}
      </div>
    </div>
  );
}

function TableRow({ cols, header }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: header ? "1fr 1fr 1fr" : "1fr 1fr 1fr",
      gap: 8,
      padding: "8px 10px",
      borderRadius: 8,
      background: header ? "var(--surface-tint)" : "transparent",
      borderBottom: "1px solid var(--surface-border)",
      fontSize: header ? 11 : 12,
      fontWeight: header ? 500 : 300,
      color: header ? "var(--ink-faint)" : "var(--ink-soft)",
    }}>
      {cols.map((c, i) => <span key={i}>{c}</span>)}
    </div>
  );
}

function Table2({ cols, header, rows }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      borderRadius: 10,
      overflow: "hidden",
      border: "1px solid var(--surface-border)",
    }}>
      {header.map((h, i) => (
        <div key={i} style={{
          padding: "7px 10px", background: "var(--surface-tint)",
          fontSize: 11, fontWeight: 500, color: "var(--ink-faint)",
          textTransform: "uppercase", letterSpacing: ".05em",
          borderRight: i < header.length - 1 ? "1px solid var(--surface-border)" : "none",
        }}>{h}</div>
      ))}
      {rows.map((row, ri) =>
        row.map((cell, ci) => (
          <div key={`${ri}-${ci}`} style={{
            padding: "8px 10px", fontSize: 12,
            color: "var(--ink-soft)", fontWeight: 300,
            lineHeight: 1.5,
            background: ri % 2 === 0 ? "transparent" : "rgba(0,0,0,.02)",
            borderTop: "1px solid var(--surface-border)",
            borderRight: ci < row.length - 1 ? "1px solid var(--surface-border)" : "none",
          }}>{cell}</div>
        ))
      )}
    </div>
  );
}

function Right({ num, title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontWeight: 500, color: "var(--ink)", marginBottom: 4, fontSize: 13 }}>
        Art. {num} — {title}
      </p>
      <p>{children}</p>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ConfidentialiteScreen({ onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      style={{ minHeight: "100vh", paddingBottom: 48 }}
    >
      {/* Header */}
      <div style={{
        background: "var(--surface-header)",
        borderBottom: "1px solid var(--surface-border-s)",
        padding: "20px 24px",
        backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--ink-soft)", fontSize: 20, lineHeight: 1,
          padding: "4px 2px", display: "flex", alignItems: "center",
        }} aria-label="Retour">←</button>
        <div>
          <span className="serif" style={{
            fontStyle: "italic", fontSize: 16, fontWeight: 400,
            color: "var(--brand)", letterSpacing: ".04em",
          }}>NERA</span>
          <h1 className="serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>
            Politique de confidentialité
          </h1>
        </div>
      </div>

      <div style={{ padding: "12px 24px 0" }}>
        <p style={{ fontSize: 11, color: "var(--ink-faint)", fontStyle: "italic" }}>
          Dernière mise à jour : Mai 2026 · Version 1.0
        </p>
      </div>

      <div style={{
        maxWidth: 480, margin: "0 auto",
        padding: "16px 20px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>

        {/* 1. Qui sommes-nous */}
        <Section id="1" title="Qui sommes-nous ?">
          <p style={{ marginBottom: 10, fontWeight: 400, color: "var(--ink)" }}>
            Responsable du traitement
          </p>
          <p style={{ marginBottom: 4 }}>Salomé De Angeli — Micro-entreprise</p>
          <p style={{ marginBottom: 4 }}>SIRET : 995 248 515 00018</p>
          <p style={{ marginBottom: 4 }}>17 avenue de Naugeat, 87000 Limoges, France</p>
          <p style={{ marginBottom: 10 }}>
            Email :{" "}
            <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
              contact@{NOM_DOMAINE}
            </a>
          </p>
          <p>
            NERA est un service de soutien émotionnel et parental destiné aux parents
            de jumeaux et de multiples.
          </p>
        </Section>

        {/* 2. Données collectées */}
        <Section id="2" title="Données que nous collectons">

          <p style={{ fontWeight: 500, color: "var(--ink)", marginBottom: 8 }}>
            2.1 Identification et compte
          </p>
          <Table2 cols={3}
            header={["Donnée", "Finalité", "Base légale"]}
            rows={[
              ["Adresse email",          "Gestion du compte, communications",   "Contrat"],
              ["Prénom",                 "Personnalisation",                    "Contrat"],
              ["Mot de passe (haché)",   "Authentification sécurisée",          "Contrat"],
            ]}
          />

          <p style={{ fontWeight: 500, color: "var(--ink)", margin: "16px 0 8px" }}>
            2.2 Profil familial
          </p>
          <p style={{ marginBottom: 8 }}>
            Données fournies volontairement lors de l'onboarding ou au fil de l'utilisation.
          </p>
          <Table2 cols={3}
            header={["Donnée", "Finalité", "Base légale"]}
            rows={[
              ["Rôle parental",                  "Personnalisation d'Elïa",  "Consentement"],
              ["Prénoms et âges des enfants",    "Personnalisation d'Elïa",  "Consentement"],
              ["Type de grossesse/accouchement", "Personnalisation d'Elïa",  "Consentement"],
              ["Situation familiale",            "Personnalisation d'Elïa",  "Consentement"],
            ]}
          />

          <p style={{ fontWeight: 500, color: "var(--ink)", margin: "16px 0 8px" }}>
            2.3 Données de santé — Catégorie spéciale (Art. 9 RGPD)
          </p>
          <div style={{
            background: "rgba(201,117,96,.08)", borderRadius: 10,
            padding: "12px 14px", marginBottom: 10,
            border: "1px solid rgba(201,117,96,.2)",
          }}>
            <p style={{ marginBottom: 6 }}>
              Certaines données peuvent constituer des <strong style={{ color: "var(--ink)" }}>données de santé</strong> au sens du RGPD :
            </p>
            <p>• État émotionnel et psychologique partagé lors des conversations</p>
            <p>• Informations relatives à un post-partum, épuisement parental, dépression post-partum</p>
            <p>• État de santé des enfants (prématurité, pathologies, etc.)</p>
          </div>
          <p>
            <strong style={{ color: "var(--ink)" }}>Base légale :</strong> consentement explicite, recueilli lors de l'inscription (case dédiée).
            Vous pouvez retirer ce consentement à tout moment — ce retrait entraîne l'impossibilité d'utiliser le service.
          </p>

          <p style={{ fontWeight: 500, color: "var(--ink)", margin: "16px 0 8px" }}>
            2.4 Contenu des conversations
          </p>
          <p style={{ marginBottom: 6 }}>
            Les échanges avec Elïa sont enregistrés afin de :
          </p>
          <p>• Fournir la mémoire conversationnelle (premium)</p>
          <p>• Assurer la continuité de l'accompagnement</p>
          <p style={{ marginBottom: 10 }}>• Assurer la sécurité du service (modération)</p>
          <p>
            <strong style={{ color: "var(--ink)" }}>Conservation :</strong> 12 mois glissants pour les comptes actifs. Suppression dans les 30 jours suivant la clôture du compte.
          </p>

          <p style={{ fontWeight: 500, color: "var(--ink)", margin: "16px 0 8px" }}>
            2.5 Données techniques
          </p>
          <Table2 cols={3}
            header={["Donnée", "Finalité", "Durée"]}
            rows={[
              ["Adresse IP",         "Sécurité, lutte contre les abus", "90 jours"],
              ["Logs de connexion",  "Sécurité, débogage",              "90 jours"],
              ["Compteurs d'usage",  "Application des quotas",          "Durée du compte"],
            ]}
          />

          <p style={{ fontWeight: 500, color: "var(--ink)", margin: "16px 0 8px" }}>
            2.6 Données de paiement
          </p>
          <p>
            Les données de paiement <strong style={{ color: "var(--ink)" }}>ne sont jamais stockées par NERA</strong>.
            Elles sont traitées exclusivement par <strong style={{ color: "var(--ink)" }}>Stripe</strong>.
            Seul un identifiant anonyme de client Stripe est conservé côté NERA.
          </p>
        </Section>

        {/* 3. Sous-traitants */}
        <Section id="3" title="Sous-traitants et transferts de données">
          <p style={{ marginBottom: 12 }}>
            Chaque sous-traitant a signé un accord de traitement de données conforme au RGPD.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { name: "Supabase Inc.",  role: "Base de données, authentification", loc: "UE — Frankfurt (DE)",    garantie: "DPA + CCT" },
              { name: "Vercel Inc.",    role: "Hébergement application web",        loc: "États-Unis",             garantie: "DPA + CCT" },
              { name: "Anthropic PBC", role: "Intelligence artificielle (Elïa)",   loc: "États-Unis",             garantie: "DPA + CCT" },
              { name: "Stripe Inc.",   role: "Paiement et abonnements",            loc: "UE (Irlande) + USA",     garantie: "DPA + CCT" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "var(--surface-tint)", borderRadius: 10,
                padding: "10px 12px",
                border: "1px solid var(--surface-border)",
              }}>
                <p style={{ fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>{s.name}</p>
                <p style={{ marginBottom: 2 }}>{s.role}</p>
                <p style={{ marginBottom: 2 }}>📍 {s.loc}</p>
                <p style={{ color: "var(--ink-faint)", fontSize: 11 }}>{s.garantie}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 12 }}>
            <strong style={{ color: "var(--ink)" }}>Transferts hors UE :</strong> encadrés par des Clauses Contractuelles Types (CCT) adoptées par la Commission européenne (art. 46 RGPD).
          </p>
        </Section>

        {/* 4. Vos droits */}
        <Section id="4" title="Vos droits">
          <Right num="15" title="Accès">
            Vous pouvez demander une copie de l'ensemble de vos données personnelles.
          </Right>
          <Right num="16" title="Rectification">
            Vous pouvez corriger des données inexactes ou incomplètes — directement dans "Mon profil".
          </Right>
          <Right num="17" title="Effacement">
            Vous pouvez demander la suppression de vos données. Cela entraîne la clôture de votre compte et la suppression de l'ensemble de vos données dans un délai de 30 jours.
          </Right>
          <Right num="18" title="Limitation">
            Vous pouvez demander la suspension temporaire du traitement de vos données.
          </Right>
          <Right num="20" title="Portabilité">
            Vous pouvez demander l'export de vos données dans un format structuré (JSON).
          </Right>
          <Right num="21" title="Opposition">
            Vous pouvez vous opposer au traitement dans certains cas.
          </Right>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontWeight: 500, color: "var(--ink)", marginBottom: 4, fontSize: 13 }}>
              Retrait du consentement
            </p>
            <p>
              Vous pouvez retirer votre consentement à tout moment, notamment pour les données de santé.
              Le retrait n'affecte pas la licéité des traitements antérieurs.
            </p>
          </div>
          <div style={{
            background: "var(--surface-tint)", borderRadius: 10,
            padding: "12px 14px", border: "1px solid var(--surface-border)",
          }}>
            <p style={{ fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>
              Pour exercer vos droits :
            </p>
            <p style={{ marginBottom: 4 }}>
              <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
                contact@{NOM_DOMAINE}
              </a>
            </p>
            <p>Délai de réponse : 30 jours maximum.</p>
            <p style={{ marginTop: 6, fontSize: 12 }}>
              Une justification d'identité peut être demandée.
            </p>
          </div>
        </Section>

        {/* 5. Sécurité */}
        <Section id="5" title="Sécurité des données">
          {[
            ["Chiffrement en transit",    "Connexions HTTPS (TLS 1.2+)"],
            ["Chiffrement au repos",      "Conversations chiffrées côté base de données"],
            ["Contrôle d'accès",          "Row-Level Security (RLS) sur toutes les tables"],
            ["Mots de passe",             "Hachés en bcrypt, non lisibles"],
            ["Données de paiement",       "Jamais stockées par NERA — déléguées à Stripe"],
            ["Journaux d'accès",          "Conservés 90 jours"],
          ].map(([label, val], i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: "var(--accent)", flexShrink: 0 }}>•</span>
              <span><strong style={{ color: "var(--ink)" }}>{label} :</strong> {val}</span>
            </div>
          ))}
          <p style={{ marginTop: 10 }}>
            En cas de violation de données susceptible d'engendrer un risque, nous nous engageons
            à vous notifier dans les <strong style={{ color: "var(--ink)" }}>72 heures</strong> (art. 33 RGPD) et à notifier la CNIL.
          </p>
        </Section>

        {/* 6. Durée de conservation */}
        <Section id="6" title="Durée de conservation">
          <Table2 cols={2}
            header={["Donnée", "Durée"]}
            rows={[
              ["Données de compte",          "Durée du compte + 30 j après clôture"],
              ["Profil familial",            "Durée du compte + 30 j après clôture"],
              ["Conversations avec Elïa",    "12 mois glissants + 30 j après clôture"],
              ["Logs techniques",            "90 jours"],
              ["ID Stripe (paiement)",       "Relation commerciale + 5 ans (loi)"],
              ["Données de modération",      "12 mois"],
            ]}
          />
        </Section>

        {/* 7. Cookies */}
        <Section id="7" title="Cookies et traceurs">
          <p style={{ marginBottom: 10 }}>
            NERA est une application web progressive (PWA). Elle utilise uniquement :
          </p>
          <div style={{
            background: "var(--surface-tint)", borderRadius: 10,
            padding: "10px 14px", marginBottom: 10,
            border: "1px solid var(--surface-border)",
          }}>
            <p style={{ fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>
              Cookies techniques strictement nécessaires
            </p>
            <p>Authentification de session, préférences utilisateur. Ces cookies ne nécessitent pas de consentement.</p>
          </div>
          <p>• Pas de cookies publicitaires</p>
          <p style={{ marginBottom: 10 }}>• Pas de traceurs tiers à des fins publicitaires</p>
          <p>
            Si des traceurs supplémentaires sont ajoutés à l'avenir, votre consentement préalable sera demandé.
          </p>
        </Section>

        {/* 8. Modération */}
        <Section id="8" title="Modération et sécurité des conversations">
          <p style={{ marginBottom: 10 }}>
            Les conversations avec Elïa sont soumises à une{" "}
            <strong style={{ color: "var(--ink)" }}>modération automatique par mots-clés</strong>{" "}
            visant à détecter les situations de crise (expressions suicidaires, signaux de violence, danger immédiat).
          </p>
          <p style={{ marginBottom: 10 }}>
            En cas de détection d'un signal critique, une <strong style={{ color: "var(--ink)" }}>alerte interne</strong>{" "}
            est générée à destination de l'éditrice du service, qui peut prendre connaissance du contenu
            à des fins de vérification de sécurité.
          </p>
          <p style={{ marginBottom: 10 }}>
            Ce traitement est fondé sur l'<strong style={{ color: "var(--ink)" }}>intérêt vital</strong>{" "}
            de la personne concernée ou d'un tiers (art. 9.2.c RGPD), dans le but exclusif d'assurer la sécurité des utilisateurs.
          </p>
          <p>Les données de modération ne sont jamais utilisées à des fins commerciales ou d'amélioration de produit.</p>
        </Section>

        {/* 9. Mineurs */}
        <Section id="9" title="Mineurs">
          <p>
            NERA est réservée aux personnes âgées de{" "}
            <strong style={{ color: "var(--ink)" }}>16 ans et plus</strong>.
            Nous ne collectons pas sciemment de données de personnes de moins de 16 ans.
          </p>
          <p style={{ marginTop: 8 }}>
            Si vous estimez qu'un mineur a créé un compte :{" "}
            <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
              contact@{NOM_DOMAINE}
            </a>
          </p>
        </Section>

        {/* 10. Modifications */}
        <Section id="10" title="Modifications de la politique">
          <p>
            En cas de modification substantielle, vous serez informé par email et/ou notification
            dans l'application au moins <strong style={{ color: "var(--ink)" }}>30 jours avant</strong> l'entrée en vigueur.
            La poursuite de l'utilisation du service vaut acceptation.
          </p>
        </Section>

        {/* 11. CNIL */}
        <Section id="11" title="Réclamation auprès de la CNIL">
          <p style={{ marginBottom: 8 }}>
            Si vous estimez que le traitement de vos données constitue une violation du RGPD,
            vous avez le droit d'introduire une réclamation auprès de la CNIL.
          </p>
          <p style={{ marginBottom: 4 }}>
            <strong style={{ color: "var(--ink)" }}>CNIL</strong> — 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07
          </p>
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
            cnil.fr
          </a>
        </Section>

        {/* 12. Contact */}
        <Section id="12" title="Contact">
          <p style={{ marginBottom: 6 }}>
            Email :{" "}
            <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
              contact@{NOM_DOMAINE}
            </a>
          </p>
          <p style={{ marginBottom: 6 }}>
            Adresse : Salomé De Angeli, 17 avenue de Naugeat, 87000 Limoges, France
          </p>
          <p>Délai de réponse : 30 jours maximum.</p>
        </Section>

        <p style={{
          textAlign: "center", fontSize: 11,
          color: "var(--ink-faint)", fontStyle: "italic", marginTop: 8,
        }}>
          NERA · Limoges, France<br />
          Soumis au droit français et au Règlement (UE) 2016/679 (RGPD).
        </p>

      </div>
    </motion.div>
  );
}
