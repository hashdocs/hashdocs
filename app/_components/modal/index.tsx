'use client';

import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { useImperativeHandle } from 'react';
import Actions from './actions';
import Header from './header';

type ModalProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
  classNames?: {
    dialogPanel?: string;
    body?: string;
  };
};

export type ModalRef = {
  openModal: () => void;
};

const Container = React.forwardRef<ModalRef, ModalProps>(
  ({ children, title, className = 'max-w-sm', classNames }, ref) => {
    const [open, setOpen] = React.useState(false);

    useImperativeHandle(ref, () => ({
      openModal() {
        setOpen(true);
      },
    }));

    return (
      <Transition.Root show={open} as={React.Fragment}>
        <Dialog as="div" className="relative" onClose={() => setOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-[100] bg-white/80 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-[101] overflow-y-hidden">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={clsx(
                    'shadow-lg-soft relative my-8 w-full transform rounded-lg border border-gray-200 bg-white p-0 text-left transition-all',
                    className,
                    classNames?.dialogPanel
                  )}
                >
                  {title ? (
                    <Header title={title} onClose={() => setOpen(false)} />
                  ) : null}
                  <div className={clsx('p-4 text-gray-600', classNames?.body)}>
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }
);

const Modal = Object.assign(Container, { Actions });

export default Modal;
