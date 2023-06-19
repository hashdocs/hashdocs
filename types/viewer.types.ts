import { Database } from "./supabase.types";

export type AuthorizeViewerType = {
  view_token: string;
  view: Database["public"]["Tables"]["tbl_views"]["Row"];
};
