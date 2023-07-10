import DocumentHeader from "@/app/(application)/documents/[document_id]/(controls)/_components/documentHeader";
import { useContext, useMemo } from "react";
import { DocumentsContext } from "../../_components/documentsProvider";
import Loader from "@/app/_components/navigation/loader";
import { GetViewLogs, DocumentType } from "@/types/documents.types";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase.types";

export async function getDocument(document_id: string) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: document_id_data, error: document_id_error } = await supabase
    .rpc("get_documents")
    .returns<DocumentType[]>();

  const document =
    document_id_data?.find((doc) => doc.document_id === document_id) ?? null;

  return document;
}

async function getViewLogs(document_id: string) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: view_logs, error: document_id_error } = await supabase
    .rpc("get_views", { document_id_input: document_id })
    .returns<GetViewLogs>();

  return view_logs;
}

/*=========================================== COMPONENT ===========================================*/

export default async function DocumentIdLayout({
  children,
  params: { document_id }, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { document_id: string };
}) {
  const [document, viewLogs] = await Promise.all([
    getDocument(document_id),
    getViewLogs(document_id),
  ]);

  return !document || !viewLogs ? (
    <Loader />
  ) : (
    <DocumentHeader document={document} viewLogs={viewLogs}>
      {children}
    </DocumentHeader>
  );
}
