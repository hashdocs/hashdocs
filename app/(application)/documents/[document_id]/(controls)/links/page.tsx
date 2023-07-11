"use client";
import EmptyLinks from "./_components/emptyLinks";
import LinkRow from "./_components/linkRow";
import { useContext } from "react";
import { DocumentsContext } from "../../../_components/documentsProvider";
import { useRouter } from "next/navigation";

/*=========================================== COMPONENT ===========================================*/

export default function LinksPage({
  params: { document_id }, // will be a page or nested layout
}: {
  params: { document_id: string };
}) {
  const _documentsContext = useContext(DocumentsContext);
  const router = useRouter();

  if (!_documentsContext) return null;

  const { documents } = _documentsContext;

  const document = documents.find((doc) => doc.document_id === document_id);

  if (!document) {
    router.push(`/documents`);
    return null;
  }

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
