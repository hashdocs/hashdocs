DROP TRIGGER IF EXISTS trigger_before_insert_tbl_links ON tbl_links;

DROP FUNCTION IF EXISTS func_before_insert_tbl_links();

CREATE OR REPLACE FUNCTION func_before_insert_tbl_links()
	RETURNS TRIGGER
	SECURITY DEFINER
	LANGUAGE plpgsql
	AS $$
BEGIN
    NEW.link_id := gen_links_id();
    RETURN NEW; 
END
$$;

CREATE OR REPLACE TRIGGER trigger_before_insert_tbl_links
	BEFORE INSERT ON tbl_links
	FOR EACH ROW
	EXECUTE FUNCTION func_before_insert_tbl_links();

