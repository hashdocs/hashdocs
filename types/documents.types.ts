import { Dispatch, SetStateAction } from "react";
import { Database } from "./supabase.types";

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

export type GetLinkProps = Database["public"]["Tables"]["tbl_links"]["Row"] &
  Database["public"]["Tables"]["tbl_documents"]["Row"] &
  Database["public"]["Tables"]["tbl_document_versions"]["Row"];


export interface documentTabType {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<any>;
  stats: number | null;
}

export type DocumentsContextType = {
  documents: DocumentType[];
  setDocuments: Dispatch<SetStateAction<DocumentType[]>>;
  showViewAnalyticsModal: string | null;
  setShowViewAnalyticsModal: Dispatch<SetStateAction<string | null>>;
};

export type SignedUrlType = {
  version: number;
  path: string;
  signed_url:string
}

export type DocumentIdContextType = {
  document: DocumentType;
  urls: SignedUrlType[]
}