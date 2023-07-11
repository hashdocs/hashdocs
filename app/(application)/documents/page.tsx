"use client";
import { primaryNavigation } from "@/app/_components/navigation/routes.constants";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import LargeButton from "@/app/_components/shared/buttons/largeButton";
import { useContext, useState } from "react";
import UploadDocumentModal from "./_components/uploadDocument";
import DocumentRow from "./_components/documentRow";
import EmptyDocuments from "./_components/emptyDocuments";
import { DocumentsContext } from "./_components/documentsProvider";
import Loader from "@/app/_components/navigation/loader";

/*=========================================== COMPONENT ===========================================*/

export default function DocumentsPage() {
  const pageProps = primaryNavigation.find(
    (page) => page.path === "/documents"
  );

  if (!pageProps) {
    throw new Error("Error in rendering document page properties");
  }

  const [showUploadModal, setShowUploadModal] = useState(false);

  const _documents = useContext(DocumentsContext);

  const { documents } = _documents!;

  return (
    <section className="flex flex-1 flex-col">
      <div className="mb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col space-y-1">
          <h3 className="text-lg font-semibold text-shade-pencil-black">
            {pageProps.name}
          </h3>
          <p className="text-sm text-shade-pencil-light">
            {pageProps.description}
          </p>
        </div>
        {
          <LargeButton
            ButtonText={"Upload Document"}
            ButtonIcon={DocumentPlusIcon}
            ButtonId={"upload-document"}
            ButtonClassName="bg-stratos-gradient hover:bg-stratos-gradient/80 text-white"
            onClick={() => setShowUploadModal(true)}
          />
        }
      </div>
      <ul role="list" className="flex w-full flex-1 flex-col">
        {documents.length > 0 ? (
          documents.map((document) => (
            <DocumentRow key={document.document_id} {...document} />
          ))
        ) : (
          <EmptyDocuments />
        )}
      </ul>
      <UploadDocumentModal
        isOpen={showUploadModal}
        setIsOpen={setShowUploadModal}
      />
    </section>
  );
}
