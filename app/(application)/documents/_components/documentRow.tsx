'use client';
import Button from '@/app/_components/button';
import Dropdown from '@/app/_components/dropdown';
import { ThumbnailImage } from '@/app/_components/shared/thumbnail';
import Switch from '@/app/_components/switch';
import Tooltip from '@/app/_components/tooltip';
import { createClientComponentClient } from '@/app/_utils/supabase';
import { DocumentType } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BsThreeDots } from 'react-icons/bs';
import { GrDocumentUpdate } from 'react-icons/gr';
import { IoAnalytics, IoEye, IoLink } from 'react-icons/io5';
import { MdAddLink, MdDelete, MdEditDocument } from 'react-icons/md';
import useOrg from '../../_provider/useOrg';

/*=========================================== MAIN COMPONENT FUNCTION ===========================================*/

const DocumentRow: React.FC<{ document: DocumentType }> = ({ document }) => {
  const {
    document_id,
    document_name,
    image,
    is_enabled,
    total_links_count,
    total_views_count,
    active_links_count,
  } = document;
  const { org } = useOrg();

  const [isEnabled, setIsEnabled] = useState<boolean>(is_enabled);
  const supabase = createClientComponentClient();

  const router = useRouter();

  /* -------------------------------- FUNCTIONS ------------------------------- */

  // Optimistically set document on toggle
  const handleToggle = async (checked: boolean) => {
    const togglePromise = new Promise(async (resolve, reject) => {
      try {
        const { error } = await supabase
          .from('tbl_documents')
          .update({ is_enabled: checked })
          .eq('document_id', document_id)
          .eq('org_id', org.org_id);

        if (error) {
          throw error;
        }

        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      }
    });

    await toast
      .promise(togglePromise, {
        loading: `Updating ${document_name}...`,
        success: isEnabled ? (
          <p>
            {document_name} is now{' '}
            {<span className="text-shade-gray-500">DISABLED</span>}
          </p>
        ) : (
          <p>
            {document_name} is now{' '}
            {<span className="text-stratos-default">ENABLED</span>}
          </p>
        ),
        error: `Error in updating ${document_name}. Please try again!`,
      })
      .finally(() => {
        router.refresh();
      });
  };

  // Delete document and set after deletion
  const handleDelete = async () => {
    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        const { error } = await supabase
          .from('tbl_documents')
          .delete()
          .eq('document_id', document_id)
          .eq('org_id', org.org_id);

        if (error) {
          throw error;
        }

        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      }
    });

    await toast
      .promise(deletePromise, {
        loading: 'Deleting document...',
        success: 'Successfully deleted document',
        error: 'Error in deleting document. Please try again',
      })
      .finally(() => {
        router.refresh();
      });
  };

  /* --------------------------------- RENDER --------------------------------- */

  return (
    <li
      key={document_id}
      className="my-2 flex items-center justify-between space-x-4 rounded-md bg-white p-4 shadow-sm"
    >
      <div className="flex w-1/2 items-center space-x-4">
        <ThumbnailImage src={image} document_id={document_id} />
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
                className="flex items-center w-24 gap-x-1 !text-gray-600 hover:!text-blue-700"
              >
                <IoLink className="h-4 w-4" />
                <span>{`${total_links_count} links`}</span>
              </Button>
            </Link>
            <Link href={`/documents/${document_id}/views`}>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center w-24 gap-x-1 !text-gray-600 hover:!text-blue-700"
              >
                <IoEye className="h-4 w-4" />
                <span>{`${total_views_count} views`}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-start gap-x-4">
        <Button
          key={`${document_id}-newlink`}
          variant="outline"
          size="sm"
          onClick={() => {}}
          className="flex items-center gap-x-1"
        >
          <MdAddLink className={`h-4 w-4`} aria-hidden="true" />
          <span className="">{'New Link'}</span>
        </Button>
        <div className="flex w-44 items-center justify-start gap-x-2">
          <Tooltip content={isEnabled ? `Disable all links` : `Enable links`}>
            <Switch
              enabled={isEnabled}
              setEnabled={setIsEnabled}
              callback={handleToggle}
            />
          </Tooltip>
          <span className="text-xs">
            {isEnabled
              ? `${active_links_count} links are enabled`
              : 'All links are disabled'}
          </span>
        </div>
        <div className="flex items-center gap-x-1">
          <Link href={`/preview/${document_id}`} target="_blank">
            <Tooltip content="Preview document">
              <Button
                size="sm"
                variant="white"
                className="rounded-sm !text-gray-600 hover:!text-blue-700"
              >
                <IoEye className="h-5 w-5" />
              </Button>
            </Tooltip>
          </Link>
          <Tooltip content="Update document">
            <Button
              size="sm"
              variant="white"
              className="rounded-sm !text-gray-600 hover:!text-blue-700"
            >
              <GrDocumentUpdate className="h-5 w-5" />
            </Button>
          </Tooltip>
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
                      router.push(`/documents/${document_id}`);
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
                      router.push(`/documents/${document_id}/analytics`);
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
                    onClick={handleDelete}
                  >
                    <MdDelete className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                ),
              },
            ]}
            placement="bottom-end"
          >
            <BsThreeDots className="mt-1 h-5 w-5" />
          </Dropdown>
        </div>
      </div>
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
