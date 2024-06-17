import { redirect } from 'next/navigation';
import { getDocument } from '../../_actions/documents.actions';
import EmptyLinks from './_components/emptyLinks';
import LinkRow from './_components/linkRow';

export default async function LinksPage({
  params: { document_id }, // will be a page or nested layout
}: {
  params: { document_id: string };
}) {
  const document = await getDocument({ document_id });

  if (!document) {
    redirect('/documents');
  }

  return document.links.length > 0 ? (
    <ul className="flex flex-col py-4">
      {document.links.map((link) => (
        <LinkRow
          document={document}
          key={link.link_id}
          link_id={link.link_id}
        />
      ))}
    </ul>
  ) : (
    <EmptyLinks document={document} />
  );
}
