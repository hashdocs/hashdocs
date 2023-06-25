"use client";
import { classNames } from "@/app/_utils/classNames";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

interface PopOverProps {
  options: {
    name: string;
    icon: React.ForwardRefExoticComponent<any>;
    optionClick: () => void;
    optionClassName?: string;
  }[];
  panelClassName?: string;
}

export default function PopOver({ options, panelClassName }: PopOverProps) {
  return (
    <Popover className="">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              ${open ? "" : "text-opacity-90"}
              group inline-flex items-center rounded-md px-2 py-2 hover:bg-stratos-overlay hover:text-stratos-default focus:outline-none focus-visible:ring-0`}
          >
            <EllipsisHorizontalIcon
              className={`h-5 w-5 transition duration-150 ease-in-out`}
              aria-hidden="true"
            />
          </Popover.Button>
          {/* <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          > */}
            <Popover.Panel
              className={classNames(
                "absolute z-10 flex max-w-sm shrink -translate-x-2/3 transform",
                panelClassName ?? ""
              )}
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid bg-white">
                  {options.map((item) => (
                    <button
                      key={item.name}
                      onClick={item.optionClick}
                      className={classNames(
                        "flex items-center rounded-lg px-2 py-3 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring",
                        item.optionClassName ?? ""
                      )}
                    >
                      <div className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center">
                        <item.icon aria-hidden="true" />
                      </div>
                      <div className="ml-3 text-xs">
                        <p className="">{item.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          {/* </Transition> */}
        </>
      )}
    </Popover>
  );
}
