import Button from '@/app/_components/button';
import { createServerComponentClient } from '@/app/_utils/supabase';
import { DocumentType } from '@/types';
import { cookies } from 'next/headers';
import { HiDocumentArrowUp } from 'react-icons/hi2';
import { primaryNavigation } from '../_components/sidebar/nav.constants';
import DocumentRow from './_components/documentRow';
import EmptyDocuments from './_components/emptyDocuments';

async function getDocuments() {
  const supabase = createServerComponentClient({ cookies: cookies() });

  const { data: documents, error } = await supabase
    .from('view_documents')
    .select('*')
    .order('created_at', { ascending: false }).returns<DocumentType[]>();

  if (error) {
    throw error;
  }

  return documents || [];
}

export default async function Page() {
  const _documents = await getDocuments();

  const pageProps = primaryNavigation.find((p) => p.path === '/documents');

  if (!pageProps) {
    throw new Error('Could not load pag properties');
  }

  return (
    <div className="flex flex-1 flex-col py-2">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col items-start gap-y-1">
          <h3 className="text-lg font-semibold">{pageProps.name}</h3>
          <p className="text-sm text-gray-400">{pageProps.description}</p>
        </div>
        <Button className="flex items-center gap-x-1" variant="solid" size="md">
          <HiDocumentArrowUp className="h-4 w-4" />
          <span className="text-sm font-semibold">Upload Document</span>
        </Button>
      </div>
      <ul role="list" className="flex w-full flex-1 flex-col">
        {_documents.length > 0 ? (
          _documents.map((document) => (
            <DocumentRow
              key={document.document_id}
              document={document}
            />
          ))
        ) : (
          <EmptyDocuments />
        )}
      </ul>
    </div>
  );
}
