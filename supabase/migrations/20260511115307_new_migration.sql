drop extension if exists "unaccent";
drop table if exists "roles" cascade;
drop table if exists "song_comments" cascade;
drop table if exists "song_favorites" cascade;
drop table if exists "song_likes" cascade;
drop table if exists "song_visits" cascade;
drop table if exists "songs" cascade;
drop table if exists "songs_artists" cascade;
drop table if exists "songs_requests" cascade;
drop table if exists "users" cascade;
drop trigger if exists "on_auth_user_created" on "auth"."users" cascade;

create extension if not exists "unaccent" with schema "public";


  create table "public"."roles" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null
      );


alter table "public"."roles" enable row level security;


  create table "public"."song_comments" (
    "id" uuid not null default gen_random_uuid(),
    "song_id" uuid not null,
    "user_id" text not null,
    "content" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "isDeleted" boolean not null default false
      );


alter table "public"."song_comments" enable row level security;


  create table "public"."song_favorites" (
    "id" uuid not null default gen_random_uuid(),
    "song_id" uuid not null,
    "createdAt" timestamp with time zone not null default now(),
    "user_id" uuid not null
      );


alter table "public"."song_favorites" enable row level security;


  create table "public"."song_likes" (
    "id" uuid not null default gen_random_uuid(),
    "song_id" uuid not null,
    "user_id" text not null,
    "createdAt" timestamp with time zone not null default now()
      );


alter table "public"."song_likes" enable row level security;


  create table "public"."song_visits" (
    "id" uuid not null default gen_random_uuid(),
    "song_id" uuid not null,
    "user_id" text,
    "ip_hash" text,
    "visitedAt" timestamp with time zone not null default now()
      );


alter table "public"."song_visits" enable row level security;


  create table "public"."songs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "title" text,
    "slug" text,
    "video" text,
    "chords" text,
    "lyrics" text,
    "coverArt" text,
    "createdAt" timestamp with time zone default now(),
    "updatedAt" timestamp with time zone default now(),
    "isPublished" boolean default true,
    "artist_id" uuid,
    "key" text
      );


alter table "public"."songs" enable row level security;


  create table "public"."songs_artists" (
    "id" uuid not null default gen_random_uuid(),
    "song_id" uuid not null,
    "artist_id" uuid not null
      );


alter table "public"."songs_artists" enable row level security;


  create table "public"."songs_requests" (
    "id" uuid not null default gen_random_uuid(),
    "artist" text not null,
    "title" text not null,
    "user_id" uuid not null,
    "requestedAt" timestamp with time zone not null default now(),
    "status" text not null default 'pending'::text,
    "adminNote" text
      );


alter table "public"."songs_requests" enable row level security;


  create table "public"."users" (
    "uid" uuid not null,
    "email" text not null,
    "name" text,
    "role" text not null default 'user'::text,
    "createdAt" timestamp with time zone default now(),
    "avatar_url" text
      );


alter table "public"."users" enable row level security;

CREATE INDEX idx_song_comments_song_id ON public.song_comments USING btree (song_id);

CREATE INDEX idx_song_comments_user_id ON public.song_comments USING btree (user_id);

CREATE INDEX idx_song_favorites_song_id ON public.song_favorites USING btree (song_id);

CREATE INDEX idx_song_likes_song_id ON public.song_likes USING btree (song_id);

CREATE INDEX idx_song_likes_user_id ON public.song_likes USING btree (user_id);

CREATE INDEX idx_song_visits_song_id ON public.song_visits USING btree (song_id);

CREATE INDEX idx_song_visits_user_id ON public.song_visits USING btree (user_id);

CREATE INDEX idx_song_visits_visited_at ON public.song_visits USING btree ("visitedAt");

CREATE INDEX idx_songs_artist_id ON public.songs USING btree (artist_id);

CREATE INDEX idx_songs_published ON public.songs USING btree ("isPublished") WHERE ("isPublished" = true);

CREATE INDEX idx_songs_requests_status ON public.songs_requests USING btree (status);

CREATE INDEX idx_user_id ON public.songs_requests USING btree (user_id);

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (id);

CREATE UNIQUE INDEX song_comments_pkey ON public.song_comments USING btree (id);

CREATE UNIQUE INDEX song_favorites_pkey ON public.song_favorites USING btree (id);

CREATE UNIQUE INDEX song_likes_pkey ON public.song_likes USING btree (id);

CREATE UNIQUE INDEX song_likes_unique ON public.song_likes USING btree (song_id, user_id);

CREATE UNIQUE INDEX song_visits_pkey ON public.song_visits USING btree (id);

CREATE UNIQUE INDEX songs_pkey ON public.songs USING btree (id);

CREATE UNIQUE INDEX songs_artists_pkey ON public.songs_artists USING btree (id);

CREATE UNIQUE INDEX songs_requests_pkey ON public.songs_requests USING btree (id);

CREATE UNIQUE INDEX songs_slug_key ON public.songs USING btree (slug);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (uid);

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."song_comments" add constraint "song_comments_pkey" PRIMARY KEY using index "song_comments_pkey";

alter table "public"."song_favorites" add constraint "song_favorites_pkey" PRIMARY KEY using index "song_favorites_pkey";

alter table "public"."song_likes" add constraint "song_likes_pkey" PRIMARY KEY using index "song_likes_pkey";

alter table "public"."song_visits" add constraint "song_visits_pkey" PRIMARY KEY using index "song_visits_pkey";

alter table "public"."songs" add constraint "songs_pkey" PRIMARY KEY using index "songs_pkey";

alter table "public"."songs_artists" add constraint "songs_artists_pkey" PRIMARY KEY using index "songs_artists_pkey";

alter table "public"."songs_requests" add constraint "songs_requests_pkey" PRIMARY KEY using index "songs_requests_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."roles" add constraint "roles_name_key" UNIQUE using index "roles_name_key";

alter table "public"."song_comments" add constraint "song_comments_content_check" CHECK (((char_length(content) > 0) AND (char_length(content) <= 1000))) not valid;

alter table "public"."song_comments" validate constraint "song_comments_content_check";

alter table "public"."song_comments" add constraint "song_comments_song_fk" FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE not valid;

alter table "public"."song_comments" validate constraint "song_comments_song_fk";

alter table "public"."song_favorites" add constraint "song_favorites_song_id_fkey" FOREIGN KEY (song_id) REFERENCES public.songs(id) not valid;

alter table "public"."song_favorites" validate constraint "song_favorites_song_id_fkey";

alter table "public"."song_favorites" add constraint "song_favorites_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."song_favorites" validate constraint "song_favorites_user_id_fkey";

alter table "public"."song_likes" add constraint "song_likes_song_fk" FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE not valid;

alter table "public"."song_likes" validate constraint "song_likes_song_fk";

alter table "public"."song_likes" add constraint "song_likes_unique" UNIQUE using index "song_likes_unique";

alter table "public"."song_visits" add constraint "song_visits_song_fk" FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE not valid;

alter table "public"."song_visits" validate constraint "song_visits_song_fk";

alter table "public"."songs" add constraint "songs_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES public.artists(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."songs" validate constraint "songs_artist_id_fkey";

alter table "public"."songs" add constraint "songs_slug_key" UNIQUE using index "songs_slug_key";

alter table "public"."songs_artists" add constraint "songs_artists_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES public.artists(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."songs_artists" validate constraint "songs_artists_artist_id_fkey";

alter table "public"."songs_artists" add constraint "songs_artists_song_id_fkey" FOREIGN KEY (song_id) REFERENCES public.songs(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."songs_artists" validate constraint "songs_artists_song_id_fkey";

alter table "public"."songs_requests" add constraint "songs_requests_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))) not valid;

alter table "public"."songs_requests" validate constraint "songs_requests_status_check";

alter table "public"."songs_requests" add constraint "user_id_pkey" FOREIGN KEY (user_id) REFERENCES public.users(uid) not valid;

alter table "public"."songs_requests" validate constraint "user_id_pkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_role_fkey" FOREIGN KEY (role) REFERENCES public.roles(name) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_role_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.users (
    uid,
    email,
    name,
    avatar_url,
    role
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      null
    ),
    'user'
  )
  on conflict (uid) do update set
    email = excluded.email,
    name = excluded.name,
    avatar_url = excluded.avatar_url;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_update_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select exists (
    select 1 from users
    where uid = auth.uid()
    and role = 'admin'
  );
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$function$
;

create or replace view "public"."songs_with_counts" as  SELECT s.id,
    s.title,
    s.artist_id,
    s.slug,
    s.video,
    s.chords,
    s.lyrics,
    s."coverArt",
    s."createdAt",
    s."updatedAt",
    s."isPublished",
    count(DISTINCT sl.id) AS like_count,
    count(DISTINCT sv.id) AS visit_count,
    count(DISTINCT sf.id) AS favorite_count,
    count(DISTINCT sc.id) FILTER (WHERE (sc."isDeleted" = false)) AS comment_count
   FROM ((((public.songs s
     LEFT JOIN public.song_likes sl ON ((s.id = sl.song_id)))
     LEFT JOIN public.song_visits sv ON ((s.id = sv.song_id)))
     LEFT JOIN public.song_favorites sf ON ((s.id = sf.song_id)))
     LEFT JOIN public.song_comments sc ON ((s.id = sc.song_id)))
  GROUP BY s.id;


CREATE OR REPLACE FUNCTION public.toggle_song_favorite(p_song_id uuid, p_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  is_favorited boolean;
BEGIN
  -- 1. Verificamos si ya existe el favorito
  IF EXISTS (
    SELECT 1 FROM public.song_favorites 
    WHERE song_id = p_song_id AND user_id = p_user_id -- Casteo si tu columna sigue siendo text
  ) THEN
    -- 2. Si existe, lo eliminamos (Unfavorite)
    DELETE FROM public.song_favorites 
    WHERE song_id = p_song_id AND user_id = p_user_id;
    is_favorited := false;
  ELSE
    -- 3. Si no existe, lo insertamos (Favorite)
    -- Asegúrate de que la FK en song_favorites apunte a songs(id)
    INSERT INTO public.song_favorites (song_id, user_id)
    VALUES (p_song_id, p_user_id);
    is_favorited := true;
  END IF;

  -- 4. Retornamos el estado final
  RETURN json_build_object('favorited', is_favorited);
END;$function$
;

CREATE OR REPLACE FUNCTION public.toggle_song_like(p_song_id uuid, p_user_id text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  existing_id uuid;
  result json;
BEGIN
  SELECT id INTO existing_id
  FROM public.song_likes
  WHERE song_id = p_song_id AND user_id = p_user_id;

  IF existing_id IS NOT NULL THEN
    DELETE FROM public.song_likes WHERE id = existing_id;
    result := json_build_object('liked', false);
  ELSE
    INSERT INTO public.song_likes (song_id, user_id) VALUES (p_song_id, p_user_id);
    result := json_build_object('liked', true);
  END IF;

  RETURN result;
END;
$function$
;

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant select on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";

grant delete on table "public"."song_comments" to "anon";

grant insert on table "public"."song_comments" to "anon";

grant references on table "public"."song_comments" to "anon";

grant select on table "public"."song_comments" to "anon";

grant trigger on table "public"."song_comments" to "anon";

grant truncate on table "public"."song_comments" to "anon";

grant update on table "public"."song_comments" to "anon";

grant delete on table "public"."song_comments" to "authenticated";

grant insert on table "public"."song_comments" to "authenticated";

grant references on table "public"."song_comments" to "authenticated";

grant select on table "public"."song_comments" to "authenticated";

grant trigger on table "public"."song_comments" to "authenticated";

grant truncate on table "public"."song_comments" to "authenticated";

grant update on table "public"."song_comments" to "authenticated";

grant delete on table "public"."song_comments" to "service_role";

grant insert on table "public"."song_comments" to "service_role";

grant references on table "public"."song_comments" to "service_role";

grant select on table "public"."song_comments" to "service_role";

grant trigger on table "public"."song_comments" to "service_role";

grant truncate on table "public"."song_comments" to "service_role";

grant update on table "public"."song_comments" to "service_role";

grant delete on table "public"."song_favorites" to "anon";

grant insert on table "public"."song_favorites" to "anon";

grant references on table "public"."song_favorites" to "anon";

grant select on table "public"."song_favorites" to "anon";

grant trigger on table "public"."song_favorites" to "anon";

grant truncate on table "public"."song_favorites" to "anon";

grant update on table "public"."song_favorites" to "anon";

grant delete on table "public"."song_favorites" to "authenticated";

grant insert on table "public"."song_favorites" to "authenticated";

grant references on table "public"."song_favorites" to "authenticated";

grant select on table "public"."song_favorites" to "authenticated";

grant trigger on table "public"."song_favorites" to "authenticated";

grant truncate on table "public"."song_favorites" to "authenticated";

grant update on table "public"."song_favorites" to "authenticated";

grant delete on table "public"."song_favorites" to "service_role";

grant insert on table "public"."song_favorites" to "service_role";

grant references on table "public"."song_favorites" to "service_role";

grant select on table "public"."song_favorites" to "service_role";

grant trigger on table "public"."song_favorites" to "service_role";

grant truncate on table "public"."song_favorites" to "service_role";

grant update on table "public"."song_favorites" to "service_role";

grant delete on table "public"."song_likes" to "anon";

grant insert on table "public"."song_likes" to "anon";

grant references on table "public"."song_likes" to "anon";

grant select on table "public"."song_likes" to "anon";

grant trigger on table "public"."song_likes" to "anon";

grant truncate on table "public"."song_likes" to "anon";

grant update on table "public"."song_likes" to "anon";

grant delete on table "public"."song_likes" to "authenticated";

grant insert on table "public"."song_likes" to "authenticated";

grant references on table "public"."song_likes" to "authenticated";

grant select on table "public"."song_likes" to "authenticated";

grant trigger on table "public"."song_likes" to "authenticated";

grant truncate on table "public"."song_likes" to "authenticated";

grant update on table "public"."song_likes" to "authenticated";

grant delete on table "public"."song_likes" to "service_role";

grant insert on table "public"."song_likes" to "service_role";

grant references on table "public"."song_likes" to "service_role";

grant select on table "public"."song_likes" to "service_role";

grant trigger on table "public"."song_likes" to "service_role";

grant truncate on table "public"."song_likes" to "service_role";

grant update on table "public"."song_likes" to "service_role";

grant delete on table "public"."song_visits" to "anon";

grant insert on table "public"."song_visits" to "anon";

grant references on table "public"."song_visits" to "anon";

grant select on table "public"."song_visits" to "anon";

grant trigger on table "public"."song_visits" to "anon";

grant truncate on table "public"."song_visits" to "anon";

grant update on table "public"."song_visits" to "anon";

grant delete on table "public"."song_visits" to "authenticated";

grant insert on table "public"."song_visits" to "authenticated";

grant references on table "public"."song_visits" to "authenticated";

grant select on table "public"."song_visits" to "authenticated";

grant trigger on table "public"."song_visits" to "authenticated";

grant truncate on table "public"."song_visits" to "authenticated";

grant update on table "public"."song_visits" to "authenticated";

grant delete on table "public"."song_visits" to "service_role";

grant insert on table "public"."song_visits" to "service_role";

grant references on table "public"."song_visits" to "service_role";

grant select on table "public"."song_visits" to "service_role";

grant trigger on table "public"."song_visits" to "service_role";

grant truncate on table "public"."song_visits" to "service_role";

grant update on table "public"."song_visits" to "service_role";

grant delete on table "public"."songs" to "anon";

grant insert on table "public"."songs" to "anon";

grant references on table "public"."songs" to "anon";

grant select on table "public"."songs" to "anon";

grant trigger on table "public"."songs" to "anon";

grant truncate on table "public"."songs" to "anon";

grant update on table "public"."songs" to "anon";

grant delete on table "public"."songs" to "authenticated";

grant insert on table "public"."songs" to "authenticated";

grant references on table "public"."songs" to "authenticated";

grant select on table "public"."songs" to "authenticated";

grant trigger on table "public"."songs" to "authenticated";

grant truncate on table "public"."songs" to "authenticated";

grant update on table "public"."songs" to "authenticated";

grant delete on table "public"."songs" to "service_role";

grant insert on table "public"."songs" to "service_role";

grant references on table "public"."songs" to "service_role";

grant select on table "public"."songs" to "service_role";

grant trigger on table "public"."songs" to "service_role";

grant truncate on table "public"."songs" to "service_role";

grant update on table "public"."songs" to "service_role";

grant delete on table "public"."songs_artists" to "anon";

grant insert on table "public"."songs_artists" to "anon";

grant references on table "public"."songs_artists" to "anon";

grant select on table "public"."songs_artists" to "anon";

grant trigger on table "public"."songs_artists" to "anon";

grant truncate on table "public"."songs_artists" to "anon";

grant update on table "public"."songs_artists" to "anon";

grant delete on table "public"."songs_artists" to "authenticated";

grant insert on table "public"."songs_artists" to "authenticated";

grant references on table "public"."songs_artists" to "authenticated";

grant select on table "public"."songs_artists" to "authenticated";

grant trigger on table "public"."songs_artists" to "authenticated";

grant truncate on table "public"."songs_artists" to "authenticated";

grant update on table "public"."songs_artists" to "authenticated";

grant delete on table "public"."songs_artists" to "service_role";

grant insert on table "public"."songs_artists" to "service_role";

grant references on table "public"."songs_artists" to "service_role";

grant select on table "public"."songs_artists" to "service_role";

grant trigger on table "public"."songs_artists" to "service_role";

grant truncate on table "public"."songs_artists" to "service_role";

grant update on table "public"."songs_artists" to "service_role";

grant delete on table "public"."songs_requests" to "anon";

grant insert on table "public"."songs_requests" to "anon";

grant references on table "public"."songs_requests" to "anon";

grant select on table "public"."songs_requests" to "anon";

grant trigger on table "public"."songs_requests" to "anon";

grant truncate on table "public"."songs_requests" to "anon";

grant update on table "public"."songs_requests" to "anon";

grant delete on table "public"."songs_requests" to "authenticated";

grant insert on table "public"."songs_requests" to "authenticated";

grant references on table "public"."songs_requests" to "authenticated";

grant select on table "public"."songs_requests" to "authenticated";

grant trigger on table "public"."songs_requests" to "authenticated";

grant truncate on table "public"."songs_requests" to "authenticated";

grant update on table "public"."songs_requests" to "authenticated";

grant delete on table "public"."songs_requests" to "service_role";

grant insert on table "public"."songs_requests" to "service_role";

grant references on table "public"."songs_requests" to "service_role";

grant select on table "public"."songs_requests" to "service_role";

grant trigger on table "public"."songs_requests" to "service_role";

grant truncate on table "public"."songs_requests" to "service_role";

grant update on table "public"."songs_requests" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";



  create policy "comments_delete_own_or_admin"
  on "public"."song_comments"
  as permissive
  for delete
  to public
using (((user_id = (auth.uid())::text) OR public.is_admin()));



  create policy "comments_insert_own"
  on "public"."song_comments"
  as permissive
  for insert
  to public
with check ((user_id = (auth.uid())::text));



  create policy "comments_select_all"
  on "public"."song_comments"
  as permissive
  for select
  to public
using (true);



  create policy "comments_update_own"
  on "public"."song_comments"
  as permissive
  for update
  to public
using ((user_id = (auth.uid())::text));



  create policy "Users can only delete their own favorites"
  on "public"."song_favorites"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can only insert their own favorites"
  on "public"."song_favorites"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can only view their own favorites"
  on "public"."song_favorites"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "likes_delete_own"
  on "public"."song_likes"
  as permissive
  for delete
  to public
using ((user_id = (auth.uid())::text));



  create policy "likes_insert_own"
  on "public"."song_likes"
  as permissive
  for insert
  to public
with check ((user_id = (auth.uid())::text));



  create policy "likes_select"
  on "public"."song_likes"
  as permissive
  for select
  to public
using (true);



  create policy "visits_insert_all"
  on "public"."song_visits"
  as permissive
  for insert
  to public
with check (true);



  create policy "visits_select_admin"
  on "public"."song_visits"
  as permissive
  for select
  to public
using (public.is_admin());



  create policy "Enable read access for all users"
  on "public"."songs"
  as permissive
  for all
  to public
using (true);



  create policy "vew_song_artist"
  on "public"."songs_artists"
  as permissive
  for select
  to public
using (true);



  create policy "Cualquiera puede pedir canciones"
  on "public"."songs_requests"
  as permissive
  for insert
  to public
with check (true);



  create policy "Solo Admin Pueden Ver Peticiones"
  on "public"."songs_requests"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.uid = auth.uid()) AND (users.role = 'admin'::text)))));



  create policy "Solo admins pueden gestionar peticiones"
  on "public"."songs_requests"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.uid = auth.uid()) AND (users.role = 'admin'::text)))));



  create policy "solo admin puede borrar canciones pedidas"
  on "public"."songs_requests"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.uid = auth.uid()) AND (users.role = 'admin'::text)))));



  create policy "Los usuarios pueden actualizar su propio perfil"
  on "public"."users"
  as permissive
  for all
  to public
using ((auth.uid() = uid))
with check ((auth.uid() = uid));



  create policy "users_delete_admin"
  on "public"."users"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.users users_1
  WHERE ((users_1.uid = auth.uid()) AND (users_1.role = 'admin'::text)))));



  create policy "users_insert_own"
  on "public"."users"
  as permissive
  for insert
  to authenticated
with check (((uid = auth.uid()) AND (role = 'user'::text)));



  create policy "users_select_own_or_admin"
  on "public"."users"
  as permissive
  for select
  to authenticated
using (((uid = auth.uid()) OR (role = 'admin'::text)));



  create policy "users_update_admin"
  on "public"."users"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.users users_1
  WHERE ((users_1.uid = auth.uid()) AND (users_1.role = 'admin'::text)))));



  create policy "users_update_own"
  on "public"."users"
  as permissive
  for update
  to authenticated
using ((uid = auth.uid()))
with check (((uid = auth.uid()) AND (role = 'user'::text)));

  create policy "Los roles son visibles para todos"
  on "public"."roles"
  to public
using (
  true
);

  create policy "Solo admin pueden modificar roles"
  on "public"."roles"
  to public
using (
  (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.uid = auth.uid()) AND (users.role = 'admin'::text))))
);

CREATE TRIGGER trg_song_comments_updated_at BEFORE UPDATE ON public.song_comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_songs_updated_at BEFORE UPDATE ON public.songs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();