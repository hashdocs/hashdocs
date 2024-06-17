'use client';
import Input from '@/app/_components/input';
import { ThumbnailImage } from '@/app/_components/shared/thumbnail';
import { formatDate } from '@/app/_utils/dateFormat';
import { createClientComponentClient } from '@/app/_utils/supabase';
import { DocumentDetailType } from '@/types';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { DiGoogleDrive } from 'react-icons/di';
import { FiHardDrive } from 'react-icons/fi';
import { MdArrowBack, MdEdit } from 'react-icons/md';
import { DocumentRowButtons } from '../../_components/documentButtons';

export default function DocumentHeader({
  document,
}: {
  document: DocumentDetailType;
}) {
  const router = useRouter();

  const {
    document_id,
    thumbnail_image,
    is_enabled,
    document_name,
    source_path,
    source_type,
    links,
    document_version,
    updated_at,
  } = document;

  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(is_enabled);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(document_name);
  const [showUpdateDocumentModal, setShowUpdateDocumentModal] = useState(false);
  const [showUpdateThumbnailModal, setShowUpdateThumbnailModal] =
    useState(false);

  /* -------------------------------- FUNCTIONS ------------------------------- */

  // Optimistically set name after change
  const handleNameBlur = async () => {
    setIsEditing(false);

    const updatePromise = new Promise(async (resolve, reject) => {
      const supabase = createClientComponentClient();

      try {
        const { error } = await supabase
          .from('tbl_documents')
          .update({ document_name: name ?? undefined })
          .eq('document_id', document_id);

        if (error) {
          throw error;
        }

        resolve(true);
      } catch (error) {
        console.error(error);
        setName(document_name);
        reject(false);
      } finally {
        router.refresh();
      }
    });

    await updatePromise;
  };

  // Download document
  const handleDownload = async () => {
    const getPromise = new Promise(async (resolve, reject) => {
      const res = await fetch(`/api/documents/${document_id}`, {
        method: 'GET',
      });

      if (res.status !== 200) reject(res.statusText);

      const data = await res.json();

      if (!data.signedUrl) reject('error');

      if (typeof window !== 'undefined') {
        window.location.href = data.signedUrl;
      }

      resolve(data.signedUrl);
    });

    toast.promise(
      getPromise,
      {
        loading: 'Generating download link...',
        success: (url: any) => (
          <p>
            Your document is fetched.{' '}
            <Link
              href={url}
              target="_blank"
              className="text-stratos-default underline"
            >
              Click here
            </Link>{' '}
            to download
          </p>
        ),
        error: 'Error in downloading the document',
      },
      { duration: 6000 }
    );
  };

  /* --------------------------------- RENDER --------------------------------- */

  return (
    <div className="flex flex-col gap-y-2">
      <Link
        href="/documents"
        className="flex items-center gap-x-1 text-xs text-gray-500 hover:text-blue-700"
      >
        <MdArrowBack className="" />
        <p>Back to documents</p>
      </Link>
      <div className="my-4 flex flex-row items-center justify-between gap-x-2">
        <div className="flex w-1/2 flex-row gap-x-4 overflow-hidden">
          <ThumbnailImage src={thumbnail_image} document_id={document_id} />
          <div className="flex flex-col gap-y-1 overflow-hidden">
            {isEditing ? (
              <Input
                className="truncate !rounded-sm !p-0 !text-lg font-semibold !ring-0"
                size="sm"
                inputProps={{
                  type: 'text',
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  onBlur: handleNameBlur,
                  autoFocus: true,
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') {
                      handleNameBlur();
                    } else if (e.key === 'Escape') {
                      setName(document_name);
                      setIsEditing(false);
                    }
                  },
                }}
              />
            ) : (
              <div
                className="group flex cursor-text items-center gap-x-1 truncate"
                onClick={() => setIsEditing(true)}
              >
                <h3
                  className="pb-0.5 text-lg font-semibold"
                  onClick={() => setIsEditing(true)}
                >
                  {name}
                </h3>
                <MdEdit className="h-4 w-4 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            )}
            <div className="flex flex-row items-center gap-x-1 text-gray-500">
              {source_type === 'LOCAL' ? (
                <FiHardDrive className="h-4 w-4" />
              ) : null}
              {source_type === 'GDRIVE' ? (
                <DiGoogleDrive className="h-4 w-4" />
              ) : null}
              <p className="flex-nowrap truncate text-xs ">
                {source_path ?? '.'}
              </p>
            </div>
            <div className="flex flex-row items-center gap-x-1 text-gray-500">
              <CalendarDaysIcon className="h-4 w-4" />
              <p className="flex-nowrap truncate text-xs ">{`Version ${document_version} | Updated on ${formatDate(
                updated_at,
                'MMM D YYYY'
              )}`}</p>
            </div>
          </div>
        </div>
        <DocumentRowButtons document={document} />
        {/* <EditLinkModal
            isOpen={showNewLinkModal}
            setIsOpen={setShowNewLinkModal}
            link_id={null}
            {...document}
          />
          <UploadDocumentModal
            isOpen={showUpdateDocumentModal}
            setIsOpen={setShowUpdateDocumentModal}
            document_id={document_id}
            document_name={document_name}
          />
          <UploadThumbnailModal
            isOpen={showUpdateThumbnailModal}
            setIsOpen={setShowUpdateThumbnailModal}
            document_id={document_id}
            document_name={document_name}
            image={image}
          />
          <AnalyticsModal
            viewId={showViewAnalyticsModal}
            setViewId={setShowViewAnalyticsModal}
          /> */}
      </div>
    </div>
  );
}
