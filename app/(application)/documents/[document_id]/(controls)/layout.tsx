"use client";
import DocumentHeader from "@/app/(application)/documents/[document_id]/(controls)/_components/documentHeader";
import { useContext } from "react";
import { DocumentsContext } from "../../_components/documentsProvider";
import Loader from "@/app/_components/navigation/loader";

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

  const { documents } = _documents;

  const document =
    documents?.find((document) => document.document_id === document_id) ?? null;

  return !document ? (
    <Loader />
  ) : (
    <DocumentHeader document={document}>{children}</DocumentHeader>
  );
}
