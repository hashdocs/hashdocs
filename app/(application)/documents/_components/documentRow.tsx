'use client';
import Button from '@/app/_components/button';
import { ThumbnailImage } from '@/app/_components/shared/thumbnail';
import { DocumentType } from '@/types';
import Link from 'next/link';
import { IoEye, IoLink } from 'react-icons/io5';
import {
    DocumentRowButtons
} from './documentButtons';

/*=========================================== MAIN COMPONENT FUNCTION ===========================================*/

const DocumentRow: React.FC<{ document: DocumentType }> = ({ document }) => {
  const {
    document_id,
    document_name,
    thumbnail_image,
    is_enabled,
    total_links_count,
    total_views_count,
    active_links_count,
  } = document;

  /* --------------------------------- RENDER --------------------------------- */

  return (
    <li
      key={document_id}
      className="my-2 flex items-center justify-between space-x-4 rounded-md bg-white p-4 shadow-sm"
    >
      <div className="flex w-1/2 items-center space-x-4">
        <ThumbnailImage src={thumbnail_image} document_id={document_id} />
        <div className="flex flex-col space-y-2">
          <Link href={`/documents/${document_id}/links`}>
            <h4 className="w-full overflow-hidden text-base font-semibold hover:text-blue-700 hover:underline">
              {document_name}
            </h4>
          </Link>
          <div className="flex items-center gap-x-4 ">
            <Link href={`/documents/${document_id}/links`}>
              <Button
                size="sm"
                variant="outline"
                className="flex w-24 items-center gap-x-1 !text-gray-600 hover:!text-blue-700"
              >
                <IoLink className="h-4 w-4" />
                <span>{`${total_links_count} links`}</span>
              </Button>
            </Link>
            <Link href={`/documents/${document_id}/views`}>
              <Button
                size="sm"
                variant="outline"
                className="flex w-24 items-center gap-x-1 !text-gray-600 hover:!text-blue-700"
              >
                <IoEye className="h-4 w-4" />
                <span>{`${total_views_count} views`}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <DocumentRowButtons document={document} />
      {/* <EditLinkModal
        isOpen={showNewLinkModal}
        setIsOpen={setShowNewLinkModal}
        link_id={null}
        {...props}
      />
      <UploadDocumentModal
        isOpen={showUpdateDocumentModal}
        setIsOpen={setShowUpdateDocumentModal}
        document_id={document_id}
        document_name={document_name}
      /> */}
    </li>
  );
};

export default DocumentRow;
