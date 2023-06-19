DROP TRIGGER IF EXISTS trigger_before_insert_tbl_views ON tbl_views;

DROP FUNCTION IF EXISTS func_before_insert_tbl_views();

CREATE OR REPLACE FUNCTION func_before_insert_tbl_views()
	RETURNS TRIGGER
	SECURITY DEFINER
	LANGUAGE plpgsql
	AS $$
BEGIN
    NEW.view_id := gen_view_id(NEW.link_id);
    RETURN NEW; 
END
$$;

CREATE OR REPLACE TRIGGER trigger_before_insert_tbl_views
	BEFORE INSERT ON tbl_views
	FOR EACH ROW
	EXECUTE FUNCTION func_before_insert_tbl_views();

