"use client";
import LargeButton from "@/app/_components/shared/buttons/largeButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import UploadDocumentModal from "./uploadDocument";

export default function EmptyDocuments() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="flex flex-col items-center border-2 border-dashed border-shade-line p-24 text-center">
      <h3 className="mt-2 text-lg font-semibold text-shade-pencil-black">
        Welcome to hashdocs
      </h3>
      <p className="mt-1 text-sm text-shade-pencil-light">
        Please upload a document to create shareable links
      </p>
      <div className="mt-6">
        <LargeButton
          ButtonText={"Upload Document"}
          ButtonIcon={DocumentPlusIcon}
          ButtonId={"upload-document"}
          ButtonClassName="bg-stratos-gradient hover:bg-stratos-gradient/80 text-white"
          onClick={() => setShowUploadModal(true)}
        />
      </div>
      <UploadDocumentModal
        isOpen={showUploadModal}
        setIsOpen={setShowUploadModal}
      />
    </div>
  );
}
