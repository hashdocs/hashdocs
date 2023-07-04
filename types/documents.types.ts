import { Dispatch, SetStateAction } from "react";
import { Database } from "./supabase.types";

export type ViewType = Database["public"]["Tables"]["tbl_views"]["Row"] & {
  duration: number;
  completion: number;
  view_logs?: {
    view_id: string;
    page_num: number;
    duration: number;
  }[];
  page_count?: number;
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
    updated_at: string;
  };

export type GetLinkProps = Database["public"]["Tables"]["tbl_links"]["Row"] &
  Database["public"]["Tables"]["tbl_documents"]["Row"] &
  Database["public"]["Tables"]["tbl_document_versions"]["Row"];

export type GetViewLogs =
  Database["public"]["Tables"]["tbl_documents"]["Row"] & {
    links: LinkType[];
  };

export interface documentTabType {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<any>;
  stats: number | null;
}

export type DocumentsContextType = {
  documents: DocumentType[] | null;
  setDocuments: Dispatch<SetStateAction<DocumentType[] | null>>;
  showViewAnalyticsModal: string | null;
  setShowViewAnalyticsModal: Dispatch<SetStateAction<string | null>>;
};
