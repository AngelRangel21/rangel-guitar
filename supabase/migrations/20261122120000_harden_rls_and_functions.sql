-- ============================================================================
-- Endurece RLS y funciones de la base de datos.
--
-- Corrige:
--   1. Escalada a admin: la política ALL "Los usuarios pueden actualizar su
--      propio perfil" dejaba a cada usuario cambiarse el rol.
--   2. Escritura anónima en songs, artists y roles (políticas ALL con
--      USING (true)).
--   3. toggle_song_like / toggle_song_favorite aceptaban cualquier p_user_id.
--   4. increment_song_counter (SQL dinámico SECURITY DEFINER) y
--      update_like_count, ya sin uso.
--   5. songs_requests: insert anónimo con cualquier user_id, y sin lectura de
--      las solicitudes propias.
--   6. users_select_own_or_admin miraba el rol de la fila, no el de quien lee.
--   7. song_visits: insert con cualquier user_id.
--   8. users_update_own solo permitía role = 'user' (bloqueaba a moderadores).
--   9. Contadores y autores de comentarios invisibles por RLS: nuevas
--      funciones get_song_stats y get_song_comments.
--
-- Todas las sentencias son idempotentes (drop ... if exists / create or
-- replace), así que se puede volver a ejecutar sin error.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- is_admin(): SECURITY DEFINER para poder usarla dentro de las políticas de
-- `users` sin recursión y evaluarla una sola vez por consulta.
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users
    where uid = (select auth.uid())
      and role = 'admin'
  );
$$;

-- anon también la necesita: la evalúan políticas que se aplican a anon (p. ej.
-- visits_select_admin) y para anon siempre devuelve false.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- Rol del usuario actual, para que las políticas de `users` puedan comprobar
-- que nadie se cambia su propio rol sin leer la tabla bajo RLS.
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.users where uid = (select auth.uid());
$$;

revoke execute on function public.current_user_role() from public, anon;
grant execute on function public.current_user_role() to authenticated, service_role;

-- ----------------------------------------------------------------------------
-- songs
-- ----------------------------------------------------------------------------
drop policy if exists "Enable read access for all users" on public.songs;
drop policy if exists "songs_select_all" on public.songs;
drop policy if exists "songs_insert_admin" on public.songs;
drop policy if exists "songs_update_admin" on public.songs;
drop policy if exists "songs_delete_admin" on public.songs;

-- Lectura pública igual que antes (incluye canciones no publicadas: la app
-- filtra por "isPublished" en las consultas).
create policy "songs_select_all" on public.songs
  for select using (true);

create policy "songs_insert_admin" on public.songs
  for insert to authenticated with check ((select public.is_admin()));

create policy "songs_update_admin" on public.songs
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "songs_delete_admin" on public.songs
  for delete to authenticated using ((select public.is_admin()));

-- ----------------------------------------------------------------------------
-- artists
-- ----------------------------------------------------------------------------
drop policy if exists "Enable read access for all users" on public.artists;
drop policy if exists "artists_select_all" on public.artists;
drop policy if exists "artists_insert_admin" on public.artists;
drop policy if exists "artists_update_admin" on public.artists;
drop policy if exists "artists_delete_admin" on public.artists;

create policy "artists_select_all" on public.artists
  for select using (true);

create policy "artists_insert_admin" on public.artists
  for insert to authenticated with check ((select public.is_admin()));

create policy "artists_update_admin" on public.artists
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "artists_delete_admin" on public.artists
  for delete to authenticated using ((select public.is_admin()));

-- ----------------------------------------------------------------------------
-- songs_artists (solo tenía SELECT: el admin no podía asociar artistas desde
-- el cliente)
-- ----------------------------------------------------------------------------
drop policy if exists "songs_artists_insert_admin" on public.songs_artists;
drop policy if exists "songs_artists_update_admin" on public.songs_artists;
drop policy if exists "songs_artists_delete_admin" on public.songs_artists;

create policy "songs_artists_insert_admin" on public.songs_artists
  for insert to authenticated with check ((select public.is_admin()));

create policy "songs_artists_update_admin" on public.songs_artists
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "songs_artists_delete_admin" on public.songs_artists
  for delete to authenticated using ((select public.is_admin()));

create index if not exists idx_songs_artists_song_id
  on public.songs_artists (song_id);
create index if not exists idx_songs_artists_artist_id
  on public.songs_artists (artist_id);

-- ----------------------------------------------------------------------------
-- roles
-- ----------------------------------------------------------------------------
drop policy if exists "Los roles son visibles para todos" on public.roles;
drop policy if exists "Solo admin pueden modificar roles" on public.roles;
drop policy if exists "roles_select_all" on public.roles;
drop policy if exists "roles_write_admin" on public.roles;

create policy "roles_select_all" on public.roles
  for select using (true);

create policy "roles_write_admin" on public.roles
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ----------------------------------------------------------------------------
-- users
-- ----------------------------------------------------------------------------
drop policy if exists "Los usuarios pueden actualizar su propio perfil" on public.users;
drop policy if exists "users_select_own_or_admin" on public.users;
drop policy if exists "users_insert_own" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "users_update_admin" on public.users;
drop policy if exists "users_delete_admin" on public.users;

create policy "users_select_own_or_admin" on public.users
  for select to authenticated
  using (uid = (select auth.uid()) or (select public.is_admin()));

create policy "users_insert_own" on public.users
  for insert to authenticated
  with check (uid = (select auth.uid()) and role = 'user');

-- El usuario edita su perfil pero no puede cambiar su rol: el nuevo valor
-- debe ser igual al actual.
create policy "users_update_own" on public.users
  for update to authenticated
  using (uid = (select auth.uid()))
  with check (
    uid = (select auth.uid())
    and role = (select public.current_user_role())
  );

create policy "users_update_admin" on public.users
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "users_delete_admin" on public.users
  for delete to authenticated using ((select public.is_admin()));

-- Los triggers de auth.users no deben depender del search_path.
create or replace function public.handle_update_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.users
  set
    email = new.email,
    name = coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    avatar_url = coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      null
    )
  where uid = new.id;

  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- songs_requests
-- ----------------------------------------------------------------------------
drop policy if exists "Cualquiera puede pedir canciones" on public.songs_requests;
drop policy if exists "Solo Admin Pueden Ver Peticiones" on public.songs_requests;
drop policy if exists "Solo admins pueden gestionar peticiones" on public.songs_requests;
drop policy if exists "solo admin puede borrar canciones pedidas" on public.songs_requests;
drop policy if exists "requests_select_own_or_admin" on public.songs_requests;
drop policy if exists "requests_insert_own" on public.songs_requests;
drop policy if exists "requests_update_admin" on public.songs_requests;
drop policy if exists "requests_delete_admin" on public.songs_requests;

create policy "requests_select_own_or_admin" on public.songs_requests
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Solo con sesión, a su nombre y siempre como pendiente.
create policy "requests_insert_own" on public.songs_requests
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending'
    and "adminNote" is null
  );

create policy "requests_update_admin" on public.songs_requests
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "requests_delete_admin" on public.songs_requests
  for delete to authenticated using ((select public.is_admin()));

-- ----------------------------------------------------------------------------
-- song_visits: el user_id, si viene, debe ser el del usuario actual.
-- ----------------------------------------------------------------------------
drop policy if exists "visits_insert_all" on public.song_visits;

create policy "visits_insert_all" on public.song_visits
  for insert
  with check (user_id is null or user_id = (select auth.uid())::text);

-- ----------------------------------------------------------------------------
-- song_favorites: sin duplicados por usuario y canción, e índice para RLS.
-- ----------------------------------------------------------------------------
delete from public.song_favorites a
using public.song_favorites b
where a.song_id = b.song_id
  and a.user_id = b.user_id
  and a."createdAt" > b."createdAt";

delete from public.song_favorites a
using public.song_favorites b
where a.song_id = b.song_id
  and a.user_id = b.user_id
  and a."createdAt" = b."createdAt"
  and a.id > b.id;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'song_favorites_unique'
  ) then
    alter table public.song_favorites
      add constraint song_favorites_unique unique (song_id, user_id);
  end if;
end;
$$;

create index if not exists idx_song_favorites_user_id
  on public.song_favorites (user_id);

-- ----------------------------------------------------------------------------
-- toggle_song_like / toggle_song_favorite: solo para el usuario actual.
-- Se mantiene la firma para no romper la app; p_user_id debe coincidir con
-- auth.uid().
-- ----------------------------------------------------------------------------
create or replace function public.toggle_song_like(p_song_id uuid, p_user_id text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_uid text := (select auth.uid())::text;
begin
  if current_uid is null or p_user_id is distinct from current_uid then
    raise exception 'Not allowed' using errcode = '42501';
  end if;

  delete from public.song_likes
  where song_id = p_song_id and user_id = current_uid;

  if found then
    return json_build_object('liked', false);
  end if;

  insert into public.song_likes (song_id, user_id)
  values (p_song_id, current_uid)
  on conflict (song_id, user_id) do nothing;

  return json_build_object('liked', true);
end;
$$;

create or replace function public.toggle_song_favorite(p_song_id uuid, p_user_id uuid)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_uid uuid := (select auth.uid());
begin
  if current_uid is null or p_user_id is distinct from current_uid then
    raise exception 'Not allowed' using errcode = '42501';
  end if;

  delete from public.song_favorites
  where song_id = p_song_id and user_id = current_uid;

  if found then
    return json_build_object('favorited', false);
  end if;

  insert into public.song_favorites (song_id, user_id)
  values (p_song_id, current_uid)
  on conflict (song_id, user_id) do nothing;

  return json_build_object('favorited', true);
end;
$$;

revoke execute on function public.toggle_song_like(uuid, text) from public, anon;
revoke execute on function public.toggle_song_favorite(uuid, uuid) from public, anon;
grant execute on function public.toggle_song_like(uuid, text) to authenticated;
grant execute on function public.toggle_song_favorite(uuid, uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- Funciones sin uso y peligrosas.
-- ----------------------------------------------------------------------------
drop function if exists public.increment_song_counter(text, integer, uuid);
drop function if exists public.update_like_count();

-- ----------------------------------------------------------------------------
-- get_song_stats: contadores públicos de una canción. Devuelve solo
-- agregados, así que puede saltarse el RLS de visitas y favoritos.
-- ----------------------------------------------------------------------------
create or replace function public.get_song_stats(p_song_id uuid)
returns table (
  like_count bigint,
  favorite_count bigint,
  comment_count bigint,
  visit_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(*) from public.song_likes where song_id = p_song_id),
    (select count(*) from public.song_favorites where song_id = p_song_id),
    (select count(*) from public.song_comments
      where song_id = p_song_id and "isDeleted" = false),
    (select count(*) from public.song_visits where song_id = p_song_id);
$$;

revoke execute on function public.get_song_stats(uuid) from public;
grant execute on function public.get_song_stats(uuid) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- get_song_comments: comentarios visibles con nombre y avatar del autor.
-- Expone solo el nombre y el avatar (nunca el email) de quien comentó.
-- ----------------------------------------------------------------------------
create or replace function public.get_song_comments(p_song_id uuid)
returns table (
  id uuid,
  song_id uuid,
  user_id text,
  content text,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  "isDeleted" boolean,
  user_name text,
  user_avatar_url text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    c.id,
    c.song_id,
    c.user_id,
    c.content,
    c."createdAt",
    c."updatedAt",
    c."isDeleted",
    u.name,
    u.avatar_url
  from public.song_comments c
  left join public.users u on u.uid::text = c.user_id
  where c.song_id = p_song_id
    and c."isDeleted" = false
  order by c."createdAt" asc;
$$;

revoke execute on function public.get_song_comments(uuid) from public;
grant execute on function public.get_song_comments(uuid) to anon, authenticated;
