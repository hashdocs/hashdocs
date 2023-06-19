SET check_function_bodies = OFF;

CREATE OR REPLACE PROCEDURE auth.login_as_anon()
LANGUAGE plpgsql
AS $procedure$
BEGIN
	SET request.jwt.claim.sub = '';
	SET request.jwt.claim.role = '';
	SET request.jwt.claim.email = '';
	SET request.jwt.claims = '';
	SET ROLE anon;
END;
$procedure$;

CREATE OR REPLACE PROCEDURE auth.login_as_user(IN user_email text)
LANGUAGE plpgsql
AS $procedure$
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
$procedure$;

CREATE OR REPLACE PROCEDURE auth.logout()
LANGUAGE plpgsql
AS $procedure$
BEGIN
	SET request.jwt.claim.sub = '';
	SET request.jwt.claim.role = '';
	SET request.jwt.claim.email = '';
	SET request.jwt.claims = '';
	SET ROLE postgres;
END;
$procedure$;

