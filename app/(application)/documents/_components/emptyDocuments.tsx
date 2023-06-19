import { DocumentPlusIcon } from "@heroicons/react/20/solid";

export default function EmptyDocuments() {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-shade-pencil-black">
        No documents
      </h3>
      <p className="mt-1 text-sm text-shade-pencil-light">
        Get started by uploading a document.
      </p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-stratos-default px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stratos-default"
        >
          <DocumentPlusIcon
            className="-ml-0.5 mr-1.5 h-5 w-5"
            aria-hidden="true"
          />
          Upload
        </button>
      </div>
    </div>
  );
}
