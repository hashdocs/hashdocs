/*=========================================== COMPONENT ===========================================*/

import DocumentsProvider from "./_components/documentsProvider";

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocumentsProvider>{children}</DocumentsProvider>;
}
