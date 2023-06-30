DROP TRIGGER IF EXISTS trigger_after_insert_auth_users ON auth.users;

DROP FUNCTION IF EXISTS public.func_after_insert_auth_users();

CREATE OR REPLACE FUNCTION public.func_after_insert_auth_users()
	RETURNS TRIGGER
	SECURITY DEFINER
	LANGUAGE plpgsql
	SET search_path = public, auth
	AS $$
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
$$;

CREATE OR REPLACE TRIGGER trigger_after_insert_auth_users
	AFTER INSERT ON auth.users
	FOR EACH ROW
	EXECUTE FUNCTION public.func_after_insert_auth_users();

-- -- substring(
-- -- 	NEW.email FROM '^(.+)@') || '''s org');
