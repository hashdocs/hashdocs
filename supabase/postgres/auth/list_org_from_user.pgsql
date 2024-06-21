DROP FUNCTION IF EXISTS list_org_from_user();

CREATE OR REPLACE FUNCTION list_org_from_user()
	RETURNS uuid[]
	LANGUAGE plpgsql
	STABLE
	SECURITY DEFINER
	AS $$
BEGIN
	RETURN(
		SELECT ARRAY_AGG(elem::uuid)
	FROM (
	SELECT jsonb_array_elements_text(((auth.jwt()->>'app_metadata')::jsonb->'org_ids')) AS elem
	) sub);
END
$$;