"use client";
import { DocumentContext } from "@/app/(application)/documents/[document_id]/(controls)/_components/documentHeader";
import EmptyLinks from "./_components/emptyLinks";
import LinkRow from "./_components/linkRow";

import { useContext } from "react";

/*=========================================== COMPONENT ===========================================*/

export default function LinksPage() {
  const _document = useContext(DocumentContext);

  if (!_document) return null;

  const { document } = _document;

  return document && document.links.length > 0 ? (
    <ul role="list" className="flex flex-col py-4">
      {document.links &&
        document.links.map((link) => <LinkRow key={link.link_id} {...link} />)}
    </ul>
  ) : (
    <EmptyLinks/>
  );
}
