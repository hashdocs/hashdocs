create type "public"."enum_colors" as enum ('#B4876E', '#A5B337', '#06CF9C', '#25D366', '#02A698', '#7D9EF1', '#007BFC', '#5E47DE', '#7F66FF', '#9333EA', '#FA6533', '#C4532D', '#DC2626', '#FF2E74', '#DB2777');

create type "public"."enum_member_role" as enum ('admin', 'member');

drop trigger if exists "trigger_before_insert_tbl_links" on "public"."tbl_links";

drop trigger if exists "trigger_before_insert_tbl_views" on "public"."tbl_views";

drop policy IF EXISTS "ALL if user belongs to org" on "public"."tbl_document_versions";

drop policy IF EXISTS "ALL if user org owns document" on "public"."tbl_documents";

drop policy IF EXISTS "ALL if user org owns feedback" on "public"."tbl_feedback";

drop policy If EXISTS "ALL if document belongs to user org" on "public"."tbl_links";

drop policy If EXISTS "ALL if user belongs to org" on "public"."tbl_view_logs";

drop policy If EXISTS "ALL if viewer" on "public"."tbl_view_logs";

drop policy If EXISTS "ALL if user belongs to org" on "public"."tbl_views";

drop policy "ALL for users 16v3daf_0" on "storage"."objects";

drop policy "ALL for users 16v3daf_1" on "storage"."objects";

drop policy "ALL for users 16v3daf_2" on "storage"."objects";

drop policy "ALL for users 16v3daf_3" on "storage"."objects";

drop policy "ALL if user owns document flreew_0" on "storage"."objects";

drop policy "ALL if user owns document flreew_1" on "storage"."objects";

drop policy "ALL if user owns document flreew_2" on "storage"."objects";

drop policy "ALL if user owns document flreew_3" on "storage"."objects";

drop policy "Get signed url for viewer flreew_0" on "storage"."objects";

revoke delete on table "public"."tbl_feedback" from "anon";

revoke insert on table "public"."tbl_feedback" from "anon";

revoke references on table "public"."tbl_feedback" from "anon";

revoke select on table "public"."tbl_feedback" from "anon";

revoke trigger on table "public"."tbl_feedback" from "anon";

revoke truncate on table "public"."tbl_feedback" from "anon";

revoke update on table "public"."tbl_feedback" from "anon";

revoke delete on table "public"."tbl_feedback" from "authenticated";

revoke insert on table "public"."tbl_feedback" from "authenticated";

revoke references on table "public"."tbl_feedback" from "authenticated";

revoke select on table "public"."tbl_feedback" from "authenticated";

revoke trigger on table "public"."tbl_feedback" from "authenticated";

revoke truncate on table "public"."tbl_feedback" from "authenticated";

revoke update on table "public"."tbl_feedback" from "authenticated";

revoke delete on table "public"."tbl_feedback" from "service_role";

revoke insert on table "public"."tbl_feedback" from "service_role";

revoke references on table "public"."tbl_feedback" from "service_role";

revoke select on table "public"."tbl_feedback" from "service_role";

revoke trigger on table "public"."tbl_feedback" from "service_role";

revoke truncate on table "public"."tbl_feedback" from "service_role";

revoke update on table "public"."tbl_feedback" from "service_role";

alter table "public"."tbl_document_versions" drop constraint "tbl_document_versions_document_id_fkey";

alter table "public"."tbl_documents" drop constraint "tbl_documents_created_by_fkey";

alter table "public"."tbl_feedback" drop constraint "tbl_feedback_org_id_fkey";

alter table "public"."tbl_feedback" drop constraint "tbl_feedback_user_id_fkey";

alter table "public"."tbl_links" drop constraint "tbl_links_created_by_fkey";

alter table "public"."tbl_links" drop constraint "tbl_links_document_id_fkey";

alter table "public"."tbl_links" drop constraint "tbl_links_link_id_key";

alter table "public"."tbl_org" drop constraint "unique_stripe_customer_id";

alter table "public"."tbl_org_members" drop constraint "tbl_org_members_org_id_fkey";

alter table "public"."tbl_org_members" drop constraint "tbl_org_members_user_id_fkey";

alter table "public"."tbl_views" drop constraint "tbl_views_view_id_key";

drop function if exists "public"."func_before_insert_tbl_links"();

drop function if exists "public"."func_before_insert_tbl_views"();

drop function if exists "public"."gen_view_id"(link_id_input text);

drop function if exists "public"."get_documents"(document_id_input text);

drop function if exists "public"."get_views"(document_id_input text);

drop function if exists "public"."upsert_document"(document_id_input text, document_name_input text, source_path_input text, source_type_input text);

alter table "public"."tbl_feedback" drop constraint "tbl_feedback_pkey";

alter table "public"."tbl_document_versions" drop constraint "tbl_document_versions_pkey";

alter table "public"."tbl_documents" drop constraint "tbl_documents_pkey";

alter table "public"."tbl_links" drop constraint "tbl_links_pkey";

alter table "public"."tbl_org_members" drop constraint "tbl_org_members_pkey";

alter table "public"."tbl_views" drop constraint "tbl_views_pkey";

drop index if exists "public"."tbl_feedback_pkey";

drop index if exists "public"."tbl_links_link_id_key";

drop index if exists "public"."tbl_views_view_id_key";

drop index if exists "public"."unique_stripe_customer_id";

drop index if exists "public"."tbl_document_versions_pkey";

drop index if exists "public"."tbl_documents_pkey";

drop index if exists "public"."tbl_links_pkey";

drop index if exists "public"."tbl_org_members_pkey";

drop index if exists "public"."tbl_views_pkey";

drop table "public"."tbl_feedback";

alter table "public"."tbl_document_versions" rename column "created_at" TO "updated_at";

alter table "public"."tbl_document_versions" rename column "is_enabled" TO "is_active";

alter table "public"."tbl_document_versions" add column if not exists "file_type" text;

alter table "public"."tbl_document_versions" add column if not exists "is_active" boolean not null default true;

alter table "public"."tbl_document_versions" add column if not exists "org_id" uuid not null default gen_random_uuid();

alter table "public"."tbl_document_versions" add column if not exists "source_path" text not null default ''::text;

alter table "public"."tbl_document_versions" add column if not exists "source_type" text not null default 'LOCAL'::text;

alter table "public"."tbl_document_versions" add column if not exists "thumbnail_image" text;

alter table "public"."tbl_document_versions" add column if not exists "token" text;

alter table "public"."tbl_document_versions" add column if not exists "updated_at" timestamp with time zone not null default now();

alter table "public"."tbl_document_versions" add column if not exists "updated_by" text default auth.email();

alter table "public"."tbl_documents" drop column if exists "created_by";

alter table "public"."tbl_documents" drop column if exists "document_seq";

alter table "public"."tbl_documents" rename column "image" to "custom_image";

alter table "public"."tbl_documents" drop column if exists "source_path";

alter table "public"."tbl_documents" drop column if exists "source_type";

alter table "public"."tbl_documents" alter column "org_id" drop default;

alter table "public"."tbl_documents" alter column "org_id" set not null;

alter table "public"."tbl_links" drop column "created_by";

alter table "public"."tbl_links" drop column "link_seq";

alter table "public"."tbl_links" add column "org_id" uuid not null;

alter table "public"."tbl_org" drop column "billing_cycle_end";

alter table "public"."tbl_org" drop column "billing_cycle_start";

alter table "public"."tbl_org" drop column "stripe_price_plan";

alter table "public"."tbl_org" drop column "stripe_product_plan";

alter table "public"."tbl_org" drop column "subscription_status";

alter table "public"."tbl_org" add column "org_image" text;

alter table "public"."tbl_org" add column "org_plan" text default '''Free''::text'::text;

alter table "public"."tbl_org" add column "stripe_metadata" jsonb;

alter table "public"."tbl_org_members" drop column "org_member_seq";

alter table "public"."tbl_org_members" drop column "user_role";

alter table "public"."tbl_org_members" add column "created_at" timestamp with time zone default now();

alter table "public"."tbl_org_members" add column "email" text not null;

alter table "public"."tbl_org_members" add column "invited_at" timestamp with time zone default now();

alter table "public"."tbl_org_members" add column "invited_by" text default auth.email();

alter table "public"."tbl_org_members" add column "is_active" boolean not null default true;

alter table "public"."tbl_org_members" add column "is_owner" boolean;

alter table "public"."tbl_org_members" add column "member_color" enum_colors not null default '#7D9EF1'::enum_colors;

alter table "public"."tbl_org_members" add column "member_image" text;

alter table "public"."tbl_org_members" add column "member_name" text;

alter table "public"."tbl_org_members" add column "role" enum_member_role not null default 'admin'::enum_member_role;

alter table "public"."tbl_org_members" alter column "user_id" drop not null;

alter table "public"."tbl_view_logs" add column "document_id" text not null;

alter table "public"."tbl_view_logs" add column "link_id" text not null;

alter table "public"."tbl_view_logs" add column "org_id" uuid not null;

alter table "public"."tbl_view_logs" alter column "end_time" set not null;

alter table "public"."tbl_view_logs" alter column "start_time" set not null;

alter table "public"."tbl_view_logs" alter column "view_id" set default ''::text;

alter table "public"."tbl_view_logs" alter column "view_id" set not null;

alter table "public"."tbl_views" drop column "view_seq";

alter table "public"."tbl_views" add column "document_id" text not null;

alter table "public"."tbl_views" add column "org_id" uuid not null;

alter table "public"."tbl_views" alter column "geo" set data type jsonb using "geo"::jsonb;

alter table "public"."tbl_views" alter column "link_id" set not null;

alter table "public"."tbl_views" alter column "view_id" set not null;

CREATE UNIQUE INDEX unique_document_id_org_id ON public.tbl_documents USING btree (document_id, org_id);

CREATE UNIQUE INDEX unique_link_id_document_id_org_id ON public.tbl_links USING btree (link_id, document_id, org_id);

CREATE UNIQUE INDEX unique_view_id_link_id_document_id_org_id ON public.tbl_views USING btree (view_id, link_id, document_id, org_id);

CREATE UNIQUE INDEX tbl_document_versions_pkey ON public.tbl_document_versions USING btree (document_id, document_version, org_id);

CREATE UNIQUE INDEX tbl_documents_pkey ON public.tbl_documents USING btree (document_id);

CREATE UNIQUE INDEX tbl_links_pkey ON public.tbl_links USING btree (link_id);

CREATE UNIQUE INDEX tbl_org_members_pkey ON public.tbl_org_members USING btree (org_id, email);

CREATE UNIQUE INDEX tbl_views_pkey ON public.tbl_views USING btree (view_id);

alter table "public"."tbl_document_versions" add constraint "tbl_document_versions_pkey" PRIMARY KEY using index "tbl_document_versions_pkey";

alter table "public"."tbl_documents" add constraint "tbl_documents_pkey" PRIMARY KEY using index "tbl_documents_pkey";

alter table "public"."tbl_links" add constraint "tbl_links_pkey" PRIMARY KEY using index "tbl_links_pkey";

alter table "public"."tbl_org_members" add constraint "tbl_org_members_pkey" PRIMARY KEY using index "tbl_org_members_pkey";

alter table "public"."tbl_views" add constraint "tbl_views_pkey" PRIMARY KEY using index "tbl_views_pkey";

alter table "public"."tbl_document_versions" add constraint "public_tbl_document_versions_document_id_org_id_fkey" FOREIGN KEY (document_id, org_id) REFERENCES tbl_documents(document_id, org_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tbl_document_versions" validate constraint "public_tbl_document_versions_document_id_org_id_fkey";

alter table "public"."tbl_documents" add constraint "unique_document_id_org_id" UNIQUE using index "unique_document_id_org_id";

alter table "public"."tbl_links" add constraint "public_tbl_links_document_id_org_id_fkey" FOREIGN KEY (document_id, org_id) REFERENCES tbl_documents(document_id, org_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tbl_links" validate constraint "public_tbl_links_document_id_org_id_fkey";

alter table "public"."tbl_links" add constraint "unique_link_id_document_id_org_id" UNIQUE using index "unique_link_id_document_id_org_id";

alter table "public"."tbl_org_members" add constraint "tbl_org_members_fkey_auth_users" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."tbl_org_members" validate constraint "tbl_org_members_fkey_auth_users";

alter table "public"."tbl_org_members" add constraint "tbl_org_members_fkey_tbl_org" FOREIGN KEY (org_id) REFERENCES tbl_org(org_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tbl_org_members" validate constraint "tbl_org_members_fkey_tbl_org";

alter table "public"."tbl_view_logs" add constraint "public_tbl_view_logs_view_id_link_id_document_id_org_id_fkey" FOREIGN KEY (view_id, link_id, document_id, org_id) REFERENCES tbl_views(view_id, link_id, document_id, org_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tbl_view_logs" validate constraint "public_tbl_view_logs_view_id_link_id_document_id_org_id_fkey";

alter table "public"."tbl_views" add constraint "public_tbl_views_link_id_document_id_org_id_fkey" FOREIGN KEY (link_id, document_id, org_id) REFERENCES tbl_links(link_id, document_id, org_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tbl_views" validate constraint "public_tbl_views_link_id_document_id_org_id_fkey";

alter table "public"."tbl_views" add constraint "unique_view_id_link_id_document_id_org_id" UNIQUE using index "unique_view_id_link_id_document_id_org_id";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
  declare
    claims jsonb;
    org_ids uuid[];
  begin
    -- Fetch the user role in the user_roles table
    select COALESCE(array_agg(org_id), '{}') INTO org_ids from public.tbl_org_members where user_id = (event->>'user_id')::uuid;

    claims := event->'claims';

      -- Check if 'app_metadata' exists in claims
      if jsonb_typeof(claims->'app_metadata') is null then
        -- If 'app_metadata' does not exist, create an empty object
        claims := jsonb_set(claims, '{app_metadata}', '{}');
      end if;

      -- Set a claim of 'org_ids'
      claims := jsonb_set(claims, '{app_metadata, org_ids}', to_jsonb(org_ids));

      -- Update the 'claims' object in the original event
      event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.func_update_member_name()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'auth', 'public'
AS $function$
BEGIN
    
    UPDATE public.tbl_org_members 
        SET member_name = COALESCE(NEW.raw_user_meta_data->>'name', tbl_org_members.member_name), 
        member_image = COALESCE(NEW.raw_user_meta_data->>'avatar_url', tbl_org_members.member_image) 
    WHERE tbl_org_members.user_id = NEW.id;

    RETURN NEW;
    
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_document(document_id_input text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    return_data json;
BEGIN
    --
    --
    SELECT
        row_to_json(t) INTO return_data
    FROM (
        SELECT
            view_documents.*,
            (
                SELECT
                    COALESCE(json_agg(row_to_json(a.*)), '[]'::json)
                FROM (
                    SELECT
                        * 
                    FROM 
                        tbl_links
                    WHERE 
                        tbl_links.document_id = document_id_input
                    ORDER BY
                        tbl_links.created_at DESC
                ) a
            ) AS links,
            (
                SELECT
                    COALESCE(json_agg(row_to_json(b.*)), '[]'::json)
                FROM (
                    SELECT
                        * 
                    FROM 
                        tbl_document_versions
                    WHERE 
                        tbl_document_versions.document_id = document_id_input
                    ORDER BY
                        tbl_document_versions.updated_at DESC
                ) b
            ) AS versions,
            (
                SELECT
                    COALESCE(json_agg(row_to_json(c.*)), '[]'::json)
                FROM (
                    SELECT
                        * 
                    FROM 
                        view_logs
                    WHERE 
                        view_logs.document_id = document_id_input
                ) c
            ) AS views
        FROM
            view_documents
        WHERE
            view_documents.document_id = document_id_input
    ) t;
    --
    --
    RETURN return_data;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.upsert_document(org_id_input uuid, document_id_input text DEFAULT NULL::text, document_name_input text DEFAULT NULL::text, source_path_input text DEFAULT NULL::text, source_type_input text DEFAULT NULL::text, file_type_input text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
	found_document_id text;
	document_count integer;
	return_data json;
BEGIN
	INSERT INTO tbl_documents(
		org_id,
		document_id,
		document_name)
	VALUES (
		org_id_input,
		coalesce(document_id_input, gen_document_id()),
		document_name_input)
ON CONFLICT (
	document_id)
	DO UPDATE SET
		document_id = EXCLUDED.document_id
	RETURNING
		document_id INTO found_document_id;
	--
	-- if found_document_id is null, then throw an error
	--
	IF found_document_id IS NULL THEN
		RAISE EXCEPTION 'Document not found';
	END IF;
	--
	-- update tbl_document_versions
	--
	UPDATE
		tbl_document_versions
	SET
		is_active = FALSE
	WHERE
		document_id = found_document_id
		AND org_id = org_id_input;
	--
	--
	SELECT 
		count(*) INTO document_count 
	FROM 
		tbl_document_versions 
	WHERE 
		document_id = found_document_id 
		AND org_id = org_id_input;
	--
	-- insert new version
	--
	INSERT INTO tbl_document_versions(
		org_id,
		document_id,
		document_version,
		is_active, 
		token, 
		source_path,
		source_type,
		file_type)
	VALUES (
		org_id_input,
		found_document_id,
		COALESCE(document_count,0) + 1, 
		TRUE, 
		sign(json_build_object('url', 'documents/' || org_id_input || '/' || found_document_id || '/' || COALESCE(document_count,0) + 1 || '.pdf', 'iat', ROUND(extract(epoch FROM now())), 'exp', ROUND(extract(epoch FROM now())) + 60 * 60 * 7 * 24 * 52 * 20), current_setting('app.settings.jwt_secret', TRUE)),
		source_path_input,
		source_type_input,
		file_type_input
		);
	--
	--
	SELECT row_to_json(view_documents) INTO return_data FROM view_documents WHERE document_id = found_document_id AND org_id = org_id_input;
	--
	--
	RETURN return_data;
END;
$function$
;

create or replace view "public"."view_documents" as  WITH links AS (
         SELECT tbl_links.document_id,
            count(*) AS total_links_count,
            count(
                CASE
                    WHEN (tbl_links.is_active = true) THEN 1
                    ELSE NULL::integer
                END) AS active_links_count
           FROM tbl_links
          GROUP BY tbl_links.document_id
        ), views AS (
         SELECT tbl_views.document_id,
            count(*) AS total_views_count
           FROM tbl_views
          GROUP BY tbl_views.document_id
        )
 SELECT tbl_documents.document_id,
    tbl_documents.created_at,
    tbl_documents.org_id,
    tbl_documents.is_enabled,
    tbl_documents.document_name,
    tbl_documents.custom_image,
    tbl_document_versions.document_version,
    tbl_document_versions.is_active,
    tbl_document_versions.page_count,
    tbl_document_versions.updated_at,
    tbl_document_versions.updated_by,
    tbl_document_versions.thumbnail_image,
    tbl_document_versions.token,
    tbl_document_versions.source_path,
    tbl_document_versions.source_type,
    tbl_document_versions.file_type,
    COALESCE(links.total_links_count, (0)::bigint) AS total_links_count,
    COALESCE(links.active_links_count, (0)::bigint) AS active_links_count,
    COALESCE(views.total_views_count, (0)::bigint) AS total_views_count
   FROM (((tbl_documents
     LEFT JOIN tbl_document_versions ON (((tbl_documents.document_id = tbl_document_versions.document_id) AND (tbl_document_versions.is_active = true))))
     LEFT JOIN links ON ((tbl_documents.document_id = links.document_id)))
     LEFT JOIN views ON ((tbl_documents.document_id = views.document_id)))
  ORDER BY tbl_document_versions.updated_at DESC;


create or replace view "public"."view_logs" as  SELECT tbl_views.viewed_at,
    tbl_views.view_id,
    tbl_views.viewer,
    tbl_views.link_id,
    tbl_views.document_version,
    tbl_views.geo,
    tbl_views.ip,
    tbl_views.is_authorized,
    tbl_views.ua,
    tbl_views.org_id,
    tbl_views.document_id,
    ( SELECT jsonb_object_agg(v.page_num, v.duration) AS jsonb_object_agg
           FROM ( SELECT tbl_view_logs_1.page_num,
                    COALESCE(sum((tbl_view_logs_1.end_time - tbl_view_logs_1.start_time)), (0)::numeric) AS duration
                   FROM tbl_view_logs tbl_view_logs_1
                  WHERE (tbl_views.view_id = tbl_view_logs_1.view_id)
                  GROUP BY tbl_view_logs_1.page_num) v) AS view_logs,
    COALESCE(round(((((count(DISTINCT tbl_view_logs.page_num))::double precision / (tbl_document_versions.page_count)::double precision) * (100)::double precision))::numeric), (0)::numeric) AS completion,
    COALESCE(sum((tbl_view_logs.end_time - tbl_view_logs.start_time)), (0)::numeric) AS duration,
    tbl_document_versions.page_count,
    tbl_links.link_name
   FROM (((tbl_views
     LEFT JOIN tbl_links ON (((tbl_views.link_id = tbl_links.link_id) AND (tbl_views.org_id = tbl_links.org_id) AND (tbl_views.document_id = tbl_links.document_id))))
     LEFT JOIN tbl_view_logs ON (((tbl_view_logs.view_id = tbl_views.view_id) AND (tbl_view_logs.link_id = tbl_views.link_id) AND (tbl_view_logs.document_id = tbl_views.document_id) AND (tbl_view_logs.org_id = tbl_views.org_id))))
     JOIN tbl_document_versions ON (((tbl_views.document_version = tbl_document_versions.document_version) AND (tbl_document_versions.document_id = tbl_views.document_id) AND (tbl_views.org_id = tbl_document_versions.org_id))))
  GROUP BY tbl_views.view_id, tbl_views.org_id, tbl_views.document_id, tbl_views.link_id, tbl_links.link_name, tbl_document_versions.page_count
  ORDER BY tbl_views.viewed_at DESC;


CREATE OR REPLACE FUNCTION public.get_link_props(link_id_input text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
	return_data json;
BEGIN
	--
	--
	SELECT
		row_to_json(t)
	FROM (
		SELECT
			*
		FROM
			tbl_links
		LEFT JOIN view_documents ON tbl_links.document_id = view_documents.document_id AND tbl_links.org_id = view_documents.org_id
	WHERE
		link_id = link_id_input) t INTO return_data;
	--
	--
	RETURN return_data;
END
$function$
;

DROP FUNCTION IF EXISTS public.get_org;

CREATE OR REPLACE FUNCTION public.get_org(org_id_input uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
	return_data jsonb;
BEGIN
	--
	--
	IF auth.uid() IS NULL AND auth.role() != 'service_role' THEN
		RETURN NULL;
	END IF;
	--
	--
	WITH org AS (
		SELECT
			tbl_org.*,
			coalesce(
				(
					SELECT json_agg(row_to_json(tbl_org_members) ORDER BY LOWER(COALESCE(tbl_org_members.member_name, tbl_org_members.email)) NULLS LAST)
					FROM  tbl_org_members
					WHERE org_id = tbl_org.org_id
				), '[]'
			) AS members
		FROM tbl_org
		WHERE (org_id_input IS NULL OR tbl_org.org_id = org_id_input)
		ORDER BY tbl_org.created_at DESC
	)
	SELECT COALESCE(json_agg(row_to_json(org)),'[]')
	FROM org INTO return_data;
	--
	--
	RETURN return_data;
END
$function$
;

DROP FUNCTION IF EXISTS public.list_org_from_user;

CREATE OR REPLACE FUNCTION public.list_org_from_user()
 RETURNS uuid[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
	RETURN(
		SELECT ARRAY_AGG(elem::uuid)
	FROM (
	SELECT jsonb_array_elements_text(((auth.jwt()->>'app_metadata')::jsonb->'org_ids')) AS elem
	) sub);
END
$function$
;

grant delete on table "public"."tbl_org_members" to "supabase_auth_admin";

grant insert on table "public"."tbl_org_members" to "supabase_auth_admin";

grant references on table "public"."tbl_org_members" to "supabase_auth_admin";

grant select on table "public"."tbl_org_members" to "supabase_auth_admin";

grant trigger on table "public"."tbl_org_members" to "supabase_auth_admin";

grant truncate on table "public"."tbl_org_members" to "supabase_auth_admin";

grant update on table "public"."tbl_org_members" to "supabase_auth_admin";

create policy "ALL for org"
on "public"."tbl_document_versions"
as permissive
for all
to public
using ((org_id = ANY (list_org_from_user())))
with check ((org_id = ANY (list_org_from_user())));


create policy "ALL for org"
on "public"."tbl_documents"
as permissive
for all
to public
using ((org_id = ANY (list_org_from_user())))
with check ((org_id = ANY (list_org_from_user())));


create policy "ALL for org"
on "public"."tbl_links"
as permissive
for all
to public
using ((org_id = ANY (list_org_from_user())))
with check ((org_id = ANY (list_org_from_user())));


create policy "ALL for org"
on "public"."tbl_org"
as permissive
for all
to authenticated
using ((org_id = ANY (list_org_from_user())))
with check ((org_id = ANY (list_org_from_user())));


create policy "ALL for org"
on "public"."tbl_org_members"
as permissive
for all
to authenticated
using ((org_id = ANY (list_org_from_user())))
with check ((org_id = ANY (list_org_from_user())));


create policy "Allow auth admin to read user roles"
on "public"."tbl_org_members"
as permissive
for select
to supabase_auth_admin
using (true);


create policy "SELECT for org"
on "public"."tbl_view_logs"
as permissive
for select
to authenticated
using ((org_id = ANY (list_org_from_user())));


create policy "ALL for org"
on "public"."tbl_views"
as permissive
for all
to public
using ((org_id = ANY (list_org_from_user())))
with check ((org_id = ANY (list_org_from_user())));

create policy "ALL for org flreew_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = ANY ((list_org_from_user())::text[]))));


create policy "ALL for org flreew_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = ANY ((list_org_from_user())::text[]))));


create policy "ALL for org flreew_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = ANY ((list_org_from_user())::text[]))));


create policy "ALL for org flreew_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = ANY ((list_org_from_user())::text[]))));


create policy "SELECT and INSERT for anon 16v3daf_0"
on "storage"."objects"
as permissive
for select
to anon, authenticated
using ((bucket_id = 'thumbnails'::text));


create policy "SELECT and INSERT for anon 16v3daf_1"
on "storage"."objects"
as permissive
for insert
to anon, authenticated
with check ((bucket_id = 'thumbnails'::text));



CREATE TRIGGER trigger_update_member_name AFTER INSERT OR UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION func_update_member_name();


DROP TRIGGER "create-org" ON auth.users;


-- drop type "public"."org_role";