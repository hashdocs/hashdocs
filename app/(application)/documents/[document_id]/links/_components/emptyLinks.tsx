'use client';
import { DocumentDetailType } from '@/types';
import { DocumentNewLink } from '../../../_components/documentButtons';

const EmptyLinks: React.FC<{ document: DocumentDetailType }> = ({
  document,
}) => {
  return (
    <div className="border-shade-line my-4 flex flex-col items-center gap-y-4 border-2 border-dashed pb-16 pt-12 text-center">
      <div className="flex flex-col gap-y-1">
        <h3 className="text-shade-pencil-black text-sm font-semibold">
          No links
        </h3>
        <p className="text-shade-gray-500 text-sm">
          Create a secure link for this document
        </p>
      </div>
      <DocumentNewLink document={document} />
    </div>
  );
};

export default EmptyLinks;
