import { Merge } from 'type-fest';
import { Tables } from './supabase.types';

export * from './supabase.types';

/* ----------------------------------- ORG ---------------------------------- */

export type OrgType = Merge<
  Tables<'tbl_org'>,
  {
    stripe_metadata: StripeMetdata;
  }
> & {
  members: Tables<'tbl_org_members'>[];
};

/* -------------------------------- DOCUMENT -------------------------------- */

export type DocumentType = Merge<
  Tables<'view_documents'>,
  {
    is_enabled: boolean;
    document_id: string;
    org_id: string;
    updated_at: string;
    document_name: string;
    page_count: number;
    source_path: string;
    source_type: string;
    document_version: number;
  }
>;

export type DocumentDetailType = Merge<
  {
    links: Tables<'tbl_links'>[];
    views: ViewType[];
    versions: Tables<'tbl_document_versions'>[];
  },
  DocumentType
>;

/* ---------------------------------- LINK ---------------------------------- */

export type LinkViewType = Merge<Tables<'tbl_links'>, DocumentType>;

/* ---------------------------------- VIEW ---------------------------------- */

export type ViewType = Merge<
  Tables<'view_logs'>,
  {
    geo: {
      city?: string;
      region?: string;
      country?: string;
    } | null;
    view_id: string;
    viewer: string;
    viewed_at: string;
    link_id: string;
    document_id: string;
    org_id: string;
    completion: number;
    duration: number;
    view_logs: Record<string, number>;
  }
>;

export type ViewCookieType = {
  document_id: string;
  org_id: string;
  view_id: string;
  viewer: string;
  ip?: string;
};

/* --------------------------------- COLORS --------------------------------- */

export const enum_colors = [
  '#B4876E',
  '#A5B337',
  '#06CF9C',
  '#25D366',
  '#02A698',
  '#7D9EF1',
  '#007BFC',
  '#5E47DE',
  '#7F66FF',
  '#9333EA',
  '#FA6533',
  '#C4532D',
  '#DC2626',
  '#FF2E74',
  '#DB2777',
];

/* --------------------------------- BILLING -------------------------------- */

export type StripeMetdata = {
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  billing_cycle_start?: string;
  billing_cycle_end?: string;
  subscription_status?: string;
};
