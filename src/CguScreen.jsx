import { motion } from "framer-motion";

const NOM_DOMAINE = "DOMAINE_À_RENSEIGNER"; // TODO: domaine final

// ─── Composants utilitaires ───────────────────────────────────────────────────
function Section({ num, title, children }) {
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
        {num && <span style={{ color: "var(--accent)", marginRight: 6 }}>Art. {num}</span>}
        {title}
      </p>
      <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.8, fontWeight: 300 }}>
        {children}
      </div>
    </div>
  );
}

function Sub({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontWeight: 500, color: "var(--ink)", marginBottom: 6, fontSize: 13 }}>{title}</p>
      {children}
    </div>
  );
}

function Li({ children }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
      <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}>·</span>
      <span>{children}</span>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function CguScreen({ onBack }) {
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
            Conditions d'utilisation
          </h1>
        </div>
      </div>

      {/* Date */}
      <div style={{ padding: "12px 24px 0" }}>
        <p style={{ fontSize: 11, color: "var(--ink-faint)", fontStyle: "italic" }}>
          Dernière mise à jour : Mai 2026 · Version 1.0
        </p>
      </div>

      {/* Contenu */}
      <div style={{
        maxWidth: 480, margin: "0 auto",
        padding: "16px 20px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>

        {/* Préambule */}
        <Section title="Préambule">
          <p style={{ marginBottom: 10 }}>
            Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et
            l'utilisation de l'application <strong>NERA</strong> et de l'ensemble de ses fonctionnalités.
          </p>
          <p style={{ marginBottom: 10 }}>
            <strong>NERA</strong> est édité par Salomé De Angeli, micro-entreprise immatriculée sous
            le SIRET 995 248 515 00018, domiciliée au 17 avenue de Naugeat, 87000 Limoges, France
            (ci-après "l'Éditeur").
          </p>
          <p>
            Toute utilisation de l'application implique l'acceptation pleine et entière des présentes
            CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser l'application.
          </p>
        </Section>

        {/* Art. 1 — Définitions */}
        <Section num="1" title="Définitions">
          <Li><strong>"Application"</strong> : l'application NERA accessible via le web ou en tant qu'application installable (PWA)</Li>
          <Li><strong>"Utilisateur"</strong> : toute personne qui accède à l'Application et crée un compte</Li>
          <Li><strong>"Elïa"</strong> : l'intelligence artificielle conversationnelle intégrée à l'Application</Li>
          <Li><strong>"Service"</strong> : l'ensemble des fonctionnalités proposées par l'Application</Li>
          <Li><strong>"Compte"</strong> : l'espace personnel créé par l'Utilisateur lors de son inscription</Li>
          <Li><strong>"Plan Gratuit"</strong> : le niveau d'accès sans abonnement payant</Li>
          <Li><strong>"Plan Premium"</strong> : le niveau d'accès avec abonnement payant</Li>
          <Li><strong>"Contenu"</strong> : tout texte, donnée ou information échangé dans le cadre de l'utilisation de l'Application</Li>
        </Section>

        {/* Art. 2 — Objet */}
        <Section num="2" title="Objet">
          <p style={{ marginBottom: 10 }}>
            NERA est un service de <strong>soutien émotionnel et parental</strong> destiné aux parents
            de jumeaux et de multiples. L'Application propose :
          </p>
          <Li>Un accompagnement conversationnel via Elïa, une intelligence artificielle</Li>
          <Li>Un soutien dans la gestion de la charge mentale et de l'épuisement parental</Li>
          <Li>Des informations générales sur la parentalité des multiples</Li>
          <p style={{ marginTop: 10 }}>
            NERA <strong>n'est pas</strong> un service médical, psychiatrique ou thérapeutique.
            L'Éditeur invite les Utilisateurs à se référer au <strong>Disclaimer non-médical</strong>{" "}
            pour une description complète des limites du Service.
          </p>
        </Section>

        {/* Art. 3 — Conditions d'accès */}
        <Section num="3" title="Conditions d'accès">
          <Sub title="3.1 Âge minimum">
            <p>
              L'utilisation de l'Application est réservée aux personnes{" "}
              <strong>âgées de 16 ans ou plus</strong>. En créant un compte, vous déclarez avoir
              atteint cet âge.
            </p>
          </Sub>
          <Sub title="3.2 Inscription">
            <p style={{ marginBottom: 6 }}>L'accès au Service nécessite la création d'un compte avec :</p>
            <Li>Une adresse email valide</Li>
            <Li>Un mot de passe</Li>
            <Li>L'acceptation des présentes CGU</Li>
            <Li>L'acceptation de la Politique de confidentialité</Li>
            <Li>L'acceptation du Disclaimer non-médical</Li>
            <p style={{ marginTop: 8 }}>
              Ces acceptations sont obligatoires et ne peuvent être conditionnées ou partielles.
            </p>
          </Sub>
          <Sub title="3.3 Exactitude des informations">
            <p>
              L'Utilisateur s'engage à fournir des informations exactes et à les maintenir à jour.
              L'Éditeur ne saurait être tenu responsable des conséquences d'informations inexactes
              fournies par l'Utilisateur.
            </p>
          </Sub>
          <Sub title="3.4 Sécurité du compte">
            <p>
              L'Utilisateur est seul responsable de la confidentialité de ses identifiants de connexion.
              Tout accès au Service via son compte est présumé effectué par l'Utilisateur. En cas de
              compromission suspectée, l'Utilisateur doit en informer immédiatement l'Éditeur à{" "}
              <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
                contact@{NOM_DOMAINE}
              </a>.
            </p>
          </Sub>
        </Section>

        {/* Art. 4 — Description du Service */}
        <Section num="4" title="Description du Service">
          <Sub title="4.1 Plan Gratuit">
            <p style={{ marginBottom: 6 }}>Le Plan Gratuit comprend :</p>
            <Li><strong>10 messages par jour</strong> avec Elïa (remis à zéro à minuit)</Li>
            <Li><strong>1 session "Présence SOS"</strong> par période de 24 heures, déclenchée via le bouton SOS (environ 10 messages par session)</Li>
            <Li>Profil famille complet (multiples et singletons éventuels)</Li>
            <Li>Accès permanent aux numéros d'urgence (hors quota)</Li>
            <Li>Mémoire conversationnelle courte (conversation en cours)</Li>
          </Sub>
          <Sub title="4.2 Essai Premium">
            <p style={{ marginBottom: 6 }}>
              Tout nouvel Utilisateur bénéficie automatiquement d'un essai Premium gratuit de{" "}
              <strong>7 jours</strong> à compter de la création de son compte, sans obligation d'achat
              ni saisie de moyen de paiement initiale.
            </p>
            <p>
              À l'issue de l'essai, l'Utilisateur peut choisir de souscrire au Plan Premium ou de
              revenir au Plan Gratuit.
            </p>
          </Sub>
          <Sub title="4.3 Plan Premium">
            <p style={{ marginBottom: 6 }}>Le Plan Premium comprend, en plus du Plan Gratuit :</p>
            <Li>Conversations illimitées avec Elïa (dans la limite du cap technique ci-dessous)</Li>
            <Li>Mémoire conversationnelle longue (persistance des échanges sur la durée)</Li>
            <Li>Fonctionnalités supplémentaires en cours de développement (insights, rapports)</Li>
          </Sub>
          <Sub title="4.4 Cap technique anti-abus">
            <p style={{ marginBottom: 6 }}>
              Pour tous les comptes, y compris Premium, un{" "}
              <strong>plafond technique de 500 messages par période de 24 heures</strong> est appliqué.
              Ce plafond vise à protéger l'intégrité du Service et à prévenir les abus.
            </p>
            <p>
              En cas d'atteinte de ce plafond, le Service est temporairement suspendu jusqu'à la
              période suivante. L'Utilisateur en est informé.
            </p>
          </Sub>
          <Sub title="4.5 Mode SOS">
            <p>
              Le Mode SOS est une fonctionnalité de soutien émotionnel d'urgence non vitale, accessible
              via le bouton SOS dans l'interface. Il est inclus dans le Plan Gratuit et ne consomme
              pas le quota de 10 messages quotidiens, dans la limite d'une session par 24 heures.
            </p>
          </Sub>
        </Section>

        {/* Art. 5 — Obligations */}
        <Section num="5" title="Obligations de l'Utilisateur">
          <Sub title="5.1 Usage personnel">
            <p>
              L'Application est destinée à un usage <strong>strictement personnel</strong>.
              L'Utilisateur s'engage à ne pas partager son compte avec des tiers.
            </p>
          </Sub>
          <Sub title="5.2 Comportement">
            <p style={{ marginBottom: 6 }}>L'Utilisateur s'engage à ne pas utiliser l'Application pour :</p>
            <Li>Tenter de contourner les limitations techniques ou les quotas du Service</Li>
            <Li>Automatiser les échanges avec Elïa (bots, scripts, etc.)</Li>
            <Li>Transmettre des contenus illicites, diffamatoires, haineux ou portant atteinte aux droits de tiers</Li>
            <Li>Tenter de tromper ou manipuler le système d'intelligence artificielle à des fins malveillantes</Li>
            <Li>Utiliser le Service à des fins commerciales sans autorisation écrite préalable</Li>
          </Sub>
          <Sub title="5.3 Usage de l'IA">
            <p style={{ marginBottom: 6 }}>
              L'Utilisateur reconnaît qu'Elïa est une intelligence artificielle et que ses réponses :
            </p>
            <Li>Ne constituent pas des conseils médicaux, psychiatriques ou thérapeutiques</Li>
            <Li>Peuvent parfois être imprécises ou incomplètes</Li>
            <Li>Ne remplacent pas le jugement d'un professionnel de santé qualifié</Li>
          </Sub>
        </Section>

        {/* Art. 6 — Propriété intellectuelle */}
        <Section num="6" title="Propriété intellectuelle">
          <Sub title="6.1 Contenu de l'Application">
            <p>
              L'ensemble des éléments de l'Application (code, interface, identité visuelle, nom de
              marque, personnage Elïa, textes, fonctionnalités) est la propriété exclusive de l'Éditeur
              et est protégé par le droit de la propriété intellectuelle. Toute reproduction,
              modification ou exploitation non autorisée est strictement interdite.
            </p>
          </Sub>
          <Sub title="6.2 Contenu utilisateur">
            <p style={{ marginBottom: 8 }}>
              L'Utilisateur conserve la propriété de ses données personnelles et du contenu de ses
              conversations. En utilisant le Service, il accorde à l'Éditeur un droit d'utilisation
              limité et non exclusif de ces données, dans le seul but de fournir le Service
              (notamment pour alimenter la mémoire d'Elïa et assurer la continuité de l'accompagnement).
            </p>
            <p>
              Ce droit prend fin à la suppression du compte. Les conversations ne sont{" "}
              <strong>jamais</strong> utilisées pour entraîner des modèles d'intelligence artificielle
              tiers sans consentement explicite de l'Utilisateur.
            </p>
          </Sub>
        </Section>

        {/* Art. 7 — Responsabilité */}
        <Section num="7" title="Responsabilité">
          <Sub title="7.1 Limitation de responsabilité de l'Éditeur">
            <p style={{ marginBottom: 6 }}>
              Le Service est fourni <strong>"en l'état"</strong> et l'Éditeur ne garantit pas :
            </p>
            <Li>Une disponibilité continue et ininterrompue du Service</Li>
            <Li>L'absence d'erreurs dans les réponses d'Elïa</Li>
            <Li>L'adéquation des conseils fournis à la situation spécifique de l'Utilisateur</Li>
          </Sub>
          <Sub title="7.2 Responsabilité médicale">
            <p style={{ marginBottom: 8 }}>
              <strong>L'Éditeur ne saurait être tenu responsable des conséquences médicales,
              psychiatriques ou thérapeutiques de l'utilisation du Service.</strong>
            </p>
            <p>
              Le Service ne se substitue pas à une consultation médicale ou à un suivi thérapeutique.
              L'Utilisateur est seul responsable de la décision de consulter ou non un professionnel
              de santé.
            </p>
          </Sub>
          <Sub title="7.3 Force majeure">
            <p>
              L'Éditeur ne saurait être tenu responsable en cas de manquement à ses obligations
              résultant d'un cas de force majeure tel que défini par la jurisprudence française.
            </p>
          </Sub>
        </Section>

        {/* Art. 8 — Gestion des crises */}
        <Section num="8" title="Gestion des situations de crise">
          <Sub title="8.1 Modération automatique">
            <p>
              L'Application intègre un système de détection automatique des situations de crise,
              notamment les expressions suicidaires, les signaux de violence, ou tout danger immédiat
              pour l'Utilisateur ou des tiers. En cas de détection, Elïa redirige l'Utilisateur vers
              les ressources d'urgence appropriées.
            </p>
          </Sub>
          <Sub title="8.2 Numéros d'urgence">
            <p style={{ marginBottom: 8 }}>
              Accessibles en permanence depuis l'Application, sans quota ni abonnement :
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "6px 16px",
              fontSize: 13,
            }}>
              {[
                ["15", "SAMU"],
                ["17", "Police secours"],
                ["18", "Pompiers"],
                ["112", "Numéro d'urgence européen"],
                ["3114", "Prévention du suicide"],
                ["119", "Enfance en danger"],
                ["3919", "Violences femmes info"],
              ].map(([num, label]) => (
                <>
                  <span key={`n-${num}`} style={{ fontWeight: 600, color: "var(--ink)" }}>{num}</span>
                  <span key={`l-${num}`} style={{ color: "var(--ink-soft)" }}>{label}</span>
                </>
              ))}
            </div>
          </Sub>
          <Sub title="8.3 Absence de responsabilité d'urgence">
            <p>
              L'Application n'est pas un service d'urgence. En cas d'urgence vitale, l'Utilisateur
              doit contacter directement les services d'urgence compétents (15, 17, 18, 112).
            </p>
          </Sub>
        </Section>

        {/* Art. 9 — Suspension et résiliation */}
        <Section num="9" title="Suspension et résiliation">
          <Sub title="9.1 Résiliation par l'Utilisateur">
            <p style={{ marginBottom: 8 }}>
              L'Utilisateur peut clôturer son compte à tout moment depuis les paramètres de l'Application
              (Réglages → Compte → Supprimer mon compte) ou en contactant l'Éditeur à{" "}
              <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
                contact@{NOM_DOMAINE}
              </a>.
            </p>
            <p>
              La suppression du compte entraîne la suppression définitive de toutes les données dans
              un délai de 30 jours, sous réserve des obligations légales de conservation.
            </p>
          </Sub>
          <Sub title="9.2 Suspension par l'Éditeur">
            <p style={{ marginBottom: 6 }}>
              L'Éditeur se réserve le droit de suspendre ou de résilier l'accès d'un Utilisateur en cas de :
            </p>
            <Li>Violation des présentes CGU</Li>
            <Li>Utilisation frauduleuse ou abusive du Service</Li>
            <Li>Non-paiement de l'abonnement</Li>
            <Li>Comportement mettant en danger d'autres utilisateurs ou l'intégrité du Service</Li>
            <p style={{ marginTop: 8 }}>
              L'Utilisateur est informé de la suspension par email, sauf en cas d'urgence ou de fraude avérée.
            </p>
          </Sub>
        </Section>

        {/* Art. 10 — Modification du Service */}
        <Section num="10" title="Modification du Service et des CGU">
          <Sub title="10.1 Évolution du Service">
            <p>
              L'Éditeur se réserve le droit de modifier, d'améliorer ou de suspendre tout ou partie
              du Service, à tout moment et sans préavis, notamment pour des raisons techniques ou de
              sécurité. Les fonctionnalités Premium "à venir" (insights, rapports, guides personnalisés)
              seront ajoutées dans les versions ultérieures et ne donnent pas droit à une modification
              rétroactive du prix de l'abonnement.
            </p>
          </Sub>
          <Sub title="10.2 Évolution des CGU">
            <p>
              En cas de modification substantielle, l'Utilisateur est informé par email et/ou
              notification dans l'Application <strong>au moins 30 jours</strong> avant l'entrée en
              vigueur des modifications. La poursuite de l'utilisation du Service après cette date
              vaut acceptation des nouvelles CGU.
            </p>
          </Sub>
        </Section>

        {/* Art. 11 — Droit applicable */}
        <Section num="11" title="Droit applicable et juridiction">
          <p>
            Les présentes CGU sont soumises au <strong>droit français</strong>. En cas de litige,
            les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera soumis
            aux juridictions compétentes du ressort de Limoges, sauf disposition légale contraire
            applicable aux consommateurs.
          </p>
        </Section>

        {/* Art. 12 — Contact */}
        <Section num="12" title="Contact">
          <p style={{ marginBottom: 6 }}>Pour toute question relative aux présentes CGU :</p>
          <p>
            <strong>Email : </strong>
            <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
              contact@{NOM_DOMAINE}
            </a>
          </p>
          <p style={{ marginTop: 4 }}>
            <strong>Adresse : </strong>Salomé De Angeli, 17 avenue de Naugeat, 87000 Limoges, France
          </p>
        </Section>

        {/* Footer */}
        <p style={{
          textAlign: "center", fontSize: 11,
          color: "var(--ink-faint)", fontStyle: "italic", marginTop: 8,
        }}>
          NERA · Limoges, France · Ces CGU sont soumises au droit français.
        </p>

      </div>
    </motion.div>
  );
}
