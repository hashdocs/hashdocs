'use client';
import Button from '@/app/_components/button';
import Dropdown from '@/app/_components/dropdown';
import Input from '@/app/_components/input';
import { ModalRef } from '@/app/_components/modal';
import Switch from '@/app/_components/switch';
import Tooltip from '@/app/_components/tooltip';
import { formatDate } from '@/app/_utils/dateFormat';
import { createClientComponentClient } from '@/app/_utils/supabase';
import { DocumentDetailType, DocumentType } from '@/types';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { DiGoogleDrive } from 'react-icons/di';
import { FiHardDrive } from 'react-icons/fi';
import { GrDocumentUpdate } from 'react-icons/gr';
import { IoAnalytics, IoEye, IoLink } from 'react-icons/io5';
import {
  MdAddLink,
  MdDelete,
  MdEdit,
  MdEditDocument,
  MdImage,
  MdOutlineCalendarMonth,
  MdRefresh,
} from 'react-icons/md';
import { TbVersions } from 'react-icons/tb';
import useDocument from '../_provider/useDocument';
import { DocumentVersionHistoryModal } from './documentVersionHistory';
import LinkModal from './linkModal';
import { UploadDocumentModal } from './uploadDocument';
import UploadThumbnailModal from './uploadThumbnail';

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
        className="hidden items-center gap-x-1 whitespace-nowrap hover:text-blue-700 md:flex"
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

export const DocumentOptionsDropdown: React.FC<{
  document: DocumentType | DocumentDetailType;
}> = ({ document }) => {
  const router = useRouter();
  const { document_id, org_id } = useParams();
  const linkModalRef = useRef<ModalRef>(null);
  const updateDocumentModalRef = useRef<ModalRef>(null);
  const documentVersionHistoryModalRef = useRef<ModalRef>(null);
  const updateThumbnailModalRef = useRef<ModalRef>(null);

  const { handleDocumentDelete: handleDelete } = useDocument();

  return (
    <>
      <Dropdown
        items={[
          {
            id: 'newlink',
            element: (
              <Button
                size="sm"
                variant="white"
                className="flex w-full shrink-0 items-center gap-x-2 whitespace-nowrap"
                onClick={() => linkModalRef.current?.openModal()}
              >
                <MdAddLink className="h-4 w-4" />
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
                  router.push(
                    `/dashboard/${org_id}/documents/${document_id}/links`
                  );
                }}
              >
                <MdEditDocument className="h-4 w-4" />
                <span>Edit Links</span>
              </Button>
            ),
          },
          {
            id: 'preview',
            element: (
              <Button
                size="sm"
                variant="white"
                className="flex w-full shrink-0 items-center gap-x-2 whitespace-nowrap"
                onClick={() => {
                  router.push(`/preview/${document_id}`);
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
                onClick={() => updateThumbnailModalRef.current?.openModal()}
              >
                <MdImage className="h-4 w-4" />
                <span className="whitespace-nowrap">Edit thumbnail</span>
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
            id: 'analytics',
            element: (
              <Button
                size="sm"
                variant="white"
                className="flex w-full shrink-0 items-center gap-x-2"
                onClick={() => {
                  router.push(
                    `/dashboard/${org_id}/documents/${document_id}/views`
                  );
                }}
              >
                <IoAnalytics className="h-4 w-4" />
                <span>View Analytics</span>
              </Button>
            ),
          },
          {
            id: 'history',
            element: (
              <Button
                size="sm"
                variant="white"
                className="flex w-full shrink-0 items-center gap-x-2"
                onClick={() =>
                  documentVersionHistoryModalRef.current?.openModal()
                }
                disabled={!document_id}
              >
                <TbVersions className="h-4 w-4" />
                <span>Version history</span>
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
      <UploadDocumentModal
        modalRef={updateDocumentModalRef}
        document_id={document.document_id}
        document_name={document.document_name}
      />
      {!!document_id && (
        <DocumentVersionHistoryModal
          modalRef={documentVersionHistoryModalRef}
          document={document as DocumentDetailType}
        />
      )}
      <UploadThumbnailModal
        modalRef={updateThumbnailModalRef}
        document={document}
      />
    </>
  );
};

export const DocumentSwitch: React.FC<{
  document: DocumentType;
}> = ({ document }) => {
  const [isEnabled, setIsEnabled] = useState(document.is_enabled);

  const { handleDocumentToggle: handleToggle } = useDocument();

  return (
    <div
      className={clsx(
        'flex w-12 items-center justify-start gap-x-2 font-medium md:w-44'
      )}
    >
      <Tooltip content={isEnabled ? `Disable all links` : `Enable links`}>
        <Switch
          enabled={isEnabled}
          setEnabled={setIsEnabled}
          callback={(checked) => handleToggle({ document, checked })}
        />
      </Tooltip>
      <span className="hidden text-xs md:flex">
        {isEnabled
          ? `${document.active_links_count} links are enabled`
          : 'All links are disabled'}
      </span>
    </div>
  );
};

export const DocumentViews: React.FC<{ document: DocumentType }> = ({
  document,
}) => {
  return (
    <Link
      href={`/preview/${document.document_id}/views`}
      target="_blank"
      className="hidden xl:inline"
    >
      <Tooltip content="All views">
        <Button
          size="sm"
          variant="icon"
          className="flex w-16 items-center justify-start gap-x-1"
        >
          <IoEye className="h-4 w-4 shrink-0" />
          <span className="text-xs font-semibold">
            {document.total_views_count}
          </span>
        </Button>
      </Tooltip>
    </Link>
  );
};

export const DocumentLinks: React.FC<{ document: DocumentType }> = ({
  document,
}) => {
  return (
    <Link
      href={`/preview/${document.document_id}/links`}
      target="_blank"
      className="hidden xl:inline"
    >
      <Tooltip content="All links">
        <Button
          size="sm"
          variant="icon"
          className="flex w-16 items-center justify-start gap-x-1"
        >
          <IoLink className="h-4 w-4 shrink-0" />
          <span className="text-xs font-semibold">
            {document.total_links_count}
          </span>
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

export const DocumentName: React.FC<{
  document: DocumentType;
}> = ({ document }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(document.document_name);
  const router = useRouter();
  const { document_id } = useParams();


  // Optimistically set name after change
  const handleNameBlur = async () => {
    setIsEditing(false);

    const updatePromise = new Promise(async (resolve, reject) => {
      const supabase = createClientComponentClient();

      try {
        const { error } = await supabase
          .from('tbl_documents')
          .update({ document_name: name ?? undefined })
          .eq('document_id', document.document_id);

        if (error) {
          throw error;
        }

        resolve(true);
      } catch (error) {
        console.error(error);
        setName(document.document_name);
        reject(false);
      } finally {
        router.refresh();
      }
    });

    await updatePromise;
  };

  return isEditing ? (
    <Input
      className="truncate !rounded-sm !border !border-gray-200 !p-0 !text-lg font-semibold !outline-none !ring-0 focus:!ring-0"
      size="sm"
      inputProps={{
        value: name,
        onChange: (e) => setName(e.target.value),
        onBlur: handleNameBlur,
        autoFocus: true,
        onKeyDown: (e) => {
          if (e.key === 'Enter') {
            handleNameBlur();
          } else if (e.key === 'Escape') {
            setName(document.document_name);
            setIsEditing(false);
          }
        },
      }}
    />
  ) : (
    <Link
      href={!!document_id ? '' : `/dashboard/${document.org_id}/documents/${document.document_id}`}
      className={clsx(
        'group flex items-center gap-x-1 truncate',
        !!document_id ? 'cursor-text' : 'cursor-pointer'
      )}
      onClick={() => (!!document_id ? setIsEditing(true) : {})}
    >
      <h3 className="pb-0.5 text-base font-semibold hover:text-blue-700 md:text-lg">
        {name}
      </h3>
      <MdEdit
        className={clsx(
          'h-4 w-4 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100',
          !document_id && 'hidden'
        )}
      />
    </Link>
  );
};

export const DocumentSourceType: React.FC<{ source_type: string }> = ({
  source_type,
}) => {
  switch (source_type) {
    case 'LOCAL':
      return <FiHardDrive className="h-4 w-4 shrink-0" />;

    case 'GDRIVE':
      return <DiGoogleDrive className="h-4 w-4 shrink-0" />;

    default:
      return null;
  }
};

export const DocumentSourceText: React.FC<{
  source_type: string;
  source_path: string;
}> = ({ source_path, source_type }) => {
  return (
    <div className="flex flex-row items-center gap-x-1 text-gray-500">
      <DocumentSourceType source_type={source_type} />
      <p className="flex-nowrap truncate text-xs ">{source_path ?? '-'}</p>
    </div>
  );
};

export const DocumentVersionText: React.FC<{
  document_version: number;
  updated_at: string;
}> = ({ document_version, updated_at }) => {
  return (
    <div className="flex flex-row items-center gap-x-1 text-gray-500">
      <MdOutlineCalendarMonth className="h-4 w-4" />
      <p className="flex-nowrap truncate text-xs ">{`Version ${document_version} | ${formatDate(
        updated_at,
        'MMM D YYYY'
      )}`}</p>
    </div>
  );
};

export const DocumentThumbnail: React.FC<{
  document_id: string;
  link?: string;
  image: string | null;
  className?: string;
}> = ({ document_id, link, image, className = '' }) => {
  const [error, setError] = useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);

  useEffect(() => {
    setError(null);
  }, [image]);

  return (
    <Link
      className={clsx(
        'relative flex h-[72px] w-[137px] shrink-0 rounded-md border object-cover',
        className
      )}
      href={link ?? ``}
      target="_blank"
    >
      <Image
        alt={document_id}
        onError={setError}
        src={error || !image ? '/images/noimage_thumbnail.png' : `${image}`}
        fill={true}
        // height={72}
        // width={137}
        style={{ borderRadius: '6px' }}
      />
      <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-md bg-gray-200 opacity-0 transition-opacity duration-200 hover:opacity-50">
        <IoEye className="h-6 w-6" />
      </div>
    </Link>
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
        <DocumentLinks document={document} />
        <DocumentViews document={document} />
        <DocumentOptionsDropdown document={document} />
      </div>
    </div>
  );
};
