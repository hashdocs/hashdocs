import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Uppy, { UppyFile } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import XHR from "@uppy/xhr-upload";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useRouter } from "next/navigation";
import Loader from "@/app/_components/navigation/loader";
import toast from "react-hot-toast";
import Link from "next/link";
import { PresentationChartBarIcon } from "@heroicons/react/24/outline";
import { DocumentsContext } from "./documentsProvider";
import { DocumentType } from "@/types/documents.types";

interface UploadDocumentModalProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  document_id?: string | null;
  document_name?: string | null;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  setIsOpen,
  document_id = null,
  document_name = null,
}) => {
  const router = useRouter();

  /*-------------------------------- SET STATE VARIABLES  ------------------------------*/

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _documentContext = useContext(DocumentsContext);

  if (!_documentContext) return null;

  const { setDocuments } = _documentContext;

  /*-------------------------------- FUNCTIONS ------------------------------*/

  const handleBeforeUpload = (files: {
    [key: string]: UppyFile<Record<string, unknown>, Record<string, unknown>>;
  }) => {
    if (Object.keys(files).length > 1) return false;

    let file = files[Object.keys(files)[0]];

    if (file.type !== "application/pdf") return false;

    return true;
  };

  const uppy = new Uppy({
    id: "uppy",
    restrictions: {
      allowedFileTypes: [".pdf"],
      maxFileSize: 100000000, // 1MB
    },
    onBeforeUpload: (files) => handleBeforeUpload(files),
    allowMultipleUploads: false,
  }).use(XHR, {
    //TODO:Update to https
    endpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/api/documents${
      document_id ? `?document_id=${document_id}` : ""
    }`,
  });

  uppy.on("upload-success", (file, response) => {
    const new_document = response.body as DocumentType;

    toast.success(
      <div className={`max-w-1/2 flex items-center justify-start gap-x-4`}>
        <div className="flex flex-col gap-y-1">
          <p className="">
            <span className="font-semibold text-stratos-default">
              {document_name || file?.name}
            </span>{" "}
            {document_id ? "updated" : "uploaded"} successfully
          </p>
          <p className="font-normal">
            You can now create secure links for sharing. 
          </p>
          {/* <p className="font-normal">
            It may take a few seconds to generate the thumbnail. But if you prefer, you can upload a custom thumbnail from the three dots
          </p> */}
        </div>
        <Link
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(`${new_document.document_id}-toast`);
          }}
          href={`/preview/${new_document.document_id}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-y-1 border-l pl-2 hover:text-stratos-default hover:underline"
        >
          <PresentationChartBarIcon className="h-5 w-5 " />
          <span className="font-normal">{`Preview`}</span>
        </Link>
      </div>,
      { duration: 5000, id: `${new_document.document_id}-toast` }
    );
    setIsOpen(false);
    setDocuments((prevDocuments: DocumentType[] | null) => {
      if (!prevDocuments) return null;
      const docIndex = prevDocuments.findIndex((doc) => {
        return doc.document_id === new_document.document_id;
      });
      if (docIndex > -1) {
        const newDocuments = [...prevDocuments];
        newDocuments[docIndex] = new_document;
        return newDocuments;
      } else {
        const newDocuments = [new_document, ...prevDocuments];
        return newDocuments;
      }
    });
    router.push(`/documents/${new_document.document_id}/links`);
    router.refresh();
  });

  uppy.on("upload-error", (file, error) => {
    toast.error("Upload failed, please try again");
  });

  /*-------------------------------- RENDER ------------------------------*/

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="z-100 relative" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-shade-overlay bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="z-100 fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-left">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {isLoading ? (
                <Loader />
              ) : (
                <Dialog.Panel className="relative flex w-full max-w-xl transform flex-col space-y-6 overflow-hidden rounded-lg bg-white px-6 py-4 shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-left font-semibold uppercase leading-6"
                      >
                        {document_id
                          ? "Update document"
                          : "Upload new document"}
                      </Dialog.Title>
                      <Dialog.Description
                        as="h3"
                        className="text-left text-xs leading-6 text-shade-pencil-light"
                      >
                        {
                          "Your documents are securely stored with AES-256 encryption"
                        }
                      </Dialog.Description>
                    </div>
                    <Link
                      href={`/preview/${document_id}`}
                      target="_blank"
                      className="max-w-1/3 truncate text-xs text-stratos-default underline"
                    >
                      {document_name}
                    </Link>
                  </div>
                  <Dashboard
                    uppy={uppy}
                    plugins={[]}
                    proudlyDisplayPoweredByUppy={false}
                    showProgressDetails={true}
                    hideUploadButton={false}
                    target="uppy-upload-area"
                    height={200}
                  />
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UploadDocumentModal;
