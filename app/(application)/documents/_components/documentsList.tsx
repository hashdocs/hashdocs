"use client";
import { useEffect, useState } from "react";
import { DocumentType } from "@/types/documents.types";
import DocumentRow from "./documentRow";
import Loader from "@/app/_components/navigation/loader";
import { useRouter } from "next/navigation";
import EmptyDocuments from "./emptyDocuments";

/*=========================================== MAIN COMPONENT FUNCTION ===========================================*/

const DocumentsList: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    async function fetchDocuments() {
      try {
        const res = await fetch("/api/documents", {
          method: "GET",
          next: { revalidate: 0 },
        });

        const documents = await res.json();
        setDocuments(documents);
      } catch (e) {
        setDocuments(null);
      }
      setIsLoading(false);
    }

    fetchDocuments();
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <ul role="list" className="flex w-full flex-1 flex-col">
      {documents && documents.length > 0 ? (
        documents.map((document) => (
          <DocumentRow key={document.document_id} {...document} />
        ))
      ) : (
        <EmptyDocuments />
      )}
    </ul>
  );
};

export default DocumentsList;
