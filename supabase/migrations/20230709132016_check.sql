SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.get_org(org_id_input uuid DEFAULT NULL::uuid)
	RETURNS json
	LANGUAGE plpgsql
	SECURITY DEFINER
	SET search_path TO 'auth', 'public'
	AS $function$
DECLARE
	found_org_id uuid;
	return_data json;
BEGIN
	--
	--
	IF (org_id_input IS NOT NULL) THEN
		IF (auth.jwt() ->> 'role' <> 'service_role') THEN
			RAISE EXCEPTION 'Invalid credentials';
		END IF;
	END IF;
	--
	--
	found_org_id := coalesce(list_org_from_user(), org_id_input);
	--
	--
	IF (found_org_id IS NULL) THEN
		RAISE EXCEPTION 'No org found';
	END IF;
	--
	--
	WITH members AS (
		SELECT
			org_member_seq,
			org_id,
			email,
			user_id,
			user_role
		FROM
			tbl_org_members
		LEFT JOIN auth.users ON tbl_org_members.user_id = auth.users.id
	WHERE
		org_id = found_org_id
)
SELECT
	row_to_json(t)
FROM (
	SELECT
		tbl_org.org_id,
		tbl_org.org_name,
		tbl_org.stripe_price_plan,
		tbl_org.stripe_product_plan,
		tbl_org.stripe_customer_id,
		tbl_org.subscription_status,
		tbl_org.billing_cycle_start,
		tbl_org.billing_cycle_end,
		ARRAY (
			SELECT
				row_to_json(members.*)
			FROM
				members
			WHERE
				members.org_id = tbl_org.org_id
			ORDER BY
				org_member_seq) AS users
		FROM
			tbl_org
		LEFT JOIN members ON tbl_org.org_id = members.org_id
	WHERE
		tbl_org.org_id = found_org_id) t INTO return_data;
	--
	--
	RETURN return_data;
END;
$function$;

