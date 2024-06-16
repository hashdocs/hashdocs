import DocumentHeader from '@/app/(application)/documents/[document_id]/(controls)/_components/documentHeader';

/*=========================================== COMPONENT ===========================================*/

export default async function DocumentIdLayout({
  children,
  params: { document_id }, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { document_id: string };
}) {
  return <DocumentHeader>{children}</DocumentHeader>;
}
