import { createServerComponentClient } from '@/app/_utils/supabase';
import { DocumentType } from '@/types';
import { cookies } from 'next/headers';
import { PageHeader } from '../_components/pageHeader';
import DocumentHeader from './[document_id]/_components/documentHeader';
import EmptyDocuments from './_components/emptyDocuments';
import { UploadDocumentButton } from './_components/uploadDocument';

async function getDocuments() {
  const supabase = createServerComponentClient({ cookies: cookies() });

  const { data: documents, error } = await supabase
    .from('view_documents')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<DocumentType[]>();

  if (error) {
    throw error;
  }

  return documents || [];
}

export default async function Page() {
  const _documents = await getDocuments();

  return (
    <div className="flex flex-1 flex-col w-full max-w-screen-xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <PageHeader />
        <UploadDocumentButton documents={_documents} />
      </div>

      <ul role="list" className="flex w-full flex-1 flex-col">
        {_documents.length > 0 ? (
          _documents.map((document) => (
            <li
              key={document.document_id}
              className="my-2 bg-white rounded-md p-2 md:p-4 shadow-sm"
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
