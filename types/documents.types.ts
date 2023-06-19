import { Database } from "./supabase.types";

export type ViewType = Database["public"]["Tables"]["tbl_views"]["Row"] & {
  duration: string;
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
  };

export type GetLinkProps = Database["public"]["Tables"]["tbl_links"]["Row"] &
  Database["public"]["Tables"]["tbl_documents"]["Row"] &
  Database["public"]["Tables"]["tbl_document_versions"]["Row"];

export interface documentTabType {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<any>;
  stats: number | null;
}

export type DocumentContextType = {
  document: DocumentType;
  setDocument: (prevDocument: DocumentType) => void;
};
