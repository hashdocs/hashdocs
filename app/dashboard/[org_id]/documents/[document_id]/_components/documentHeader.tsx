import { DocumentType } from '@/types';
import {
  DocumentName,
  DocumentNewLink,
  DocumentOptionsDropdown,
  DocumentSourceText,
  DocumentSwitch,
  DocumentThumbnail,
  DocumentVersionText,
} from '../../_components/documentButtons';

export default function DocumentHeader({
  document,
}: {
  document: DocumentType;
}) {
  /* --------------------------------- RENDER --------------------------------- */

  return (
    <div className="flex w-full items-center justify-between gap-x-2">
      <div className="flex items-center gap-x-4 overflow-hidden">
        <DocumentThumbnail
          document_id={document.document_id}
          link={`/preview/${document.document_id}`}
          image={document.custom_image ?? document.thumbnail_image}
          className="hidden md:flex"
        />
        <div className="flex flex-col gap-y-1 overflow-hidden">
          <DocumentName
            document={document}
          />
          <DocumentSourceText
            source_path={document.source_path}
            source_type={document.source_type}
          />
          <DocumentVersionText document_version={document.document_version} updated_at={document.updated_at} />
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-x-1">
        <DocumentSwitch document={document} />
        <DocumentNewLink document={document} />
        <DocumentOptionsDropdown document={document} />
      </div>
    </div>
  );
}
