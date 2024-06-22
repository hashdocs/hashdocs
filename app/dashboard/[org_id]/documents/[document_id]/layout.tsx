import DocumentHeader from '@/app/dashboard/[org_id]/documents/[document_id]/_components/documentHeader';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';
import { getDocument } from '../_actions/documents.actions';
import { DocumentTabs } from './_components/documentTabs';

export default async function DocumentIdLayout({
  children,
  params: { document_id, org_id }, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { document_id: string, org_id:string };
}) {
  
  const document = await getDocument({ document_id, org_id });

  if (!document) {
    redirect(`/dashboard/${org_id}/documents`);
  }

  return (
    <div className="flex flex-1 flex-col w-full mx-auto max-w-screen-xl">
      <div className="sticky top-0 z-50 bg-gray-50 flex flex-col gap-y-4">
        <Link
          href={`/dashboard/${org_id}/documents`}
          className="flex items-center gap-x-1 pt-2 text-xs text-gray-500 hover:text-blue-700"
        >
          <MdArrowBack className="" />
          Back to documents
        </Link>
        <DocumentHeader document={document} />
        <DocumentTabs document={document} />
      </div>
      {children}
    </div>
  );
}
