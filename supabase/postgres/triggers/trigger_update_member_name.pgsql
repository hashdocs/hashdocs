CREATE OR REPLACE FUNCTION func_update_member_name()
RETURNS trigger
SECURITY DEFINER
SET SEARCH_PATH = auth, public
AS $$
BEGIN
    
    UPDATE public.tbl_org_members 
        SET member_name = COALESCE(NEW.raw_user_meta_data->>'name', tbl_org_members.member_name), 
        member_image = COALESCE(NEW.raw_user_meta_data->>'avatar_url', tbl_org_members.member_image) 
    WHERE tbl_org_members.user_id = NEW.id;

    RETURN NEW;
    
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_member_name
AFTER INSERT OR UPDATE ON auth.users 
FOR EACH ROW EXECUTE FUNCTION func_update_member_name();