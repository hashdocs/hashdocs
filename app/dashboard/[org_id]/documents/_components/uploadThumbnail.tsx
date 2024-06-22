import Uppy, { UppyFile } from '@uppy/core';
import { Dashboard } from '@uppy/react';
import XHR from '@uppy/xhr-upload';

import Modal, { ModalRef } from '@/app/_components/modal';
import { generateRandomString } from '@/app/_utils/common';
import { createClientComponentClient } from '@/app/_utils/supabase';
import { DocumentType } from '@/types';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface UploadThumbnailProps {
  modalRef: React.RefObject<ModalRef>;
  document: DocumentType;
}

const UploadThumbnailModal: React.FC<UploadThumbnailProps> = ({
  modalRef,
  document,
}) => {
  const router = useRouter();

  /*-------------------------------- FUNCTIONS ------------------------------*/

  const handleBeforeUpload = (files: {
    [key: string]: UppyFile<Record<string, unknown>, Record<string, unknown>>;
  }) => {
    if (Object.keys(files).length > 1) {
      toast.error('Please upload only one file');
      return false;
    }

    return true;
  };

  const uppy = new Uppy({
    id: 'uppy',
    restrictions: {
      allowedFileTypes: ['.jpg', '.jpeg', '.png'],
      maxFileSize: 500000000, // 1MB
    },
    onBeforeUpload: (files) => handleBeforeUpload(files),
    allowMultipleUploads: false,
  }).use(XHR, {
    //TODO:Update to https
    endpoint: `${
      process.env.NEXT_PUBLIC_SUPABASE_URL
    }/storage/v1/object/thumbnails/${document.org_id}/${
      document.document_id
    }/${generateRandomString(6)}`,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'x-upsert': 'true',
    },
  });

  uppy.on('upload-success', (file, response) => {
    const postUploadPromise = new Promise(async (resolve, reject) => {
      const supabase = createClientComponentClient();

      if (!response.body.Key) {
        reject(false);
      }

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${response.body.Key}`;

      try {
        const { error } = await supabase
          .from('tbl_documents')
          .update({ custom_image: url })
          .eq('document_id', document.document_id)
          .eq('org_id', document.org_id);

        if (error) {
          throw error;
        }

        resolve(true);
      } catch (error) {
        console.error('Error updating document thumbnail', error);
        reject(false);
      }
    });

    toast
      .promise(postUploadPromise, {
        loading: `Updating ${document.document_name}...`,
        success: `Thumbnail updated successfully. It may take a few minutes to propagate across our servers`,
        error: `Error updating ${document.document_name}. Please try again!`,
      })
      .then(() => {
        router.refresh();
      });
  });

  /*-------------------------------- RENDER ------------------------------*/

  return (
    <Modal ref={modalRef} title="Upload Thumbnail">
      <div className="flex flex-col gap-y-2">
        <p className='text-xs text-gray-500'>{`Please upload a png or jpg file of dimensions 1200x630 (1200px width, 630px height)`}</p>

        <Dashboard
          uppy={uppy}
          plugins={[]}
          proudlyDisplayPoweredByUppy={false}
          showProgressDetails={true}
          hideUploadButton={false}
          target="uppy-upload-area"
          height={200}
          width={380}
        />
      </div>
    </Modal>
  );
};

export default UploadThumbnailModal;
