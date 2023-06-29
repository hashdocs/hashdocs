drop policy "SELECT if viewer" on "public"."tbl_links";

drop policy "SELECT if viewer" on "public"."tbl_views";

drop function if exists "public"."authorize_viewer"(link_id_input text, email_input text, password_input text);

drop function if exists "public"."get_document_id"(document_id_input text);

alter table "public"."tbl_documents" alter column "created_by" set default auth.uid();

alter table "public"."tbl_documents" alter column "org_id" set default list_org_from_user();

alter table "public"."tbl_links" drop column "domain_restricted";

alter table "public"."tbl_links" drop column "download_allowed";

alter table "public"."tbl_links" drop column "email_required";

alter table "public"."tbl_links" drop column "password_required";

alter table "public"."tbl_links" drop column "verify_email";

alter table "public"."tbl_links" drop column "watermarked";

alter table "public"."tbl_links" add column "is_domain_restricted" boolean not null default false;

alter table "public"."tbl_links" add column "is_download_allowed" boolean not null default false;

alter table "public"."tbl_links" add column "is_email_required" boolean not null default false;

alter table "public"."tbl_links" add column "is_expiration_enabled" boolean not null default false;

alter table "public"."tbl_links" add column "is_password_required" boolean not null default false;

alter table "public"."tbl_links" add column "is_verification_required" boolean not null default false;

alter table "public"."tbl_links" add column "is_watermarked" boolean not null default false;

alter table "public"."tbl_links" alter column "created_by" set default auth.uid();

alter table "public"."tbl_view_logs" drop column "view_end_at";

alter table "public"."tbl_view_logs" drop column "view_start_at";

alter table "public"."tbl_view_logs" add column "end_time" bigint;

alter table "public"."tbl_view_logs" add column "start_time" bigint;

alter table "public"."tbl_view_logs" alter column "view_id" set default (auth.jwt() ->> 'view_id'::text);

alter table "public"."tbl_views" alter column "link_id" drop not null;

CREATE UNIQUE INDEX unique_view_id ON public.tbl_view_logs USING btree (view_id, page_num, start_time);

alter table "public"."tbl_view_logs" add constraint "unique_view_id" UNIQUE using index "unique_view_id";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize_viewer(link_id_input text, email_input text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
	return_data json;
	link_props RECORD;
	view_row tbl_views;
	jwt_metadata json;
	time_input timestamptz;
	new_token text;
	jwt_secret text;
BEGIN
	--
	--
	IF (link_id_input IS NULL) THEN
		RAISE EXCEPTION 'Invalid link_id';
	END IF;
	--
	--
	SELECT
		*
	FROM
		tbl_links
	LEFT JOIN tbl_documents ON tbl_links.document_id = tbl_documents.document_id
	LEFT JOIN tbl_document_versions ON tbl_documents.document_id = tbl_document_versions.document_id
WHERE
	link_id = link_id_input
		AND tbl_links.is_active = TRUE
		AND tbl_document_versions.is_enabled = TRUE
		AND tbl_documents.is_enabled = TRUE INTO link_props;
	--
	--
	IF (link_props IS NULL) THEN
		RAISE EXCEPTION 'Invalid link_id';
	END IF;
	--
	--
	IF (link_props.is_enabled = FALSE OR link_props.is_active = FALSE) THEN
		RAISE EXCEPTION 'Link is disabled';
	END IF;
	--
	--
	INSERT INTO tbl_views(
		link_id,
		viewer,
		document_version)
	VALUES (
		link_props.link_id,
		email_input,
		link_props.document_version)
RETURNING
	* INTO view_row;
	--
	--
	IF (view_row IS NULL) THEN
		RAISE EXCEPTION 'Invalid link_id';
	END IF;
	--
	--
	time_input = now();
	--
	--
	jwt_metadata := json_build_object('aud', 'authenticated', 'iat', extract(epoch FROM time_input), 'exp', extract(epoch FROM time_input) + 60 * 60, 'role', 'authenticated', 'link_id', view_row.link_id, 'view_id', view_row.view_id, 'viewer', view_row.viewer, 'document_version', view_row.document_version, 'document_id', link_props.document_id);
	--
	--
	SELECT
		coalesce(current_setting('app.settings.jwt_secret', TRUE), 'super-secret-jwt-token-with-at-least-32-characters-long') INTO jwt_secret;
	--
	--
	SELECT
		sign(jwt_metadata, jwt_secret) INTO new_token;
	--
	--
	return_data = json_build_object('view_token', new_token, 'view', view_row);
	RETURN return_data;
END
$function$
;

CREATE OR REPLACE FUNCTION public.func_after_insert_auth_users()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
	INSERT INTO public.tbl_org(
		user_id,
		ROLE,
		org_name)
	VALUES(
		NEW.id,
		'OWNER',
		'My org');
	RETURN NEW;
END
$function$
;

CREATE OR REPLACE FUNCTION public.get_documents(document_id_input text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
	return_data json;
BEGIN
	WITH views AS (
		SELECT
			tbl_views.view_seq,
			tbl_views.link_id,
			tbl_views.view_id,
			tbl_views.viewed_at,
			tbl_views.viewer,
			tbl_views.document_version,
			coalesce(max(tbl_view_logs.end_time) - min(tbl_view_logs.start_time), 0) AS duration,
			round(count(
					CASE WHEN tbl_document_versions.document_version = tbl_views.document_version THEN
						page_num
					END) / nullif(tbl_document_versions.page_count::numeric, 0) * 100, 0)::numeric AS completion
		FROM
			tbl_views
		LEFT JOIN tbl_view_logs ON tbl_views.view_id = tbl_view_logs.view_id
		LEFT JOIN tbl_links ON tbl_links.link_id = tbl_views.link_id
		LEFT JOIN tbl_document_versions ON tbl_document_versions.document_id = tbl_links.document_id
	WHERE
		tbl_views.document_version = tbl_document_versions.document_version
	GROUP BY
		tbl_views.view_seq,
		tbl_views.link_id,
		tbl_views.view_id,
		tbl_views.viewed_at,
		tbl_views.viewer,
		tbl_views.document_version,
		tbl_document_versions.page_count
	ORDER BY
		tbl_views.view_seq DESC
),
links AS (
	SELECT
		tbl_links.link_seq,
		tbl_links.link_id,
		tbl_links.link_name,
		tbl_links.created_at,
		tbl_links.is_active,
		tbl_links.document_id,
		tbl_links.created_by,
		tbl_links.is_email_required,
		tbl_links.is_password_required,
		tbl_links.is_verification_required,
		tbl_links.is_domain_restricted,
		tbl_links.is_download_allowed,
		tbl_links.is_watermarked,
		tbl_links.restricted_domains,
		tbl_links.link_password,
		coalesce(count(DISTINCT views.view_id), 0) AS view_count,
		CASE WHEN count(DISTINCT views.view_id) = 0 THEN
			ARRAY[]::json[]
		ELSE
			array_agg(row_to_json(views.*))
		END AS views
	FROM
		tbl_links
		LEFT JOIN views ON views.link_id = tbl_links.link_id
	GROUP BY
		tbl_links.link_seq,
		tbl_links.link_id,
		tbl_links.link_name,
		tbl_links.created_at,
		tbl_links.is_active,
		tbl_links.document_id,
		tbl_links.created_by,
		tbl_links.is_email_required,
		tbl_links.is_password_required,
		tbl_links.is_verification_required,
		tbl_links.is_domain_restricted,
		tbl_links.is_download_allowed,
		tbl_links.is_watermarked,
		tbl_links.restricted_domains,
		tbl_links.link_password
	ORDER BY
		tbl_links.link_seq DESC
)
SELECT
	json_agg(row_to_json(t))
FROM (
	SELECT
		tbl_documents.document_seq,
		tbl_documents.document_id,
		tbl_documents.created_at,
		tbl_documents.document_name,
		tbl_documents.source_path,
		tbl_documents.source_type,
		tbl_documents.created_by,
		tbl_documents.org_id,
		tbl_documents.is_enabled,
		tbl_documents.image,
		tbl_document_versions.document_version,
		coalesce(count(links.link_id), 0) AS total_links_count,
		coalesce(sum(links.view_count), 0) AS total_view_Count,
		CASE WHEN count(DISTINCT links.link_id) = 0 THEN
			ARRAY[]::json[]
		ELSE
			array_agg(row_to_json(links.*))
		END AS links
	FROM
		tbl_documents
	LEFT JOIN links ON tbl_documents.document_id = links.document_id
	LEFT JOIN tbl_document_versions ON tbl_documents.document_id = tbl_document_versions.document_id
WHERE
	tbl_document_versions.is_enabled = TRUE
	AND CASE WHEN document_id_input IS NULL THEN
		tbl_documents.org_id = list_org_from_user()
	ELSE
		tbl_documents.document_id = document_id_input
	END
GROUP BY
	tbl_documents.document_seq,
	tbl_documents.document_id,
	tbl_documents.created_at,
	tbl_documents.document_name,
	tbl_documents.source_path,
	tbl_documents.source_type,
	tbl_documents.created_by,
	tbl_documents.org_id,
	tbl_documents.is_enabled,
	tbl_documents.image,
	tbl_document_versions.document_version
ORDER BY
	tbl_documents.document_seq DESC) t INTO return_data;
	RETURN return_data;
END;
$function$
;

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
	IF (link_id_input IS NULL) THEN
		RAISE EXCEPTION 'Invalid link_id';
	END IF;
	--
	--
	SELECT
		row_to_json(t)
	FROM (
		SELECT
			*
		FROM
			tbl_links
		LEFT JOIN tbl_documents ON tbl_links.document_id = tbl_documents.document_id
		LEFT JOIN tbl_document_versions ON tbl_links.document_id = tbl_document_versions.document_id
	WHERE
		link_id = link_id_input
		AND tbl_documents.is_enabled = TRUE
		AND tbl_links.is_active = TRUE
		AND tbl_document_versions.is_enabled = TRUE) t INTO return_data;
	--
	--
	RETURN return_data;
END
$function$
;

CREATE OR REPLACE FUNCTION public.upsert_document(document_id_input text DEFAULT NULL::text, document_name_input text DEFAULT NULL::text, source_path_input text DEFAULT NULL::text, source_type_input text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
	found_document_id text;
    insert_data tbl_document_versions;
	return_data json;
BEGIN
	IF document_id_input IS NULL THEN
		INSERT INTO tbl_documents(
			document_name,
			source_path,
			source_type)
		VALUES (
			document_name_input,
			source_path_input,
			source_type_input)
	RETURNING
		document_id INTO found_document_id;
	ELSE
		found_document_id := document_id_input;
	END IF;
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
		is_enabled = FALSE
	WHERE
		document_id = found_document_id;
	--
	-- insert new version
	--
	INSERT INTO tbl_document_versions(
		document_id,
		document_version,
		is_enabled)
	VALUES (
		found_document_id,
(
			SELECT
				coalesce(max(document_version), 0) + 1
			FROM
				tbl_document_versions
			WHERE
				document_id = found_document_id), TRUE) RETURNING * INTO insert_data;
	--
	--
	RETURN json_build_object('document_id', insert_data.document_id, 'document_version', insert_data.document_version);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.func_before_insert_tbl_links()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    NEW.link_id := gen_links_id();
    RETURN NEW; 
END
$function$
;

CREATE OR REPLACE FUNCTION public.func_before_insert_tbl_views()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    NEW.view_id := gen_view_id(NEW.link_id);
    RETURN NEW; 
END
$function$
;

create policy "ALL if viewer"
on "public"."tbl_view_logs"
as permissive
for all
to authenticated
using ((view_id = (auth.jwt() ->> 'view_id'::text)))
with check ((view_id = (auth.jwt() ->> 'view_id'::text)));



