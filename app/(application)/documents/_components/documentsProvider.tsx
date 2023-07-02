"use client";
import { DocumentsContextType, DocumentType } from "@/types/documents.types";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
    <DocumentsContext.Provider value={{ documents, setDocuments }}>
      {children}
    </DocumentsContext.Provider>
  );
}
