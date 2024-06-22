drop function if exists "public"."get_document"(document_id_input text);

alter table "public"."tbl_org" alter column "org_plan" set default 'Free'::text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_document(document_id_input text, org_id_input uuid DEFAULT NULL::uuid)
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
            AND (
                org_id_input IS NULL
                OR view_documents.org_id = org_id_input
            )
    ) t;
    --
    --
    RETURN return_data;
END;
$function$
;

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
        member_image = COALESCE(NEW.raw_user_meta_data->>'avatar_url', tbl_org_members.member_image),
        user_id = NEW.id 
    WHERE tbl_org_members.email = NEW.email;

    RETURN NEW;
    
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_org(org_id_input uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
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
					SELECT json_agg(row_to_json(tbl_org_members) ORDER BY is_owner DESC, role DESC, LOWER(COALESCE(tbl_org_members.member_name, tbl_org_members.email)) NULLS LAST)
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


create policy "ALL for org 2d44_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'org'::text) AND ((storage.foldername(name))[1] = ANY ((list_org_from_user())::text[]))));


create policy "ALL for org 2d44_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'org'::text) AND ((storage.foldername(name))[1] = ANY ((list_org_from_user())::text[]))));


create policy "ALL for org 2d44_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'org'::text) AND ((storage.foldername(name))[1] = ANY ((list_org_from_user())::text[]))));


create policy "ALL for org 2d44_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'org'::text) AND ((storage.foldername(name))[1] = ANY ((list_org_from_user())::text[]))));



