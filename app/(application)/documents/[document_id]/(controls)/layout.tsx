import DocumentHeader from "@/app/(application)/documents/[document_id]/(controls)/_components/documentHeader";
import { DocumentType } from "@/types/documents.types";
import { Database } from "@/types/supabase.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/*=========================================== COMPONENT ===========================================*/

export default async function DocumentIdLayout({
  children,
  params: { document_id }, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { document_id: string };
}) {

  return (
    <DocumentHeader>
      {children}
    </DocumentHeader>
  );
}
