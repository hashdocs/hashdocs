CREATE OR REPLACE FUNCTION create_org(new_user_email text)
RETURNS uuid
SECURITY DEFINER
SET SEARCH_PATH = auth, public
AS $$
DECLARE
    new_org_id uuid;
BEGIN
    
    INSERT INTO tbl_org(org_name) VALUES ('My Org') RETURNING org_id INTO new_org_id;

    INSERT INTO tbl_org_members(org_id, email, is_active, is_owner, role) VALUES (new_org_id, new_user_email, true, true, 'admin');

    RETURN new_org_id;
    
END;
$$ LANGUAGE plpgsql;