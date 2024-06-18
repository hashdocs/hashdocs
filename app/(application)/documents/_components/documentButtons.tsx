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
import { BsThreeDots } from 'react-icons/bs';
import { GrDocumentUpdate } from 'react-icons/gr';
import { IoAnalytics, IoEye } from 'react-icons/io5';
import {
  MdAddLink,
  MdDelete,
  MdEditDocument,
  MdImage,
  MdRefresh,
} from 'react-icons/md';
import useDocument from '../_provider/useDocument';
import LinkModal from './linkModal';
import UploadDocumentModal from './uploadDocument.modal';

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
        className="flex items-center gap-x-1 whitespace-nowrap  hover:text-blue-700"
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
  const linkModalRef = useRef<ModalRef>(null);
  const updateDocumentModalRef = useRef<ModalRef>(null);

  const { handleDocumentDelete: handleDelete } = useDocument();

  return (
    <>
      <Dropdown
        items={[
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
                <span>Info</span>
              </Button>
            ),
          },
          {
            id: 'preview',
            element: (
              <Button
                size="sm"
                variant="white"
                className="flex w-full shrink-0 items-center gap-x-2"
                onClick={() => {
                  router.push(`/preview/${document.document_id}`);
                }}
              >
                <IoEye className="h-4 w-4" />
                <span>Preview</span>
              </Button>
            ),
          },
          {
            id: 'thumbnail',
            element: (
              <Button
                size="sm"
                variant="white"
                className="flex w-full shrink-0 items-center gap-x-2"
                onClick={() => {}}
              >
                <MdImage className="h-4 w-4" />
                <span className="whitespace-nowrap">Upload thumbnail</span>
              </Button>
            ),
          },
          {
            id: 'update',
            element: (
              <Button
                size="sm"
                variant="white"
                className="flex w-full shrink-0 items-center gap-x-2"
                onClick={() => updateDocumentModalRef.current?.openModal()}
              >
                <GrDocumentUpdate className="h-4 w-4" />
                <span className="whitespace-nowrap">Update document</span>
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
                  linkModalRef.current?.openModal();
                }}
              >
                <MdAddLink className="h-4 w-4" />
                <span className="whitespace-nowrap">New Link</span>
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
                  router.push(`/documents/${document.document_id}/views`);
                }}
              >
                <IoAnalytics className="h-4 w-4" />
                <span>View Analytics</span>
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
      <LinkModal modalRef={linkModalRef} document={document} />
      <UploadDocumentModal
        modalRef={updateDocumentModalRef}
        document_id={document.document_id}
        document_name={document.document_name}
      />
    </>
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
    <Link
      href={`/preview/${document.document_id}`}
      target="_blank"
      className="hidden xl:inline"
    >
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
  const modalRef = useRef<ModalRef>(null);
  return (
    <>
      <Button
        size="sm"
        variant="icon"
        className="hidden xl:inline"
        onClick={() => modalRef.current?.openModal()}
      >
        <Tooltip content="Update document">
          <GrDocumentUpdate className="h-5 w-5" />
        </Tooltip>
      </Button>
      <UploadDocumentModal
        modalRef={modalRef}
        document_id={document.document_id}
        document_name={document.document_name}
      />
    </>
  );
};

export const DocumentRowButtons: React.FC<{ document: DocumentType }> = ({
  document,
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-x-2">
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
