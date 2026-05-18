import { motion } from "framer-motion";

const NOM_DOMAINE = "DOMAINE_À_RENSEIGNER";

function Section({ title, children }) {
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
        {title}
      </p>
      <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.8, fontWeight: 300 }}>
        {children}
      </div>
    </div>
  );
}

function CookieRow({ name, type, finalite, duree }) {
  return (
    <div style={{
      borderBottom: "1px solid var(--surface-border-s)",
      paddingBottom: 12,
      marginBottom: 12,
    }}>
      <p style={{ fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>{name}</p>
      <p><span style={{ color: "var(--ink-faint)" }}>Type : </span>{type}</p>
      <p><span style={{ color: "var(--ink-faint)" }}>Finalité : </span>{finalite}</p>
      <p><span style={{ color: "var(--ink-faint)" }}>Durée : </span>{duree}</p>
    </div>
  );
}

export default function CookiesScreen({ onBack }) {
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
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--ink-soft)", fontSize: 20, lineHeight: 1,
            padding: "4px 2px", display: "flex", alignItems: "center",
          }}
          aria-label="Retour"
        >
          ←
        </button>
        <div>
          <span className="serif" style={{
            fontStyle: "italic", fontSize: 16, fontWeight: 400,
            color: "var(--brand)", letterSpacing: ".04em",
          }}>
            NERA
          </span>
          <h1 className="serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>
            Politique cookies
          </h1>
        </div>
      </div>

      {/* Date mise à jour */}
      <div style={{ padding: "12px 24px 0" }}>
        <p style={{ fontSize: 11, color: "var(--ink-faint)", fontStyle: "italic" }}>
          Dernière mise à jour : Mai 2026
        </p>
      </div>

      {/* Contenu */}
      <div style={{
        maxWidth: 480, margin: "0 auto",
        padding: "16px 20px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>

        <Section title="Qu'est-ce qu'un cookie ?">
          <p>
            Un cookie est un petit fichier texte déposé sur votre appareil lors de votre
            visite sur une application ou un site web. Il permet de mémoriser des informations
            entre deux visites ou au cours d'une même session.
          </p>
          <p style={{ marginTop: 8 }}>
            NERA utilise également le <strong>stockage local</strong> (localStorage) du navigateur,
            qui fonctionne de façon similaire aux cookies mais reste strictement sur votre appareil
            et n'est jamais transmis à un serveur.
          </p>
        </Section>

        <Section title="Cookies que nous utilisons">
          <p style={{ marginBottom: 14 }}>
            NERA n'utilise <strong>aucun cookie de suivi, de publicité ou d'analyse
            comportementale</strong>. Seuls des cookies strictement nécessaires au fonctionnement
            du service sont déposés.
          </p>

          <CookieRow
            name="Session d'authentification (Supabase)"
            type="Strictement nécessaire — Technique"
            finalite="Maintenir votre session de connexion sécurisée. Permet à l'application de vous reconnaître entre deux ouvertures sans vous redemander de vous identifier."
            duree="Jusqu'à expiration de la session (max 1 semaine) ou déconnexion"
          />

          <CookieRow
            name="Préférences d'affichage (localStorage)"
            type="Strictement nécessaire — Fonctionnel"
            finalite="Mémoriser votre thème (clair/sombre/auto), vos préférences de profil et les données de votre session de conversation locale."
            duree="Jusqu'à la suppression de votre compte ou réinitialisation manuelle"
          />

          <CookieRow
            name="Paiement sécurisé (Stripe)"
            type="Strictement nécessaire — Tiers"
            finalite="Permettre le traitement sécurisé de votre abonnement lors du paiement. Ces cookies sont déposés uniquement lors du passage sur la page de paiement Stripe."
            duree="Durée de la session de paiement (quelques minutes)"
          />

          <p style={{ marginTop: 4, fontSize: 12, fontStyle: "italic", color: "var(--ink-faint)" }}>
            Ces cookies étant strictement nécessaires au fonctionnement du service,
            ils ne requièrent pas votre consentement préalable (Règlement ePrivacy et
            recommandations CNIL).
          </p>
        </Section>

        <Section title="Ce que nous n'utilisons pas">
          <p>NERA n'intègre aucun des traceurs suivants :</p>
          <ul style={{ paddingLeft: 16, marginTop: 8 }}>
            <li>Google Analytics ou tout autre outil de mesure d'audience</li>
            <li>Pixel Facebook / Meta ou réseaux sociaux</li>
            <li>Publicité ciblée ou reciblage (retargeting)</li>
            <li>Outils de session recording (Hotjar, FullStory, etc.)</li>
          </ul>
        </Section>

        <Section title="Gérer vos cookies">
          <p style={{ marginBottom: 10 }}>
            Vous pouvez à tout moment supprimer ou bloquer les cookies via les paramètres
            de votre navigateur. Notez que le blocage des cookies techniques peut empêcher
            le bon fonctionnement de l'application (vous ne pourrez plus rester connectée).
          </p>
          <p style={{ marginBottom: 8, fontWeight: 500, color: "var(--ink)" }}>Guides selon votre navigateur :</p>
          <ul style={{ paddingLeft: 16 }}>
            <li>Safari (iPhone) : Réglages → Safari → Avancé → Données de sites web</li>
            <li>Chrome : Paramètres → Confidentialité → Cookies</li>
            <li>Firefox : Paramètres → Vie privée → Cookies</li>
          </ul>
          <p style={{ marginTop: 10 }}>
            Pour supprimer vos données stockées localement dans NERA, utilisez le bouton
            « Réinitialiser mon profil » dans vos paramètres, ou contactez-nous à{" "}
            <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
              contact@{NOM_DOMAINE}
            </a>.
          </p>
        </Section>

        <Section title="Évolution de cette politique">
          <p>
            En cas d'ajout de nouveaux services susceptibles de déposer des cookies,
            cette politique sera mise à jour et vous serez informée via l'application.
            La date de dernière mise à jour figure en haut de cette page.
          </p>
        </Section>

        <Section title="Contact & droits">
          <p>
            Pour toute question relative aux cookies et au traitement de vos données,
            vous pouvez contacter :{" "}
            <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
              contact@{NOM_DOMAINE}
            </a>
          </p>
          <p style={{ marginTop: 8 }}>
            Vous pouvez également introduire une réclamation auprès de la{" "}
            <strong>CNIL</strong> :{" "}
            <a
              href="https://www.cnil.fr/fr/plaintes"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)" }}
            >
              cnil.fr/fr/plaintes
            </a>
          </p>
        </Section>

        <p style={{
          textAlign: "center", fontSize: 11,
          color: "var(--ink-faint)", fontStyle: "italic", marginTop: 8,
        }}>
          NERA · Limoges, France
        </p>

      </div>
    </motion.div>
  );
}
