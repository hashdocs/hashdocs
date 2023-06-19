"use client";
import { useEffect, useState } from "react";
import { DocumentType } from "@/types/documents.types";
import DocumentRow from "./documentRow";
import Loader from "@/app/_components/navigation/loader";
import { useRouter } from "next/navigation";

/*=========================================== MAIN COMPONENT FUNCTION ===========================================*/

const DocumentsList: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    async function fetchDocuments() {
      const res = await fetch("/api/documents", {
        method: "GET",
        next: { revalidate: 0 },
      });

      const documents = await res.json();

      setDocuments(documents);
      setIsLoading(false);
    }

    fetchDocuments();
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <ul role="list" className="flex flex-col">
      {documents &&
        documents.map((document) => (
          <DocumentRow key={document.document_id} {...document} />
        ))}
    </ul>
  );
};

export default DocumentsList;
