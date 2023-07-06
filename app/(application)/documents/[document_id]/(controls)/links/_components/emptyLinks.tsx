"use client";
import { DocumentsContext } from "@/app/(application)/documents/_components/documentsProvider";
import LargeButton from "@/app/_components/shared/buttons/largeButton";
import { DocumentPlusIcon } from "@heroicons/react/20/solid";
import { LinkIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import EditLinkModal from "../../_components/editLinkModal";

export default function EmptyLinks({ document_id }: { document_id: string }) {
  const _documents = useContext(DocumentsContext);
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);

  if (!_documents) throw Error("Error in fetching documents");

  const { documents } = _documents;

  const document =
    documents?.find((document) => document.document_id === document_id) ?? null;

  if (!document) throw Error("Error in fetching document data");

  return (
    <div className="my-4 flex flex-col items-center gap-y-4 border-2 border-dashed border-shade-line pb-16 pt-12 text-center">
      <div className="flex flex-col gap-y-1">
        <h3 className="text-sm font-semibold text-shade-pencil-black">
          No links
        </h3>
        <p className="text-sm text-shade-pencil-light">
          Create a secure link for this document
        </p>
      </div>
      <LargeButton
        ButtonText={"New Link"}
        ButtonIcon={LinkIcon}
        ButtonClassName={
          document.is_enabled
            ? `w-28 bg-stratos-gradient hover:bg-stratos-gradient/80 text-white`
            : `w-28 bg-shade-disabled cursor-not-allowed`
        }
        onClick={() => setShowNewLinkModal(true)}
        ButtonId={""}
      />
      <EditLinkModal
        isOpen={showNewLinkModal}
        setIsOpen={setShowNewLinkModal}
        link_id={null}
        {...document}
      />
    </div>
  );
}
