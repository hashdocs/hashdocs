import EmptyLinks from "./_components/emptyLinks";
import LinkRow from "./_components/linkRow";
import { getDocument } from "../layout";

/*=========================================== COMPONENT ===========================================*/

export default async function LinksPage({
  params: { document_id }, // will be a page or nested layout
}: {
  params: { document_id: string };
}) {
  const document = await getDocument(document_id);

  if (!document) return null;

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
