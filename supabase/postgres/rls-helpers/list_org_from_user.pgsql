DROP FUNCTION IF EXISTS list_org_from_user;

CREATE OR REPLACE FUNCTION list_org_from_user()
	RETURNS uuid
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $$
BEGIN
	RETURN (
		SELECT
			org_id
		FROM
			tbl_org
		WHERE
			user_id = auth.uid());
END
$$;

