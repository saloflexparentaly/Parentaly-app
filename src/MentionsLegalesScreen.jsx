import { motion } from "framer-motion";

// ─── À renseigner avant mise en production ───────────────────────────────────
// TODO: remplacer par le domaine final (ex: nera-app.fr)
const NOM_DOMAINE = "DOMAINE_À_RENSEIGNER";
// TODO: vérifier ton code APE sur https://avis-situation-sirene.insee.fr avec SIRET 995 248 515 00018
const CODE_APE = "CODE_APE_À_VÉRIFIER";

// ─── Bloc section ─────────────────────────────────────────────────────────────
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

function Row({ label, value }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <span style={{ color: "var(--ink-faint)", fontWeight: 400 }}>{label} </span>
      <span style={{ color: "var(--ink)" }}>{value}</span>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function MentionsLegalesScreen({ onBack }) {
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
            Mentions légales
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

        {/* Éditeur */}
        <Section title="Éditeur">
          <p style={{ marginBottom: 10 }}>
            L'application <strong>NERA</strong> et le site{" "}
            <strong>{NOM_DOMAINE}</strong> sont édités par :
          </p>
          <Row label="Nom :"         value="Salomé De Angeli" />
          <Row label="Statut :"      value="Micro-entreprise" />
          <Row label="SIRET :"       value="995 248 515 00018" />
          <Row label="Adresse :"     value="17 avenue de Naugeat, 87000 Limoges, France" />
          <Row label="Code APE :"    value={CODE_APE} />
          <Row label="Contact :"     value={`contact@${NOM_DOMAINE}`} />
        </Section>

        {/* Directrice de la publication */}
        <Section title="Directrice de la publication">
          <p>Salomé De Angeli</p>
        </Section>

        {/* Hébergement */}
        <Section title="Hébergement">
          <p style={{ fontWeight: 500, color: "var(--ink)", marginBottom: 6 }}>
            Application web et serveur
          </p>
          <p>
            Railway Corp. — 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
            {" "}(<a href="https://railway.app" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>railway.app</a>)
          </p>
        </Section>

        {/* Données personnelles */}
        <Section title="Traitement des données personnelles">
          <p style={{ marginBottom: 10 }}>
            Le traitement des données personnelles est décrit dans la{" "}
            <strong>Politique de confidentialité</strong> accessible depuis l'application.
          </p>
          <p>
            Pour toute demande relative à vos données :{" "}
            <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
              contact@{NOM_DOMAINE}
            </a>
          </p>
        </Section>

        {/* Propriété intellectuelle */}
        <Section title="Propriété intellectuelle">
          <p>
            L'ensemble des contenus présents sur l'application NERA — textes, interface,
            fonctionnalités, identité visuelle — est la propriété exclusive de Salomé De Angeli,
            sauf mention contraire.
          </p>
          <p style={{ marginTop: 8 }}>
            Toute reproduction, représentation ou diffusion, en tout ou partie, est interdite
            sans autorisation écrite préalable.
          </p>
        </Section>

        {/* Intelligence artificielle */}
        <Section title="Intelligence artificielle">
          <p style={{ marginBottom: 10 }}>
            L'application NERA utilise un système d'intelligence artificielle pour fournir son
            service de soutien émotionnel. Ce système est fourni par :
          </p>
          <Row label="Société :"  value="Anthropic, PBC" />
          <Row label="Adresse :"  value="548 Market St, PMB 90375, San Francisco, CA 94104, États-Unis" />
          <div style={{ marginTop: 10 }}>
            <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
              anthropic.com
            </a>
          </div>
          <p style={{ marginTop: 12 }}>
            Conformément au Règlement européen sur l'intelligence artificielle (AI Act),
            l'utilisateur est informé qu'il interagit avec un système d'intelligence artificielle.{" "}
            <strong>NERA n'est pas un service médical ou thérapeutique.</strong>
          </p>
        </Section>

        {/* Médiation */}
        <Section title="Médiation et règlement des litiges">
          <p style={{ marginBottom: 10 }}>
            En cas de litige, l'utilisateur peut recourir à un service de médiation de la
            consommation. Conformément à l'ordonnance n° 2015-1033 du 20 août 2015, tout litige
            de consommation peut faire l'objet d'un règlement amiable par médiation.
          </p>
          <p>
            Plateforme européenne de règlement en ligne des litiges :{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", wordBreak: "break-all" }}
            >
              ec.europa.eu/consumers/odr
            </a>
          </p>
        </Section>

        {/* Droit applicable */}
        <Section title="Droit applicable">
          <p>
            Les présentes mentions légales sont soumises au droit français. En cas de litige,
            les tribunaux français seront seuls compétents.
          </p>
        </Section>

        {/* Footer */}
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
