"use client";
import DocumentHeader from "@/app/(application)/documents/[document_id]/(controls)/_components/documentHeader";
import { useContext, useMemo } from "react";
import { DocumentsContext } from "../../_components/documentsProvider";
import Loader from "@/app/_components/navigation/loader";
import { GetViewLogs } from "@/types/documents.types";

/*=========================================== COMPONENT ===========================================*/

export default function DocumentIdLayout({
  children,
  params: { document_id }, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { document_id: string };
}) {
  const _documents = useContext(DocumentsContext);

  if (!_documents) throw Error("Error in fetching documents");

  const { documents, setViewLogs } = _documents;

  const document =
    documents?.find((document) => document.document_id === document_id) ?? null;

  useMemo(() => {
    const getViewLogs = async () => {
      const res = await fetch(`/api/documents/${document_id}/views`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) {
        return;
      }
      if (res.status === 200) {
        const data = (await res.json()) as GetViewLogs;
        setViewLogs(data);
      }
    };

    getViewLogs();
  }, [document_id]);

  return !document ? (
    <Loader />
  ) : (
    <DocumentHeader document={document}>{children}</DocumentHeader>
  );
}
