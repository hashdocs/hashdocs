"use client";
import EmptyLinks from "./_components/emptyLinks";
import LinkRow from "./_components/linkRow";

import { useContext } from "react";
import { DocumentsContext } from "../../../_components/documentsProvider";
import AnalyticsModal from "../analytics/_components/analyticsModal";

/*=========================================== COMPONENT ===========================================*/

export default function LinksPage({
  params: { document_id }, // will be a page or nested layout
}: {
  params: { document_id: string };
}) {
  const _documents = useContext(DocumentsContext);

  if (!_documents) throw Error("Error in fetching documents");

  const { documents, setDocuments, showViewAnalyticsModal, setShowViewAnalyticsModal } = _documents;

  const document =
    documents?.find((document) => document.document_id === document_id) ?? null;

  if (!document) throw Error("Error in fetching document data");

  return document && document.links.length > 0 ? (
    <>
      <ul role="list" className="flex flex-col py-4">
        {document.links &&
          document.links.map((link) => (
            <LinkRow key={link.link_id} {...link} />
          ))}
      </ul>
      <AnalyticsModal
        viewId={showViewAnalyticsModal}
        setViewId={setShowViewAnalyticsModal}
        document_id={document_id}
      />
    </>
  ) : (
    <EmptyLinks document_id={document_id} />
  );
}
