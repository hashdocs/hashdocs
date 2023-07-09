import { User } from "@supabase/supabase-js";
import { Database } from "./supabase.types";

export type OrgType = Database["public"]["Tables"]["tbl_org"]["Row"] & {
    users: (Database["public"]["Tables"]["tbl_org_members"]["Row"] & {email:string}) [];
  };

export type UserContextType = {
  user: User;
  org: OrgType | null;
}