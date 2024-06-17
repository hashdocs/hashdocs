import { HashdocsLogo } from "@/app/_components/logo";
import { DocumentType } from "@/types";

export default function PreviewTopBar({
  document,
}: {
  document: DocumentType;
}) {

  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-gray-200 bg-gray-50 px-4">
      <HashdocsLogo size="md" full />
      <div className="mr-4 flex flex-row items-center justify-center gap-x-4">
        {document && (
          <h1 className="hidden text-base font-semibold leading-6 tracking-wide text-gray-500 lg:flex">
            {`${document.document_name} (Preview)`}
          </h1>
        )}
      </div>
    </div>
  );
}
