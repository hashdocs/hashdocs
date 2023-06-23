import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";


interface UploadDocumentModalProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  /*-------------------------------- SET STATE VARIABLES  ------------------------------*/

  /*-------------------------------- RESET STATE ON CLOSE ------------------------------*/

  useEffect(() => {}, [isOpen]);

  /*-------------------------------- HANDLE SAVE BUTTON ------------------------------*/

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
              <Dialog.Panel className="relative flex w-full max-w-xl transform flex-col space-y-6 overflow-hidden rounded-lg bg-white px-6 py-4 shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-left font-semibold uppercase leading-6"
                  >
                    {"Upload document"}
                  </Dialog.Title>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UploadDocumentModal;
