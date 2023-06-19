CREATE OR REPLACE PROCEDURE auth.login_as_anon()
LANGUAGE plpgsql
AS $$
BEGIN
	SET request.jwt.claim.sub = '';
	SET request.jwt.claim.role = '';
	SET request.jwt.claim.email = '';
	SET request.jwt.claims = '';
	SET ROLE anon;
END;
$$;

