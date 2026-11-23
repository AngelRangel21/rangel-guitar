-- ============================================================================
-- Corrige avisos del Security y Performance Advisor de Supabase.
--
--   1. Revoca EXECUTE a anon/authenticated en funciones que no deben llamarse
--      por /rest/v1/rpc (triggers y event triggers). Los triggers no
--      comprueban EXECUTE al dispararse, así que siguen funcionando.
--   2. Fija search_path en set_updated_at.
--   3. RLS de song_comments, song_likes y song_favorites con
--      (select auth.uid()) para que se evalúe una vez por consulta.
--   4. Quita políticas permisivas duplicadas en roles y users.
--   5. Índice para la FK users.role.
--
-- No cambia quién puede hacer qué: solo permisos sobrantes y rendimiento.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Funciones que no deben ser accesibles por la API
-- ----------------------------------------------------------------------------
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_update_user() from public, anon, authenticated;

-- rls_auto_enable la crea Supabase; puede no existir en otros entornos.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end
$$;

-- ----------------------------------------------------------------------------
-- 2. set_updated_at con search_path fijo
-- ----------------------------------------------------------------------------
alter function public.set_updated_at() set search_path = '';

-- ----------------------------------------------------------------------------
-- 3. Políticas con (select auth.uid())
-- ----------------------------------------------------------------------------

-- song_comments
drop policy if exists "comments_insert_own" on public.song_comments;
drop policy if exists "comments_update_own" on public.song_comments;
drop policy if exists "comments_delete_own_or_admin" on public.song_comments;

create policy "comments_insert_own" on public.song_comments
  for insert to authenticated
  with check (user_id = (select auth.uid())::text);

create policy "comments_update_own" on public.song_comments
  for update to authenticated
  using (user_id = (select auth.uid())::text)
  with check (user_id = (select auth.uid())::text);

create policy "comments_delete_own_or_admin" on public.song_comments
  for delete to authenticated
  using (user_id = (select auth.uid())::text or (select public.is_admin()));

-- song_likes
drop policy if exists "likes_insert_own" on public.song_likes;
drop policy if exists "likes_delete_own" on public.song_likes;

create policy "likes_insert_own" on public.song_likes
  for insert to authenticated
  with check (user_id = (select auth.uid())::text);

create policy "likes_delete_own" on public.song_likes
  for delete to authenticated
  using (user_id = (select auth.uid())::text);

-- song_favorites
drop policy if exists "Users can only view their own favorites" on public.song_favorites;
drop policy if exists "Users can only insert their own favorites" on public.song_favorites;
drop policy if exists "Users can only delete their own favorites" on public.song_favorites;
drop policy if exists "favorites_select_own" on public.song_favorites;
drop policy if exists "favorites_insert_own" on public.song_favorites;
drop policy if exists "favorites_delete_own" on public.song_favorites;

create policy "favorites_select_own" on public.song_favorites
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "favorites_insert_own" on public.song_favorites
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "favorites_delete_own" on public.song_favorites
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- ----------------------------------------------------------------------------
-- 4. Una sola política permisiva por rol y acción
-- ----------------------------------------------------------------------------

-- roles: roles_write_admin era FOR ALL y se solapaba con roles_select_all.
drop policy if exists "roles_write_admin" on public.roles;
drop policy if exists "roles_insert_admin" on public.roles;
drop policy if exists "roles_update_admin" on public.roles;
drop policy if exists "roles_delete_admin" on public.roles;

create policy "roles_insert_admin" on public.roles
  for insert to authenticated
  with check ((select public.is_admin()));

create policy "roles_update_admin" on public.roles
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "roles_delete_admin" on public.roles
  for delete to authenticated
  using ((select public.is_admin()));

-- users: une users_update_own y users_update_admin. Postgres combina con OR
-- los USING y los WITH CHECK de políticas permisivas, así que el resultado
-- es equivalente: el usuario edita su fila sin cambiar su rol; el admin
-- edita cualquiera.
drop policy if exists "users_update_own" on public.users;
drop policy if exists "users_update_admin" on public.users;
drop policy if exists "users_update_own_or_admin" on public.users;

create policy "users_update_own_or_admin" on public.users
  for update to authenticated
  using (uid = (select auth.uid()) or (select public.is_admin()))
  with check (
    (select public.is_admin())
    or (
      uid = (select auth.uid())
      and role = (select public.current_user_role())
    )
  );

-- ----------------------------------------------------------------------------
-- 5. Índice para la FK users.role
-- ----------------------------------------------------------------------------
create index if not exists idx_users_role on public.users (role);
