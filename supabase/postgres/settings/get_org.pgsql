DROP FUNCTION IF EXISTS public.get_org(org_id_input uuid);

CREATE OR REPLACE FUNCTION public.get_org(org_id_input uuid DEFAULT NULL::uuid) 
RETURNS jsonb 
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER 
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
			(
				SELECT 
					row_to_json(tbl_org_members.*) 
				FROM 
					tbl_org_members
				WHERE
					org_id = tbl_org.org_id AND 
					email = auth.email()
			) AS user,
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