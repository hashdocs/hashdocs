import Button from '@/app/_components/button';
import Dropdown from '@/app/_components/dropdown';
import { ModalRef } from '@/app/_components/modal';
import Switch from '@/app/_components/switch';
import Tooltip from '@/app/_components/tooltip';
import { DocumentType } from '@/types';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { GrDocumentUpdate } from 'react-icons/gr';
import { IoAnalytics, IoEye } from 'react-icons/io5';
import { MdAddLink, MdDelete, MdEditDocument, MdRefresh } from 'react-icons/md';
import useDocument from '../_provider/useDocument';
import LinkModal from './linkModal';

export const DocumentNewLink: React.FC<{ document: DocumentType }> = ({
  document,
}) => {
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <Button
        key={`${document.document_id}-newlink`}
        variant="outline"
        size="sm"
        onClick={() => modalRef.current?.openModal()}
        className="flex items-center gap-x-1 hover:text-blue-700"
        disabled={!document.is_enabled}
      >
        <MdAddLink className={`h-4 w-4`} aria-hidden="true" />
        <span className="">{'New Link'}</span>
      </Button>
      <LinkModal modalRef={modalRef} document={document} />
    </>
  );
};

export const DocumentRefresh: React.FC<{ document: DocumentType }> = ({
  document,
}) => {
  const router = useRouter();

  return (
    <Tooltip content="Refresh document">
      <Button
        key={`${document.document_id}-refresh`}
        variant="icon"
        size="sm"
        onClick={() => router.refresh()}
      >
        <MdRefresh className={`h-5 w-5`} />
      </Button>
    </Tooltip>
  );
};

export const DocumentOptionsDropdown: React.FC<{ document: DocumentType }> = ({
  document,
}) => {
  const router = useRouter();

  const { handleDocumentDelete: handleDelete } = useDocument();

  return (
    <Dropdown
      items={[
        {
          id: 'preview',
          element: (
            <Button
              size="sm"
              variant="white"
              className="flex w-full shrink-0 items-center gap-x-2"
              onClick={() => {
                router.push(`/documents/${document.document_id}`);
              }}
            >
              <IoEye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
          ),
        },
        {
          id: 'link',
          element: (
            <Button
              size="sm"
              variant="white"
              className="flex w-full shrink-0 items-center gap-x-2"
              onClick={() => {
                router.push(`/documents/${document.document_id}`);
              }}
            >
              <GrDocumentUpdate className="h-4 w-4" />
              <span>New Link</span>
            </Button>
          ),
        },
        {
          id: 'edit',
          element: (
            <Button
              size="sm"
              variant="white"
              className="flex w-full shrink-0 items-center gap-x-2"
              onClick={() => {
                router.push(`/documents/${document.document_id}`);
              }}
            >
              <MdEditDocument className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          ),
        },
        {
          id: 'analytics',
          element: (
            <Button
              size="sm"
              variant="white"
              className="flex w-full shrink-0 items-center gap-x-2"
              onClick={() => {
                router.push(`/documents/${document.document_id}/analytics`);
              }}
            >
              <IoAnalytics className="h-4 w-4" />
              <span>Analytics</span>
            </Button>
          ),
        },
        {
          id: 'delete',
          element: (
            <Button
              size="sm"
              variant="white"
              className="flex w-full shrink-0 items-center gap-x-2 text-red-600"
              onClick={() => handleDelete({ document })}
            >
              <MdDelete className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          ),
        },
      ]}
      placement="bottom-end"
    >
      <div className="flex items-center justify-center rounded border border-none bg-transparent px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-200/80 hover:text-blue-700">
        <BsThreeDots className="h-5 w-5" />
      </div>
    </Dropdown>
  );
};

export const DocumentSwitch: React.FC<{
  document: DocumentType;
  full?: boolean;
}> = ({ document, full = true }) => {
  const [isEnabled, setIsEnabled] = useState(document.is_enabled);

  const { handleDocumentToggle: handleToggle } = useDocument();

  return (
    <div
      className={clsx(
        'flex w-44 items-center justify-start gap-x-2 font-medium',
        full ? 'w-44' : 'w-12'
      )}
    >
      <Tooltip content={isEnabled ? `Disable all links` : `Enable links`}>
        <Switch
          enabled={isEnabled}
          setEnabled={setIsEnabled}
          callback={(checked) => handleToggle({ document, checked })}
        />
      </Tooltip>
      {full && (
        <span className="text-xs">
          {isEnabled
            ? `${document.active_links_count} links are enabled`
            : 'All links are disabled'}
        </span>
      )}
    </div>
  );
};

export const DocumentPreview: React.FC<{ document: DocumentType }> = ({
  document,
}) => {
  return (
    <Link href={`/preview/${document.document_id}`} target="_blank">
      <Tooltip content="Preview document">
        <Button size="sm" variant="icon">
          <IoEye className="h-5 w-5" />
        </Button>
      </Tooltip>
    </Link>
  );
};

export const DocumentUpdateVersion: React.FC<{ document: DocumentType }> = ({
  document,
}) => {
  return (
    <Button size="sm" variant="icon">
      <Tooltip content="Update document">
        <GrDocumentUpdate className="h-5 w-5" />
      </Tooltip>
    </Button>
  );
};

export const DocumentRowButtons: React.FC<{ document: DocumentType }> = ({
  document,
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-x-4">
      <DocumentNewLink document={document} />
      <DocumentSwitch document={document} />
      <div className="flex items-center gap-x-1">
        <DocumentPreview document={document} />
        <DocumentUpdateVersion document={document} />
        <DocumentOptionsDropdown document={document} />
      </div>
    </div>
  );
};
