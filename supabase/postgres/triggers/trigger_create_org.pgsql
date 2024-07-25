CREATE OR REPLACE FUNCTION func_create_org()
RETURNS trigger
SECURITY DEFINER
SET SEARCH_PATH = auth, public
AS $$
DECLARE
    org_id uuid;
BEGIN
    
    SELECT create_org(NEW.email) INTO org_id;

    RETURN NEW;
    
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_create_org
BEFORE INSERT ON auth.users 
FOR EACH ROW EXECUTE FUNCTION func_create_org();