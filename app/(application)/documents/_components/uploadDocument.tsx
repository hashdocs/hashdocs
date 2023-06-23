import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Uppy, { UppyFile } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import XHR from "@uppy/xhr-upload";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useRouter } from "next/navigation";
import Loader from "@/app/_components/navigation/loader";
import toast from "react-hot-toast";

interface UploadDocumentModalProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const router = useRouter();

  /*-------------------------------- SET STATE VARIABLES  ------------------------------*/

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    endpoint: `http://${process.env.NEXT_PUBLIC_BASE_URL}/api/documents`,
  });

  uppy.on("upload-success", (file, response) => {
    toast.success(
      `${file?.name} uploaded successfully. Create your first link`,
      { duration: 5000 }
    );
    router.push(`/documents/${response.body.document_id}`);
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
                  <div className="flex flex-col justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-left font-semibold uppercase leading-6"
                    >
                      {"Upload new document"}
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
