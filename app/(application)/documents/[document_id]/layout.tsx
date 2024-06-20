import DocumentHeader from '@/app/(application)/documents/[document_id]/_components/documentHeader';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';
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
    <div className="flex flex-1 flex-col w-full mx-auto max-w-screen-xl">
      <div className="sticky top-0 z-50 bg-gray-50 flex flex-col gap-y-4">
        <Link
          href="/documents"
          className="flex items-center gap-x-1 pt-2 text-xs text-gray-500 hover:text-blue-700"
        >
          <MdArrowBack className="" />
          Back to documents
        </Link>
        <DocumentHeader document={document} is_document_detail_page />
        <DocumentTabs document={document} />
      </div>
      {children}
    </div>
  );
}
