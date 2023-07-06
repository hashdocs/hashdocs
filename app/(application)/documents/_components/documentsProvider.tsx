"use client";
import {
  DocumentsContextType,
  DocumentType,
  GetViewLogs,
  ViewType,
} from "@/types/documents.types";
import { createContext, useEffect, useState } from "react";

export const DocumentsContext = createContext<DocumentsContextType | null>(
  null
);

async function getDocuments(): Promise<DocumentType[]> {
  const res = await fetch(`/api/documents`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Could not fetch documents");
  }

  const documents = await res.json();

  return documents;
}

export default function DocumentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [documents, setDocuments] = useState<DocumentType[] | null>(null);
  const [showViewAnalyticsModal, setShowViewAnalyticsModal] = useState<
    string | null
  >(null);
  const [viewLogs, setViewLogs] = useState<GetViewLogs | null>(null);

  useEffect(() => {
    getDocuments()
      .then((documents) => {
        setDocuments(documents);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        setDocuments,
        showViewAnalyticsModal,
        setShowViewAnalyticsModal,
        viewLogs,
        setViewLogs,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}
