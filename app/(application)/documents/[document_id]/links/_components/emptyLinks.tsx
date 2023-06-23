import { DocumentPlusIcon } from "@heroicons/react/20/solid";
import { LinkIcon } from "@heroicons/react/24/outline";

export default function EmptyLinks() {
  return (
    <div className="text-center flex flex-col gap-y-2 pt-12 pb-16 my-4 border-shade-line border-2 border-dashed">
      <div className="flex flex-col gap-y-1">
          <h3 className="mt-2 text-sm font-semibold text-shade-pencil-black">
            No links
          </h3>
          <p className="mt-1 text-sm text-shade-pencil-light">
            Create a secure link for this document
          </p>
      </div>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-stratos-default px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stratos-default hover:bg-stratos-default/80"
        >
            New Link
          <LinkIcon
            className="ml-2 h-5 w-5"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
