CREATE OR REPLACE PROCEDURE auth.logout()
LANGUAGE plpgsql
AS $$
BEGIN
	SET request.jwt.claim.sub = '';
	SET request.jwt.claim.role = '';
	SET request.jwt.claim.email = '';
	SET request.jwt.claims = '';
	SET ROLE postgres;
END;
$$;

