import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import type { Database } from "../../../types/supabase.types.ts";

export const supabase = createClient<Database>(
  // Supabase API URL - env var exported by default.
  Deno.env.get("SUPABASE_URL")!,
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get("SUPABASE_ANON_KEY")!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export const supabaseAdmin = createClient<Database>(
  // Supabase API URL - env var exported by default.
  Deno.env.get("SUPABASE_URL")!,
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export type ViewType = Database["public"]["Tables"]["tbl_views"]["Row"] & {
  duration: number;
  completion: number;
  view_logs: {
    view_id: string;
    page_num: number;
    duration: number;
  }[];
  page_count: number;
};

export type LinkType = Database["public"]["Tables"]["tbl_links"]["Row"] & {
  views: ViewType[];
};

export type DocumentType =
  Database["public"]["Tables"]["tbl_documents"]["Row"] & {
    links: LinkType[];
    versions: Database["public"]["Tables"]["tbl_document_versions"]["Row"][];
  };
export type OrgType = Database["public"]["Tables"]["tbl_org"]["Row"] & {
  users: (Database["public"]["Tables"]["tbl_org_members"]["Row"] & {
    email: string;
  })[];
};

export type InsertPayload = {
  type: "INSERT";
  table: string;
  schema: string;
  record: Record<string, any>;
  old_record: null;
};
