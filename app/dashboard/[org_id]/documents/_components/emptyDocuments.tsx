'use client';

import { UploadDocumentButton } from './uploadDocument';

export default function EmptyDocuments() {
  return (
    <div className="border-shade-line flex flex-col items-center rounded border-2 border-dashed p-24 text-center">
      <h3 className="mt-2 text-lg font-semibold">No documents found</h3>
      <p className="text-shade-gray-500 mt-1 text-sm">
        Please upload a document to create shareable links
      </p>
      <div className="my-6">
        <UploadDocumentButton />
      </div>
    </div>
  );
}
