"use client";
import EmptyLinks from "./_components/emptyLinks";
import LinkRow from "./_components/linkRow";
import { getDocuments } from "../layout";
import { useContext } from "react";
import { DocumentIdContext } from "../_components/documentHeader";

/*=========================================== COMPONENT ===========================================*/

export default function LinksPage({
  params: { document_id }, // will be a page or nested layout
}: {
  params: { document_id: string };
}) {
  const _documentIdContext = useContext(DocumentIdContext);

  if (!_documentIdContext) return null;

  const { document } = _documentIdContext;

  return document.links.length > 0 ? (
    <ul role="list" className="flex flex-col py-4">
      {document.links &&
        document.links.map((link) => (
          <LinkRow link={link} document={document} key={link.link_id} />
        ))}
    </ul>
  ) : (
    <EmptyLinks document_id={document_id} />
  );
}
