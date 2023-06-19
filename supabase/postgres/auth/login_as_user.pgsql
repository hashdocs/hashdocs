CREATE OR REPLACE PROCEDURE auth.login_as_user(user_email text)
LANGUAGE plpgsql
AS $$
DECLARE
	auth_user auth.users;
BEGIN
	SELECT
		* INTO auth_user
	FROM
		auth.users
	WHERE
		email = user_email;
	EXECUTE format('set request.jwt.claim.sub=%L',(auth_user).id::text);
	EXECUTE format('set request.jwt.claim.role=%I',(auth_user).ROLE);
	EXECUTE format('set request.jwt.claim.email=%L',(auth_user).email);
	EXECUTE format('set request.jwt.claims=%L', json_strip_nulls(json_build_object('app_metadata',(auth_user).raw_app_meta_data))::text);
	RAISE NOTICE '%', format('set role %I; -- logging in as %L (%L)',(auth_user).ROLE,(auth_user).id,(auth_user).email);
	EXECUTE format('set role %I',(auth_user).ROLE);
END;
$$;

