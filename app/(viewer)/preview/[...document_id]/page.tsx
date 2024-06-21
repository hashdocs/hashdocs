import { getDocument } from '@/app/(application)/documents/_actions/documents.actions';
import PDFViewerPage from '../../_components/pdf_viewer_page';
import ViewerTopBar from '../../_components/viewerTopbar';
import { getSignedURL } from '../../d/[link_id]/_actions/link.actions';
import InvalidLink from '../../d/[link_id]/_components/invalid_link';

export default async function InternalViewerPage({
  params,
}: {
  params: { document_id: string[] };
}) {
  const document_id = params.document_id[0];
  
  const document = await getDocument({ document_id });

  if (!document) {
    return <InvalidLink />;
  }

  const document_version = parseInt(params.document_id[1] ?? document.document_version);

  const { signedUrl } = await getSignedURL({
    document_id,
    org_id: document.org_id,
    document_version: document_version,
  });

  return signedUrl ? (
    <main className="flex h-screen w-full flex-1 flex-col">
      <div className="sticky top-0 z-10 w-full">
        <ViewerTopBar
          preview
          document_id={document_id}
          document_version={document_version}
          org_id={document.org_id}
          download_file_name={document.versions.find(d => d.document_version == document_version)?.source_path}
          document_name={document.document_name}
          updated_by={document.updated_by}
        />
      </div>
      <div className=" flex max-h-screen w-full flex-1 justify-center overflow-hidden">
        <PDFViewerPage signedURL={signedUrl} />;
      </div>
    </main>
  ) : (
    <InvalidLink />
  );
}
