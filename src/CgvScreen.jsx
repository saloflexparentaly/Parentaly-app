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

function PriceRow({ formule, tarif, engagement, header }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 8,
      padding: "8px 10px",
      borderRadius: header ? "8px 8px 0 0" : 0,
      background: header ? "var(--surface-tint)" : "transparent",
      borderBottom: "1px solid var(--surface-border-s)",
      fontSize: header ? 11 : 13,
      fontWeight: header ? 500 : 300,
      color: header ? "var(--ink-faint)" : "var(--ink-soft)",
    }}>
      <span>{formule}</span>
      <span style={{ fontWeight: header ? 500 : 600, color: header ? "var(--ink-faint)" : "var(--ink)" }}>{tarif}</span>
      <span style={{ fontSize: 11 }}>{engagement}</span>
    </div>
  );
}

function PriceTable({ rows }) {
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--surface-border-s)", marginTop: 10 }}>
      <PriceRow formule="Formule" tarif="Tarif" engagement="Engagement" header />
      {rows.map((r, i) => <PriceRow key={i} formule={r[0]} tarif={r[1]} engagement={r[2]} />)}
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function CgvScreen({ onBack }) {
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
            Conditions de vente
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
            Les présentes Conditions Générales de Vente (ci-après "CGV") s'appliquent à tous les
            achats d'abonnements à l'application <strong>NERA</strong> effectués par des Utilisateurs
            consommateurs.
          </p>
          <p style={{ marginBottom: 10 }}>
            <strong>NERA</strong> est édité par Salomé De Angeli, micro-entreprise immatriculée sous
            le SIRET 995 248 515 00018, domiciliée au 17 avenue de Naugeat, 87000 Limoges, France
            (ci-après "l'Éditeur").
          </p>
          <p>
            Toute souscription à un abonnement Premium implique l'acceptation sans réserve des présentes CGV.
          </p>
        </Section>

        {/* Art. 1 — Offres et tarifs */}
        <Section num="1" title="Offres et tarifs">
          <Sub title="1.1 Plan Gratuit">
            <p>
              L'utilisation de base de NERA est gratuite, dans les limites décrites dans les CGU
              (10 messages/jour, 1 session SOS par 24h, essai Premium de 7 jours).
            </p>
          </Sub>
          <Sub title="1.2 Essai Premium gratuit">
            <p style={{ marginBottom: 6 }}>
              Tout nouvel Utilisateur bénéficie d'un <strong>essai Premium gratuit de 7 jours</strong>{" "}
              à compter de la création de son compte. Aucun moyen de paiement n'est requis lors de
              l'inscription.
            </p>
            <p>
              À l'issue de l'essai, si l'Utilisateur ne souscrit pas d'abonnement, son compte revient
              automatiquement au Plan Gratuit.
            </p>
          </Sub>
          <Sub title="1.3 Abonnement Premium — Tarif Fondateur">
            <p style={{ marginBottom: 6 }}>
              Réservé aux <strong>100 premières inscriptions</strong> à l'abonnement Premium.
            </p>
            <PriceTable rows={[
              ["Mensuel Fondateur", "9,99 € / mois", "Mensuel, résiliable à tout moment"],
              ["Annuel Fondateur", "79,00 € / an (~6,58 €/mois)", "Annuel, résiliable à tout moment"],
            ]} />
            <p style={{ marginTop: 10 }}>
              Le tarif Fondateur est <strong>garanti à vie</strong> pour les abonnés ayant souscrit
              dans le cadre de cette offre, tant que l'abonnement reste actif sans interruption.
              En cas d'interruption et de nouvelle souscription, le tarif grand public s'applique.
            </p>
          </Sub>
          <Sub title="1.4 Abonnement Premium — Tarif Grand Public">
            <p style={{ marginBottom: 6 }}>
              Applicable à partir de la 101ᵉ souscription d'abonnement.
            </p>
            <PriceTable rows={[
              ["Mensuel", "12,99 € / mois", "Mensuel, résiliable à tout moment"],
              ["Annuel", "89,00 € / an (~7,42 €/mois)", "Annuel, résiliable à tout moment"],
            ]} />
          </Sub>
          <Sub title="1.5 Prix TTC">
            <p>
              Tous les prix sont indiqués en euros, <strong>toutes taxes comprises (TTC)</strong>.
              L'Éditeur est soumis au régime de la franchise en base de TVA (article 293 B du Code
              général des impôts). À ce titre, la TVA n'est pas applicable. Si ce régime venait à
              changer, les prix seraient ajustés en conséquence avec préavis.
            </p>
          </Sub>
        </Section>

        {/* Art. 2 — Fonctionnalités Premium */}
        <Section num="2" title="Fonctionnalités incluses dans le Plan Premium">
          <Sub title="2.1 Fonctionnalités disponibles au lancement (V1)">
            <Li>Conversations illimitées avec Elïa (cap technique de 500 messages/24h)</Li>
            <Li>Mémoire conversationnelle longue (persistance des échanges)</Li>
            <Li>Profil famille complet</Li>
            <Li>Accès permanent aux numéros d'urgence</Li>
          </Sub>
          <Sub title="2.2 Fonctionnalités en cours de développement">
            <p style={{ marginBottom: 8 }}>
              Incluses dans l'abonnement Premium, activées progressivement :
            </p>
            <Li>
              <strong>Insights multiples</strong> — analyse des patterns d'épuisement, de sommeil
              et de dynamique fraternelle (V1.1, dans les semaines suivant le lancement)
            </Li>
            <Li>
              <strong>Rapports hebdomadaires et mensuels</strong> — synthèses personnalisées de
              l'expérience parentale (V2)
            </Li>
            <Li>
              <strong>Guides personnalisés multiples</strong> — plans d'accompagnement adaptés à
              la situation spécifique de la famille (V2)
            </Li>
            <p style={{ marginTop: 8 }}>
              L'activation de ces fonctionnalités ne donnera lieu à{" "}
              <strong>aucune augmentation tarifaire</strong> pour les abonnés actifs.
            </p>
          </Sub>
        </Section>

        {/* Art. 3 — Commande et paiement */}
        <Section num="3" title="Commande et paiement">
          <Sub title="3.1 Processus de souscription">
            {[
              "L'Utilisateur se connecte à son compte",
              "Il accède à la page Abonnement",
              "Il sélectionne la formule souhaitée (mensuelle ou annuelle)",
              "Il est redirigé vers la page de paiement sécurisée de Stripe",
              "Il saisit ses informations bancaires sur la plateforme Stripe",
              "La souscription est effective après confirmation du paiement",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0, minWidth: 16 }}>{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </Sub>
          <Sub title="3.2 Moyen de paiement">
            <p style={{ marginBottom: 8 }}>
              Le paiement est effectué par <strong>carte bancaire</strong> via la plateforme
              sécurisée <strong>Stripe</strong> (Stripe Payments Europe, Ltd., 1 Grand Canal Street
              Lower, Grand Canal Dock, Dublin, D02 H210, Irlande).
            </p>
            <p>
              NERA <strong>ne stocke jamais</strong> les données bancaires de l'Utilisateur. Ces
              données sont traitées exclusivement par Stripe, certifié PCI DSS niveau 1.
            </p>
          </Sub>
          <Sub title="3.3 Renouvellement automatique">
            <p style={{ marginBottom: 6 }}>
              L'abonnement se <strong>renouvelle automatiquement</strong> à l'échéance, sauf
              résiliation. L'Utilisateur reçoit une notification par email avant chaque renouvellement :
            </p>
            <Li>Abonnement mensuel : notification 3 jours avant le prélèvement</Li>
            <Li>Abonnement annuel : notification 30 jours avant le prélèvement</Li>
          </Sub>
          <Sub title="3.4 Échec de paiement">
            <p>
              En cas d'échec de prélèvement, Stripe effectue plusieurs tentatives automatiques.
              L'Utilisateur est informé par email. Sans régularisation dans les 7 jours, l'abonnement
              est suspendu et le compte passe au Plan Gratuit.
            </p>
          </Sub>
        </Section>

        {/* Art. 4 — Droit de rétractation */}
        <Section num="4" title="Droit de rétractation">
          <p style={{ marginBottom: 12 }}>
            Conformément à l'article L221-18 du Code de la consommation, l'Utilisateur consommateur
            dispose d'un <strong>droit de rétractation de 14 jours</strong> à compter de la date de
            souscription de l'abonnement.
          </p>
          <Sub title="4.1 Exception — Fourniture immédiate de service numérique">
            <p style={{ marginBottom: 8 }}>
              Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation
              <strong> ne peut pas être exercé</strong> lorsque l'exécution a commencé avec l'accord
              préalable exprès du consommateur et renonciation expresse à son droit de rétractation.
            </p>
            <p style={{ marginBottom: 6 }}>
              En souscrivant un abonnement Premium et en accédant immédiatement aux fonctionnalités,
              l'Utilisateur reconnaît :
            </p>
            <Li>Demander expressément que l'exécution du contrat commence avant l'expiration du délai de rétractation</Li>
            <Li>Renoncer expressément à son droit de rétractation</Li>
            <p style={{ marginTop: 8, fontStyle: "italic", color: "var(--ink-faint)", fontSize: 12 }}>
              Cette renonciation est matérialisée par une case à cocher distincte lors de la souscription.
            </p>
          </Sub>
          <Sub title="4.2 Exercice du droit de rétractation">
            <p style={{ marginBottom: 8 }}>
              Si l'Utilisateur n'a pas coché la case de renonciation expresse, le droit de
              rétractation de 14 jours s'applique normalement. Pour l'exercer, notifier l'Éditeur à{" "}
              <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
                contact@{NOM_DOMAINE}
              </a>{" "}
              avant l'expiration du délai.
            </p>
            <p>
              En cas de rétractation valide, le remboursement intervient dans les{" "}
              <strong>14 jours</strong> suivant la réception de la notification, par le même moyen
              de paiement.
            </p>
          </Sub>
        </Section>

        {/* Art. 5 — Résiliation */}
        <Section num="5" title="Résiliation">
          <Sub title="5.1 Résiliation par l'Utilisateur">
            <p style={{ marginBottom: 6 }}>
              L'Utilisateur peut résilier son abonnement à tout moment, sans frais ni pénalité, depuis :
            </p>
            <Li>L'application : Réglages → Abonnement → Gérer mon abonnement → Résilier</Li>
            <Li>Le portail Stripe : accessible via le lien envoyé par email</Li>
            <div style={{
              marginTop: 10,
              padding: "10px 12px",
              background: "var(--surface-tint)",
              borderRadius: 10,
              border: "1px solid var(--surface-border-s)",
              fontSize: 12,
            }}>
              <p style={{ marginBottom: 6 }}>
                <strong>Formule mensuelle :</strong> la résiliation prend effet à la fin de la période
                mensuelle en cours. L'accès Premium est conservé jusqu'au terme payé.
              </p>
              <p>
                <strong>Formule annuelle :</strong> la résiliation prend effet à la fin de la période
                annuelle en cours. Aucun remboursement au prorata, sauf Article 5.3.
              </p>
            </div>
          </Sub>
          <Sub title="5.2 Résiliation par l'Éditeur">
            <p>
              L'Éditeur se réserve le droit de résilier un abonnement en cas de violation des CGU.
              L'Utilisateur est informé par email et une fraction au prorata peut être remboursée,
              à la discrétion de l'Éditeur.
            </p>
          </Sub>
          <Sub title="5.3 Arrêt du service">
            <p>
              En cas d'arrêt définitif du service NERA, l'Éditeur s'engage à en informer les abonnés
              actifs avec un <strong>préavis minimum de 30 jours</strong> et à rembourser la fraction
              au prorata de la période d'abonnement non utilisée.
            </p>
          </Sub>
        </Section>

        {/* Art. 6 — Remboursements */}
        <Section num="6" title="Remboursements">
          <p style={{ marginBottom: 8 }}>
            Hors cas de rétractation valide ou d'arrêt du service :
          </p>
          <Li>Les paiements effectués sont <strong>non remboursables</strong></Li>
          <Li>Les périodes non utilisées ne donnent lieu à aucun remboursement partiel</Li>
          <Li>En cas de litige, l'Éditeur peut accorder un geste commercial à sa discrétion</Li>
          <p style={{ marginTop: 10 }}>
            Pour toute demande de remboursement :{" "}
            <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
              contact@{NOM_DOMAINE}
            </a>
          </p>
        </Section>

        {/* Art. 7 — Modification des tarifs */}
        <Section num="7" title="Modification des tarifs">
          <p style={{ marginBottom: 8 }}>
            L'Éditeur se réserve le droit de modifier les tarifs du Plan Premium Grand Public.
            En cas de modification tarifaire :
          </p>
          <Li>Les abonnés actifs sont informés <strong>au moins 30 jours</strong> avant l'entrée en vigueur du nouveau tarif</Li>
          <Li>Les abonnés peuvent résilier avant l'entrée en vigueur sans frais</Li>
          <Li>La poursuite de l'abonnement après cette date vaut acceptation du nouveau tarif</Li>
          <p style={{ marginTop: 10, fontStyle: "italic" }}>
            <strong>Tarif Fondateur :</strong> garanti à vie tant que l'abonnement reste actif sans interruption.
          </p>
        </Section>

        {/* Art. 8 — SAV */}
        <Section num="8" title="Service après-vente et réclamations">
          <p style={{ marginBottom: 8 }}>
            Pour toute question ou réclamation relative à votre abonnement :
          </p>
          <p>
            <strong>Email : </strong>
            <a href={`mailto:contact@${NOM_DOMAINE}`} style={{ color: "var(--accent)" }}>
              contact@{NOM_DOMAINE}
            </a>
          </p>
          <p style={{ marginTop: 4 }}>
            <strong>Délai de traitement :</strong> 5 jours ouvrés maximum
          </p>
          <p style={{ marginTop: 8 }}>
            L'Éditeur s'engage à traiter toute réclamation avec diligence et bonne foi.
          </p>
        </Section>

        {/* Art. 9 — Médiation */}
        <Section num="9" title="Médiation">
          <p style={{ marginBottom: 8 }}>
            Conformément aux dispositions du Code de la consommation, l'Utilisateur peut recourir
            gratuitement au service de médiation de la consommation.
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

        {/* Art. 10 — Droit applicable */}
        <Section num="10" title="Droit applicable">
          <p>
            Les présentes CGV sont soumises au <strong>droit français</strong>. En cas de litige,
            après tentative de résolution amiable, les tribunaux du ressort de Limoges sont
            compétents, sauf disposition légale contraire applicable aux consommateurs.
          </p>
        </Section>

        {/* Art. 11 — Contact */}
        <Section num="11" title="Contact">
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
          NERA · Limoges, France · Ces CGV sont soumises au droit français.
        </p>

      </div>
    </motion.div>
  );
}
