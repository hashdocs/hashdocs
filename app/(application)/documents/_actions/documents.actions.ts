'use server';

import {
    createServerActionClient,
    createServerComponentClient,
} from '@/app/_utils/supabase';
import { DocumentDetailType, DocumentType } from '@/types';
import { cookies } from 'next/headers';

export async function uploadDocument({
  document_id,
  path,
  source_path,
  document_name,
  source_type,
  org_id,
}: {
  document_id?: string;
  path: string;
  source_path: string;
  document_name?: string;
  source_type?: string;
  org_id: string;
}) {
  try {
    const supabase = createServerActionClient({ cookies: cookies() });

    const lastDot = source_path.lastIndexOf('.');
    const name_without_extension =
      lastDot === -1 ? source_path : source_path.substring(0, lastDot);

    const { data: new_document_data, error: new_document_error } =
      await supabase
        .rpc('upsert_document', {
          org_id_input: org_id,
          document_id_input: document_id,
          document_name_input: document_name ?? name_without_extension,
          source_path_input: source_path,
          source_type_input: source_type ?? 'LOCAL',
        })
        .returns<DocumentType>();

    if (new_document_error || !new_document_data) {
      throw new_document_error;
    }

    const { data: _document_upload_path, error: document_upload_error } =
      await supabase.storage
        .from('documents')
        .move(
          path,
          `${new_document_data.org_id}/${new_document_data.document_id}/${new_document_data.document_version}.pdf`
        );

    if (document_upload_error || !_document_upload_path) {
      throw document_upload_error;
    }

    // supabase.functions.invoke('upload-document', {
    //   body: JSON.stringify({ document_id }),
    // });

    return new_document_data;
  } catch (error: any) {
    console.error(error);
    return;
  }
}

export async function getDocument({ document_id }: { document_id: string }) {
  const supabase = createServerComponentClient({ cookies: cookies() });

  try {
    const { data: document, error } = await supabase
      .rpc('get_document', {
        document_id_input: document_id,
      })
      .returns<DocumentDetailType>();

    if (error) {
      throw error;
    }

    return document;
  } catch (error: any) {
    console.error(error);
    return;
  }
}
