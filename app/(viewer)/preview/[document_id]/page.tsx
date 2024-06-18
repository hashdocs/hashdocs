import { getDocumentPath } from '@/app/_utils/common';
import { createServerComponentClient } from '@/app/_utils/supabase';
import { DocumentType } from '@/types';
import { cookies } from 'next/headers';
import PDFViewerPage from '../../_components/pdf_viewer_page';
import ViewerTopBar from '../../_components/viewerTopbar';
import InvalidLink from '../../d/[link_id]/_components/invalid_link';

export const revalidate = 0;

async function getSignedURL({ document_id }: { document_id: string }) {
  const supabase = createServerComponentClient({ cookies: cookies() });

  const { data: document_props, error: document_error } = await supabase
    .from('view_documents')
    .select('*')
    .eq('document_id', document_id)
    .maybeSingle();

  if (document_error || !document_props) {
    return null;
  }

  const signed_url = getDocumentPath({ document: document_props as DocumentType });

  return { signed_url, document_props };
}

export default async function InternalViewerPage({
  params: { document_id },
}: {
  params: { document_id: string };
}) {
  const props = await getSignedURL({ document_id });

  return props ? (
    <main className="flex h-screen w-full flex-1 flex-col">
      <div className="sticky top-0 z-10 w-full">
        <ViewerTopBar
          preview
          is_download_allowed
          document_name={props.document_props.document_name}
          updated_by={props.document_props.updated_by}
        />
      </div>
      <div className=" flex max-h-screen w-full flex-1 justify-center overflow-hidden">
        <PDFViewerPage signedURL={props.signed_url} />;
      </div>
    </main>
  ) : (
    <InvalidLink />
  );
}
