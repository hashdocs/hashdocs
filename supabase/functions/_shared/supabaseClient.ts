import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import type { Database } from "../../../types/supabase.types.ts";

export const supabase = createClient<Database>(
  // Supabase API URL - env var exported by default.
  Deno.env.get("SUPABASE_URL")!,
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get("SUPABASE_ANON_KEY")!
);


export const supabaseAdmin = createClient<Database>(
  // Supabase API URL - env var exported by default.
  Deno.env.get("SUPABASE_URL")!,
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);


export type ViewType = Database["public"]["Tables"]["tbl_views"]["Row"] & {
  duration: number;
  completion: number;
};

export type LinkType = Database["public"]["Tables"]["tbl_links"]["Row"] & {
  view_count: number;
  views: ViewType[];
};

export type DocumentType =
  Database["public"]["Tables"]["tbl_documents"]["Row"] & {
    total_view_count: number;
    total_links_count: number;
    links: LinkType[];
    document_version: number;
  };