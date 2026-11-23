-- ============================================================================
-- Valoraciones de canciones con estrellas (1 a 5).
--
-- - Cada usuario tiene como máximo una valoración por canción (la puede
--   cambiar o quitar).
-- - Cada usuario solo puede leer y escribir su propia valoración; la media y
--   el total públicos se obtienen con get_song_rating(), que solo devuelve
--   agregados.
-- ============================================================================

create table if not exists public.song_ratings (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating smallint not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  constraint song_ratings_rating_check check (rating between 1 and 5),
  constraint song_ratings_unique unique (song_id, user_id)
);

comment on table public.song_ratings is 'Valoración (1-5 estrellas) de cada usuario a una canción';

-- song_id ya está indexado por la restricción única (columna inicial).
create index if not exists idx_song_ratings_user_id
  on public.song_ratings (user_id);

drop trigger if exists trg_song_ratings_updated_at on public.song_ratings;
create trigger trg_song_ratings_updated_at
  before update on public.song_ratings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- RLS: cada usuario gestiona solo su valoración.
-- ----------------------------------------------------------------------------
alter table public.song_ratings enable row level security;

drop policy if exists "ratings_select_own" on public.song_ratings;
drop policy if exists "ratings_insert_own" on public.song_ratings;
drop policy if exists "ratings_update_own" on public.song_ratings;
drop policy if exists "ratings_delete_own" on public.song_ratings;

create policy "ratings_select_own" on public.song_ratings
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "ratings_insert_own" on public.song_ratings
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "ratings_update_own" on public.song_ratings
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "ratings_delete_own" on public.song_ratings
  for delete to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.song_ratings from anon;
grant select, insert, update, delete on public.song_ratings to authenticated;

-- ----------------------------------------------------------------------------
-- get_song_rating: media y número de valoraciones (público).
-- ----------------------------------------------------------------------------
create or replace function public.get_song_rating(p_song_id uuid)
returns table (average numeric, total bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce(round(avg(rating)::numeric, 2), 0),
    count(*)
  from public.song_ratings
  where song_id = p_song_id;
$$;

revoke execute on function public.get_song_rating(uuid) from public;
grant execute on function public.get_song_rating(uuid) to anon, authenticated;
