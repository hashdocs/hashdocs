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
import Link from "next/link";
import { PresentationChartBarIcon } from "@heroicons/react/24/outline";
import Toggle from "@/app/_components/shared/buttons/toggle";
import Image from "next/image";

interface UploadThumbnailProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  document_id: string;
  document_name?: string | null;
  image?: string | null;
}

const UploadThumbnailModal: React.FC<UploadThumbnailProps> = ({
  isOpen,
  setIsOpen,
  document_id,
  document_name = null,
  image = null,
}) => {
  const router = useRouter();

  /*-------------------------------- SET STATE VARIABLES  ------------------------------*/

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCustomImage, setIsCustomImage] = useState<boolean>(
    image ? true : false
  );

  /*-------------------------------- FUNCTIONS ------------------------------*/

  const handleBeforeUpload = (files: {
    [key: string]: UppyFile<Record<string, unknown>, Record<string, unknown>>;
  }) => {
    if (Object.keys(files).length > 1) return false;

    return true;
  };

  const handleToggle = (checked: boolean) => {
    return new Promise((resolve) => {
      setIsCustomImage(!isCustomImage);
      fetch(
        `/api/documents/${document_id}/thumbnail?image=${false}`,
        { method: "POST" }
      );
      resolve(true);
    });
  };

  const uppy = new Uppy({
    id: "uppy",
    restrictions: {
      allowedFileTypes: [".jpg", ".jpeg", ".png"],
      maxFileSize: 100000000, // 1MB
    },
    onBeforeUpload: (files) => handleBeforeUpload(files),
    allowMultipleUploads: false,

  }).use(XHR, {
    //TODO:Update to https
    endpoint: `/api/documents/${document_id}/thumbnail`,
  });

  uppy.on("upload-success", (file, response) => {
    toast.success(
      <div className="flex flex-col gap-y-1">
        <p className="">
          <span className="font-semibold text-stratos-default">
            {file?.name}
          </span>
          {" - "}
          Thumbnail updated successfully
        </p>
        <p className="font-normal">
          It may take a few minutes to propagate across our CDN
        </p>
      </div>
    );
    setIsOpen(false);
    router.refresh();
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
                <Dialog.Panel className="relative flex transform flex-col space-y-6 overflow-hidden rounded-lg bg-white px-6 py-4 shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-left font-semibold uppercase leading-6"
                      >
                        Update thumbnail
                      </Dialog.Title>
                      <Dialog.Description
                        as="h3"
                        className="text-left text-xs leading-6 text-shade-pencil-light"
                      >
                        {"Resolution: 1200x630 px"}
                      </Dialog.Description>
                    </div>
                    <Toggle
                      toggleId={`${document_id}-thumbnail-toggle`}
                      isChecked={isCustomImage}
                      setIsChecked={setIsCustomImage}
                      onToggle={handleToggle}
                      Label={"Custom thumbnail"}
                    />
                  </div>
                  {/* {isCustomImage ? ( */}
                    <Dashboard
                      uppy={uppy}
                      plugins={[]}
                      proudlyDisplayPoweredByUppy={false}
                      showProgressDetails={true}
                      hideUploadButton={false}
                      target="uppy-upload-area"
                      height={200}
                      width={380}
                    />
                  {/* // ) : ( */}
                  {/* //   <Image */}
                  {/* //     height={200}
                  //     width={380}
                  //     src={"/images/default_thumbnail.png"}
                  //     alt={"Thumbnail"}
                  //     className="rounded-lg bg-shade-overlay p-2"
                  //   />
                  // )} */}
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UploadThumbnailModal;
