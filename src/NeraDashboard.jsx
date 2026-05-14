import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Check, Circle, Clock, AlertCircle, Sparkles,
  Code, Shield, Megaphone, Users, Target, BookOpen,
  ChevronRight, ChevronDown, Zap, Lock, TrendingUp,
  MessageCircle, Settings, FileText, Palette, Compass
} from 'lucide-react';

export default function NeraDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedPhase, setExpandedPhase] = useState(null);

  const sections = [
    { id: 'overview',  label: 'Vue',       icon: Compass     },
    { id: 'phases',    label: 'Phases',    icon: TrendingUp  },
    { id: 'concepts',  label: 'Concepts',  icon: BookOpen    },
    { id: 'actions',   label: 'Actions',   icon: Target      },
    { id: 'decisions', label: 'Décisions', icon: FileText    },
  ];

  const phases = [
    {
      id: 1,
      title: 'Vision & Positionnement',
      status: 'done',
      progress: 100,
      items: [
        { label: 'Pivot stratégique multiples',       done: true  },
        { label: 'Founder-market fit validé',         done: true  },
        { label: 'Marché ciblé ~90k familles',        done: true  },
        { label: 'Document "Étape 1" produit',        done: true  },
      ]
    },
    {
      id: 2,
      title: 'Prompt Elïa V2',
      status: 'done',
      progress: 100,
      items: [
        { label: 'Bloc 1 — Identité (V5)',            done: true  },
        { label: 'Bloc 2 — Contexte famille (V2)',    done: true  },
        { label: 'Bloc 3 — Mission & SOS (V2)',       done: true  },
        { label: 'Bloc 4 — Règles & mémoire (V2)',    done: true  },
        { label: 'Bloc 5 — Monétisation (V2)',        done: true  },
      ]
    },
    {
      id: 3,
      title: 'Modèle économique',
      status: 'done',
      progress: 100,
      items: [
        { label: 'Gratuit 10 msg/j + Présence SOS',             done: true  },
        { label: 'Essai premium 7 jours',                        done: true  },
        { label: 'Tarif fondateur 9,99€ (100 premières)',        done: true  },
        { label: 'Tarif public 12,99€',                          done: true  },
      ]
    },
    {
      id: 4,
      title: 'Cadrage produit',
      status: 'pending',
      progress: 0,
      items: [
        { label: 'Phrase de positionnement finale',              done: false },
        { label: 'Flow utilisateur écran par écran',             done: false },
        { label: 'Features V1 vs V2 définies',                   done: false },
        { label: 'Ressenti attendu 24h/7j/30j',                  done: false },
        { label: 'Définition du "Done" V1',                      done: false },
      ]
    },
    {
      id: 5,
      title: 'Documents légaux',
      status: 'pending',
      progress: 0,
      items: [
        { label: 'Mentions légales',                             done: false },
        { label: 'Disclaimer non-médical',                       done: false },
        { label: 'Politique de confidentialité / RGPD',          done: false },
        { label: 'CGU',                                          done: false },
        { label: 'CGV',                                          done: false },
      ]
    },
    {
      id: 6,
      title: 'Naming final',
      status: 'deferred',
      progress: 0,
      items: [
        { label: 'Nom NERA en place',                            done: true  },
        { label: 'Validation testeuses bêta',                    done: false },
        { label: 'Dépôt INPI',                                   done: false },
      ]
    },
    {
      id: 7,
      title: 'Tech & Produit',
      status: 'pending',
      progress: 15,
      items: [
        { label: 'Stack clarifiée (Supabase/Vercel)',             done: true  },
        { label: 'Architecture multi-enfants',                   done: false },
        { label: 'Système quotas & mémoire',                     done: false },
        { label: 'Intégration Stripe',                           done: false },
      ]
    },
    {
      id: 8,
      title: 'Validation terrain',
      status: 'pending',
      progress: 0,
      items: [
        { label: 'Questionnaire Google Forms',                   done: false },
        { label: '10 interviews mamans de jumeaux',              done: false },
        { label: 'Béta fermée 30-50 testeuses',                  done: false },
      ]
    },
    {
      id: 9,
      title: 'Lancement public',
      status: 'deferred',
      progress: 0,
      items: [
        { label: 'Waitlist active',                              done: false },
        { label: 'Contenu fondatrice',                           done: false },
        { label: 'Compteur 100 fondatrices',                     done: false },
      ]
    },
  ];

  const concepts = [
    {
      icon: '🖥️',
      title: 'Le FRONT',
      subtitle: "Ce que l'utilisateur voit",
      desc: "L'interface. Tout ce qui s'affiche : écrans, boutons, chat, animations.",
      tech: 'React / Next.js • hébergé sur Vercel'
    },
    {
      icon: '⚙️',
      title: 'Le BACK',
      subtitle: 'Le cerveau invisible',
      desc: "Tout ce qui tourne en coulisses : stockage, IA, paiement, quotas, sécurité.",
      tech: 'Supabase Frankfurt (RGPD) • Node.js'
    },
    {
      icon: '🤖',
      title: "L'IA (Elïa)",
      subtitle: 'Le moteur conversationnel',
      desc: "Claude qui anime Elïa via API. Les 5 blocs du prompt = sa personnalité.",
      tech: 'API Anthropic • claude-sonnet-4'
    },
    {
      icon: '🔑',
      title: "L'AUTH",
      subtitle: 'Authentification',
      desc: "Création de compte, connexion, mot de passe, sécurité.",
      tech: 'Supabase Auth (intégré)'
    },
    {
      icon: '💳',
      title: 'PAIEMENT',
      subtitle: 'Stripe',
      desc: "Essai 7j, abonnement, résiliation auto, factures, TVA.",
      tech: 'Stripe + Customer Portal'
    },
    {
      icon: '⚖️',
      title: 'RGPD',
      subtitle: 'Cadre légal européen',
      desc: "Tu traites des données de santé = catégorie max RGPD. Rigueur obligatoire.",
      tech: 'Article 9 du RGPD'
    },
  ];

  const differenciation = [
    {
      icon: '👩‍👧‍👧',
      title: 'Founder-market fit',
      desc: 'Maman de jumelles. Personne ne peut copier ça.'
    },
    {
      icon: '⚡',
      title: 'Simultanéité',
      desc: '2 bébés qui pleurent, charge mentale doublée, isolement spécifique.'
    },
    {
      icon: '📚',
      title: 'Spécialisation éditoriale',
      desc: 'Allaitement multiple, cotétées, identité duo/trio, aîné singleton.'
    },
    {
      icon: '🛡️',
      title: 'Éthique non négociable',
      desc: "Jamais de premium en SOS/DPP. Numéros d'urgence toujours hors quota."
    },
    {
      icon: '📖',
      title: 'Narrative fondatrice',
      desc: '"J\'ai construit l\'app que je n\'ai pas trouvée pour mes filles."'
    },
  ];

  const actions = {
    urgent: [
      'Cadrage produit complet (gaps 1 à 5)',
      'Rédaction des 5 documents légaux',
      'Création projet Supabase Frankfurt',
      'Liste groupes Facebook parents multiples',
    ],
    important: [
      'Questionnaire Google Forms de validation',
      '10 interviews mamans de jumeaux',
      'Configuration Stripe complète',
      'Intégration prompt Elïa V2 dans le code',
      'Relecture docs légaux par avocat',
    ],
    venir: [
      'Trancher le nom final avec testeuses',
      'Dépôt marque INPI',
      'Béta fermée 30-50 testeuses',
      'Construction waitlist',
      'Lancement public',
    ]
  };

  const decisions = [
    { label: 'Pivot stratégique',  value: 'Niche multiples francophone'                        },
    { label: 'Nom IA',             value: 'Elïa (dédicace Ella + Daïa)'                        },
    { label: 'Nom marque',         value: 'NERA'                                                },
    { label: 'Statut juridique',   value: 'Micro-entreprise'                                    },
    { label: 'Distribution',       value: 'Web + App Store + Google Play'                       },
    { label: 'Âge minimum',        value: '16 ans'                                              },
    { label: 'Stack front',        value: 'React / Next.js sur Vercel'                          },
    { label: 'Stack back',         value: 'Supabase Frankfurt'                                  },
    { label: 'IA',                 value: 'Claude Sonnet 4'                                     },
    { label: 'Paiement',           value: 'Stripe'                                              },
    { label: 'Gratuit',            value: '10 msg/jour + Présence SOS'                         },
    { label: 'Essai premium',      value: '7 jours offerts'                                     },
    { label: 'Prix fondateur',     value: '9,99€/mois ou 79€/an (100 premières, locked-in)'   },
    { label: 'Prix public',        value: '12,99€/mois ou 89€/an'                              },
    { label: 'Cap technique',      value: '500 msg/jour anti-abus'                              },
  ];

  const statusColors = {
    done:     'from-emerald-400/20 to-emerald-600/10 border-emerald-500/30 text-emerald-700',
    pending:  'from-amber-400/20  to-amber-600/10  border-amber-500/30  text-amber-700',
    deferred: 'from-slate-400/20  to-slate-600/10  border-slate-500/30  text-slate-600',
  };

  const statusLabel = {
    done:     'Validé',
    pending:  'En cours',
    deferred: 'Plus tard',
  };

  const totalProgress = Math.round(
    phases.reduce((acc, p) => acc + p.progress, 0) / phases.length
  );

  return (
    <div className="min-h-screen w-full" style={{
      background: 'linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 50%, #E8DFD3 100%)',
      fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        .body-font    { font-family: 'Inter', system-ui, sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', Georgia, serif; }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(212,165,116,0.3) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        .grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
        }
      `}</style>

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="px-5 pt-8 pb-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-stone-400"></div>
            <span className="body-font text-xs tracking-[0.25em] text-stone-500 uppercase">Projet</span>
          </div>
          <h1 className="display-font text-5xl font-medium text-stone-800 leading-none tracking-tight">
            NERA
          </h1>
          <p className="body-font text-xs text-stone-500 mt-2 italic">
            nom à valider avec les testeuses
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 p-4 rounded-2xl backdrop-blur-sm relative overflow-hidden grain"
          style={{
            background: 'linear-gradient(135deg, rgba(212,165,116,0.12) 0%, rgba(232,180,145,0.08) 100%)',
            border: '1px solid rgba(212,165,116,0.25)'
          }}
        >
          <div className="absolute top-2 right-2">
            <Heart className="w-4 h-4 text-amber-700/40" fill="currentColor" />
          </div>
          <p className="display-font text-lg leading-snug text-stone-700 italic">
            "L'app pensée pour les parents de jumeaux et multiples,
            <span className="text-amber-800"> avec Elïa</span>,
            une présence qui comprend leur réalité."
          </p>
        </motion.div>

        {/* Progress global */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <div className="flex items-baseline justify-between mb-2">
            <span className="body-font text-xs tracking-widest text-stone-500 uppercase">Avancement global</span>
            <span className="display-font text-2xl font-semibold text-stone-800">{totalProgress}%</span>
          </div>
          <div className="h-1.5 bg-stone-200/60 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full relative"
              style={{ background: 'linear-gradient(90deg, #C49570 0%, #D4A574 50%, #E8B491 100%)' }}
            >
              <div className="absolute inset-0 shimmer"></div>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 px-5 py-3 backdrop-blur-xl" style={{
        background: 'rgba(250,247,242,0.85)',
        borderBottom: '1px solid rgba(212,165,116,0.15)'
      }}>
        <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`body-font flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeSection === s.id
                    ? 'text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                style={activeSection === s.id
                  ? { background: 'linear-gradient(135deg, #8B6F47 0%, #A07955 100%)' }
                  : { background: 'rgba(255,255,255,0.5)' }
                }
              >
                <Icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Content ──────────────────────────────────────────────── */}
      <main className="px-5 py-6 pb-24">
        <AnimatePresence mode="wait">

          {/* VUE D'ENSEMBLE */}
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="display-font text-3xl font-medium text-stone-800 mb-1">Vue d'ensemble</h2>
                <p className="body-font text-sm text-stone-500 italic">Où tu en es, en un coup d'œil</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: 'Phases validées', value: '3', total: '9', color: '#5B8A6B' },
                  { label: 'En cours',         value: '3', total: '9', color: '#C49570' },
                  { label: 'À venir',          value: '3', total: '9', color: '#8B7E92' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3.5 rounded-2xl backdrop-blur-sm"
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(212,165,116,0.15)'
                    }}
                  >
                    <div className="flex items-baseline gap-1">
                      <span className="display-font text-3xl font-semibold" style={{ color: stat.color }}>
                        {stat.value}
                      </span>
                      <span className="body-font text-xs text-stone-400">/{stat.total}</span>
                    </div>
                    <p className="body-font text-[10px] uppercase tracking-wider text-stone-500 mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Différenciation */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <h3 className="body-font text-xs uppercase tracking-[0.2em] text-stone-600 font-medium">
                    Ta différenciation
                  </h3>
                </div>
                <div className="space-y-2">
                  {differenciation.map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-3.5 rounded-xl flex gap-3 items-start"
                      style={{
                        background: 'rgba(255,255,255,0.45)',
                        border: '1px solid rgba(212,165,116,0.18)'
                      }}
                    >
                      <span className="text-2xl mt-0.5">{d.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="display-font text-base font-medium text-stone-800 leading-tight">
                          {d.title}
                        </p>
                        <p className="body-font text-xs text-stone-600 mt-1 leading-relaxed">
                          {d.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Frontière critique */}
              <div className="p-4 rounded-2xl relative overflow-hidden grain" style={{
                background: 'linear-gradient(135deg, rgba(91,138,107,0.10) 0%, rgba(91,138,107,0.04) 100%)',
                border: '1px solid rgba(91,138,107,0.25)'
              }}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-emerald-800" />
                  <h3 className="body-font text-xs uppercase tracking-[0.2em] text-emerald-900 font-medium">
                    Frontière critique
                  </h3>
                </div>
                <p className="display-font text-lg text-stone-800 italic leading-snug mb-3">
                  Soutien émotionnel
                  <span className="text-emerald-800 font-medium"> ≠ </span>
                  Santé mentale médicale
                </p>
                <p className="body-font text-xs text-stone-600 leading-relaxed">
                  Elïa accompagne. Elle ne diagnostique pas, ne prescrit pas, ne se substitue pas.
                  En cas de signal critique → redirection vers le bon professionnel.
                </p>
              </div>
            </motion.div>
          )}

          {/* PHASES */}
          {activeSection === 'phases' && (
            <motion.div
              key="phases"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="display-font text-3xl font-medium text-stone-800 mb-1">Les 9 phases</h2>
                <p className="body-font text-sm text-stone-500 italic">Du concept jusqu'au lancement</p>
              </div>

              <div className="space-y-2.5">
                {phases.map((phase, i) => (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl overflow-hidden backdrop-blur-sm"
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(212,165,116,0.2)'
                    }}
                  >
                    <button
                      onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${statusColors[phase.status]} border`}>
                          {phase.status === 'done'     && <Check  className="w-4 h-4" />}
                          {phase.status === 'pending'  && <Clock  className="w-4 h-4" />}
                          {phase.status === 'deferred' && <Circle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="display-font text-base font-medium text-stone-800 truncate">
                              {phase.id}. {phase.title}
                            </h3>
                            <ChevronDown
                              className={`w-4 h-4 text-stone-400 transition-transform flex-shrink-0 ${
                                expandedPhase === phase.id ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1 bg-stone-200/60 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${phase.progress}%`,
                                  background: phase.status === 'done'
                                    ? 'linear-gradient(90deg, #5B8A6B 0%, #6FAD83 100%)'
                                    : phase.status === 'pending'
                                    ? 'linear-gradient(90deg, #C49570 0%, #D4A574 100%)'
                                    : 'linear-gradient(90deg, #8B7E92 0%, #9D8FA3 100%)'
                                }}
                              ></div>
                            </div>
                            <span className="body-font text-[10px] text-stone-500 font-medium tabular-nums">
                              {phase.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedPhase === phase.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1 space-y-1.5 border-t border-stone-200/40">
                            {phase.items.map((item, j) => (
                              <div key={j} className="flex items-start gap-2.5 py-1">
                                <div className="flex-shrink-0 mt-0.5">
                                  {item.done ? (
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{
                                      background: 'linear-gradient(135deg, #5B8A6B 0%, #6FAD83 100%)'
                                    }}>
                                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </div>
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-stone-300"></div>
                                  )}
                                </div>
                                <span className={`body-font text-xs leading-relaxed ${
                                  item.done ? 'text-stone-400 line-through' : 'text-stone-700'
                                }`}>
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CONCEPTS */}
          {activeSection === 'concepts' && (
            <motion.div
              key="concepts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="display-font text-3xl font-medium text-stone-800 mb-1">Les concepts clés</h2>
                <p className="body-font text-sm text-stone-500 italic">
                  Comprendre la tech sans devenir ingénieure
                </p>
              </div>

              <div className="space-y-3">
                {concepts.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="p-4 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.55)',
                      border: '1px solid rgba(212,165,116,0.2)'
                    }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-3xl leading-none mt-0.5">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="display-font text-xl font-medium text-stone-800 leading-tight">
                          {c.title}
                        </h3>
                        <p className="body-font text-xs text-amber-800 italic mt-0.5">
                          {c.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="body-font text-sm text-stone-700 leading-relaxed mb-2.5">
                      {c.desc}
                    </p>
                    <div className="inline-block px-2.5 py-1 rounded-full" style={{
                      background: 'rgba(212,165,116,0.12)',
                      border: '1px solid rgba(212,165,116,0.25)'
                    }}>
                      <p className="body-font text-[10px] tracking-wide text-amber-900 font-medium">
                        {c.tech}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ACTIONS */}
          {activeSection === 'actions' && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="display-font text-3xl font-medium text-stone-800 mb-1">Actions prioritaires</h2>
                <p className="body-font text-sm text-stone-500 italic">Ce qui compte vraiment maintenant</p>
              </div>

              {[
                {
                  title: 'Urgent — cette semaine',
                  items: actions.urgent,
                  color: '#C44F4F',
                  bg: 'rgba(196,79,79,0.08)',
                  border: 'rgba(196,79,79,0.25)',
                  icon: Zap
                },
                {
                  title: 'Important — ce mois',
                  items: actions.important,
                  color: '#C49570',
                  bg: 'rgba(212,165,116,0.10)',
                  border: 'rgba(212,165,116,0.3)',
                  icon: Target
                },
                {
                  title: 'À venir — prochains mois',
                  items: actions.venir,
                  color: '#5B8A6B',
                  bg: 'rgba(91,138,107,0.08)',
                  border: 'rgba(91,138,107,0.25)',
                  icon: TrendingUp
                },
              ].map((group, i) => {
                const Icon = group.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-2xl"
                    style={{ background: group.bg, border: `1px solid ${group.border}` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-4 h-4" style={{ color: group.color }} />
                      <h3 className="body-font text-xs uppercase tracking-[0.2em] font-medium" style={{ color: group.color }}>
                        {group.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {group.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 w-1 h-1 rounded-full mt-2" style={{ background: group.color }}></div>
                          <span className="body-font text-sm text-stone-700 leading-relaxed flex-1">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* DÉCISIONS */}
          {activeSection === 'decisions' && (
            <motion.div
              key="decisions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="display-font text-3xl font-medium text-stone-800 mb-1">Décisions actées</h2>
                <p className="body-font text-sm text-stone-500 italic">Ce qui est verrouillé, on ne revient plus dessus</p>
              </div>

              <div className="space-y-2">
                {decisions.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-3 rounded-xl flex items-center gap-3"
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(212,165,116,0.18)'
                    }}
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-800/60 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="body-font text-[10px] uppercase tracking-wider text-stone-500 leading-none">
                        {d.label}
                      </p>
                      <p className="body-font text-sm text-stone-800 mt-1 leading-tight">
                        {d.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="px-5 pb-6 pt-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{
            background: 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(212,165,116,0.2)'
          }}>
            <Heart className="w-3 h-3 text-amber-700/60" fill="currentColor" />
            <span className="body-font text-[10px] text-stone-600 tracking-wide">
              Pour Ella & Daïa · Mai 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
