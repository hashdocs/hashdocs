'use client';

import Button from '@/app/_components/button';
import { HiDocumentArrowUp } from 'react-icons/hi2';

export default function EmptyDocuments() {
  return (
    <div className="border-shade-line flex flex-col items-center border-2 border-dashed rounded p-24 text-center">
      <h3 className="mt-2 text-lg font-semibold">
        No documents found
      </h3>
      <p className="text-shade-gray-500 mt-1 text-sm">
        Please upload a document to create shareable links
      </p>
      <div className="my-6">
        <Button className="flex items-center gap-x-1" variant="solid" size='md'>
          <HiDocumentArrowUp className="h-4 w-4" />
          <span className="text-sm font-semibold">Upload Document</span>
        </Button>
      </div>
    </div>
  );
}
