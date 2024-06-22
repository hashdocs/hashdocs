import { createServerComponentClient } from '@/app/_utils/supabase';
import { DocumentType } from '@/types';
import { cookies } from 'next/headers';
import { PageHeader } from '../_components/pageHeader';
import DocumentHeader from './[document_id]/_components/documentHeader';
import EmptyDocuments from './_components/emptyDocuments';
import { UploadDocumentButton } from './_components/uploadDocument';

async function getDocuments({ org_id }: { org_id: string }) {
  const supabase = createServerComponentClient({ cookies: cookies() });

  const { data: documents, error } = await supabase
    .from('view_documents')
    .select('*')
    .eq('org_id', org_id)
    .order('created_at', { ascending: false })
    .returns<DocumentType[]>();

  if (error) {
    throw error;
  }

  return documents || [];
}

export default async function Page({
  params: { org_id },
}: {
  params: { org_id: string };
}) {
  const _documents = await getDocuments({ org_id });

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col">
      <div className="mb-8 flex items-center justify-between">
        <PageHeader />
        <UploadDocumentButton documents={_documents} />
      </div>

      <ul role="list" className="flex w-full flex-1 flex-col">
        {_documents.length > 0 ? (
          _documents.map((document) => (
            <li
              key={document.document_id}
              className="my-2 rounded-md bg-white p-2 shadow-sm md:p-4"
            >
              <DocumentHeader document={document} />
            </li>
          ))
        ) : (
          <EmptyDocuments />
        )}
      </ul>
    </div>
  );
}
