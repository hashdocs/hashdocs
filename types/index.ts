import { Merge } from 'type-fest';
import { Tables } from './supabase.types';

export * from './supabase.types';

/* ----------------------------------- ORG ---------------------------------- */

export type OrgType = Tables<'tbl_org'> & {
  user: Tables<'tbl_org_members'>;
  members: Tables<'tbl_org_members'>[];
};

/* -------------------------------- DOCUMENT -------------------------------- */

export type DocumentType = Merge<
  Tables<'view_documents'>,
  {
    is_enabled: boolean;
    document_id: string;
    org_id: string;
  }
>;
