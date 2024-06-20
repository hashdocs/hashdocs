import { createServerComponentClient } from '@/app/_utils/supabase';
import { DocumentDetailType } from '@/types';
import { cookies } from 'next/headers';
import PDFViewerPage from '../../_components/pdf_viewer_page';
import ViewerTopBar from '../../_components/viewerTopbar';
import InvalidLink from '../../d/[link_id]/_components/invalid_link';

export const revalidate = 0;

async function getSignedURL({
  document_id,
  document_version,
}: {
  document_id: string;
  document_version?: number;
}) {
  const supabase = createServerComponentClient({ cookies: cookies() });

  const { data: document, error: document_error } = await supabase
    .rpc('get_document', {
      document_id_input: document_id,
    })
    .returns<DocumentDetailType>();

  if (document_error || !document) {
    return null;
  }

  const token = document.versions.find(v => v.document_version == document_version ?? document.document_version)?.token;

  const signed_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/documents/${document.org_id}/${document.document_id}/${document_version ?? document.document_version}.pdf?token=${token ?? document.token}`

  return { signed_url, document };
}

export default async function InternalViewerPage({
  params,
}: {
  params: { document_id: string[] };
}) {

  const document_id = params.document_id[0];
  const document_version = parseInt(params.document_id[1] ?? 0);

  const props = await getSignedURL({
    document_id,
    document_version: document_version || undefined,
  });
  
  return props ? (
    <main className="flex h-screen w-full flex-1 flex-col">
      <div className="sticky top-0 z-10 w-full">
        <ViewerTopBar
          preview
          is_download_allowed
          document_name={props.document.document_name}
          updated_by={props.document.updated_by}
          version={document_version ?? props.document.document_version}
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
