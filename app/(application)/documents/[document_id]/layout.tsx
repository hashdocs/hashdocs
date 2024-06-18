import DocumentHeader from '@/app/(application)/documents/[document_id]/_components/documentHeader';
import { redirect } from 'next/navigation';
import { getDocument } from '../_actions/documents.actions';
import { DocumentTabs } from './_components/documentTabs';

export default async function DocumentIdLayout({
  children,
  params: { document_id }, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { document_id: string };
}) {
  const document = await getDocument({ document_id });

  if (!document) {
    redirect('/documents');
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-50 bg-gray-50">
        <DocumentHeader document={document} />
        <DocumentTabs document={document} />
      </div>
      {children}
    </div>
  );
}
