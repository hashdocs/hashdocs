/*=========================================== COMPONENT ===========================================*/

import { Database } from "@/types/supabase.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import DocumentsProvider from "./_components/documentsProvider";
import { DocumentType } from "@/types/documents.types";

async function getDocuments() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data, error } = await supabase
    .rpc("get_documents")
    .returns<DocumentType[]>();

  if (error) throw error;

  return data;
}

export default async function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const documents = await getDocuments();

  return <DocumentsProvider documents_data={documents}>{children}</DocumentsProvider>;
}
