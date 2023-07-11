"use client";
import {
  DocumentsContextType,
  DocumentType,
  ViewType,
} from "@/types/documents.types";
import { createContext, useEffect, useState } from "react";

export const DocumentsContext = createContext<DocumentsContextType | null>(
  null
);

export default function DocumentsProvider({
  children,
  documents_data,
}: {
  children: React.ReactNode;
  documents_data: DocumentType[];
}) {
  const [documents, setDocuments] = useState<DocumentType[]>(documents_data);
  const [showViewAnalyticsModal, setShowViewAnalyticsModal] = useState<
    string | null
  >(null);

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        setDocuments,
        showViewAnalyticsModal,
        setShowViewAnalyticsModal,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}
