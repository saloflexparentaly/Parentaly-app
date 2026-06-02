-- ─── NERA — Schéma Supabase ────────────────────────────────────────────────
-- À coller dans l'éditeur SQL du dashboard Supabase et exécuter une seule fois.

-- Table clé-valeur : stocke toutes les données de l'app par utilisateur
create table if not exists public.user_data (
  user_id    uuid        references auth.users(id) on delete cascade not null,
  key        text        not null,
  value      jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, key)
);

-- Index pour les requêtes fréquentes
create index if not exists user_data_user_id_idx on public.user_data (user_id);

-- Row Level Security : chaque utilisateur n'accède qu'à ses propres données
alter table public.user_data enable row level security;

create policy "Accès données propres uniquement"
  on public.user_data
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at automatiquement
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger user_data_updated_at
  before update on public.user_data
  for each row execute procedure public.handle_updated_at();

-- Sessions Stripe utilisées (anti-replay premium)
-- Accessible uniquement via service_role (backend) — pas de RLS
create table if not exists public.stripe_used_sessions (
  session_id  text        primary key,
  user_id     uuid        references auth.users(id) on delete set null,
  created_at  timestamptz default now()
);

-- Logs de consentement RGPD (art. 7 RGPD — preuve serveur, conservation 3 ans)
-- ip_hash = SHA-256 tronqué de l'IP (16 hex) — minimisation des données
create table if not exists public.consent_logs (
  id          uuid        primary key default gen_random_uuid(),
  ip_hash     text        not null,
  cgu_version text        not null default '1.0',
  user_agent  text,
  created_at  timestamptz default now()
);

-- Logs alertes crise (mots-clés dangereux détectés)
create table if not exists public.crisis_logs (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        references auth.users(id) on delete set null,
  keyword    text,
  created_at timestamptz default now()
);

-- Compteurs de rate-limiting persistants (résistants aux redémarrages serveur)
-- client_id = IP ou '__global__' pour le cap global
create table if not exists public.rate_limits (
  client_id   text        not null,
  date        text        not null,
  count       integer     not null default 0,
  updated_at  timestamptz default now(),
  primary key (client_id, date)
);
