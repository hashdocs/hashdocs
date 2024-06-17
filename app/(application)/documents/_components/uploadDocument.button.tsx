'use client';
import Button from '@/app/_components/button';
import { ModalRef } from '@/app/_components/modal';
import { DocumentType } from '@/types';
import Link from 'next/link';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { HiDocumentArrowUp } from 'react-icons/hi2';
import useOrg from '../../_provider/useOrg';
import UploadDocumentModal from './uploadDocument.modal';

const UploadDocumentButton = ({
  documents,
}: {
  documents?: DocumentType[];
}) => {
  const modalRef = useRef<ModalRef>(null);

  const { org } = useOrg();

  const handleUploadClick = () => {
    if (
      (!org.org_plan || org.org_plan === 'Free') &&
      (documents ?? []).length > 0
    ) {
      toast.error(
        <p>
          You have reached the maximum number of documents for the free plan.
          Please{' '}
          <Link
            className="text-stratos-default underline"
            href={'/settings/billing'}
          >
            upgrade
          </Link>{' '}
          to our Pro plan for unlimited documents.
        </p>,
        {
          duration: 10000,
        }
      );
      return;
    } else {
      modalRef.current?.openModal();
    }
  };

  return (
    <>
      <Button
        className="flex items-center gap-x-1 flex-nowrap shrink-0"
        variant="solid"
        size="md"
        onClick={handleUploadClick}
      >
        <HiDocumentArrowUp className="h-4 w-4" />
        <span className="text-sm font-semibold">Upload Document</span>
      </Button>
      <UploadDocumentModal modalRef={modalRef} />
    </>
  );
};

export default UploadDocumentButton;
