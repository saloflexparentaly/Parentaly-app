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
