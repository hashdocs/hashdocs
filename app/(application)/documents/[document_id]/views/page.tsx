"use client";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { LinkType, ViewType } from "@/types/documents.types";
import { formatDate, formatTime } from "@/app/_utils/dateFormat";
import PercentageCircle from "@/app/_components/shared/buttons/percentageCircle";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { DocumentContext } from "../_components/documentHeader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronUpDownIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Combobox, Transition } from "@headlessui/react";
import { classNames } from "@/app/_utils/classNames";

/*=========================================== COMPONENT ===========================================*/

export default function ViewsPage() {
  const _documentContext = useContext(DocumentContext);
  if (!_documentContext) throw Error("Invalid document");
  const { document } = _documentContext;
  const router = useRouter();
  const pathname = usePathname();

  type ViewTableType = ViewType & { link_name: string };

  const searchParams = useSearchParams();

  const link_id = searchParams.get("id");
  const defaultLink =
    document.links?.find((link) => link.link_id == link_id) ?? null;

  const [searchValue, setSearchValue] = useState<string>("");
  let [views, setViews] = useState<ViewTableType[]>([]);

  /*================================ COMBOBOX ==============================*/

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams();
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const [selectedLink, setSelectedLink] = useState<LinkType | null>(
    defaultLink
  );
  const [linkQuery, setLinkQuery] = useState("");

  const filteredLinks =
    linkQuery === ""
      ? document.links
      : document.links.filter((link) =>
          link.link_name.toLowerCase().includes(linkQuery.toLowerCase())
        );

  const handleComboboxChange = (link_name: any) => {
    const _link = link_name
      ? document.links.find(
          (link) => link.link_name.toLowerCase() === link_name.toLowerCase()
        ) ?? null
      : null;
    _link?.link_id
      ? router.push(pathname + "?" + createQueryString("id", _link.link_id))
      : router.push(pathname);
    setSelectedLink(_link);
  };

  useEffect(() => {
    views = [];

    document.links?.forEach((link) => {
      if (selectedLink && link.link_id !== selectedLink.link_id) {
      } else {
        link.views?.forEach((view) => {
          views.push({ link_name: link.link_name, ...view });
        });
      }
    });

    views =
      searchValue.length > 0
        ? views.filter((view) => {
            return view.viewer
              .toLowerCase()
              .includes(searchValue.toLowerCase());
          })
        : views;

    views.sort((a, b) => {
      return b.view_seq - a.view_seq;
    });

    setViews(views);
  }, [selectedLink, searchValue]);

  return (
    <section className="flex flex-1 flex-col space-y-4 py-4 ">
      <div className="flex flex-row items-center space-x-4">
        <Combobox value={selectedLink} onChange={handleComboboxChange} nullable>
          <div className="relative">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-inner focus:outline-none">
              <div className="flex flex-row items-center">
                {selectedLink ? (
                  <XMarkIcon
                    className=" ml-2 h-4 w-4 cursor-pointer"
                    onClick={() => handleComboboxChange(null)}
                  />
                ) : (
                  <FunnelIcon className=" ml-2 h-4 w-4 text-shade-disabled" />
                )}
                <Combobox.Input
                  className={classNames(
                    "w-full border-none py-2 pr-10 text-sm leading-5 focus:ring-0",
                    selectedLink ? "" : "placeholder-shade-disabled"
                  )}
                  placeholder="All links"
                  displayValue={(selectedLink: LinkType) =>
                    selectedLink?.link_name ?? ""
                  }
                  onChange={(event) => setLinkQuery(event.target.value)}
                />
              </div>
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-shade-disabled"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setLinkQuery("")}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 scrollbar-thin scrollbar-track-shade-line scrollbar-thumb-shade-disabled focus:outline-none">
                {filteredLinks.length === 0 && linkQuery !== "" ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredLinks.map((link) => (
                    <Combobox.Option
                      key={link.link_id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-9 pr-4 ${
                          active ? "bg-stratos-default text-white" : ""
                        }`
                      }
                      value={link.link_name}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {link.link_name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-stratos-default"
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>

        <div className="flex w-80 flex-none flex-row items-center rounded-md border border-shade-line bg-white px-2 shadow-inner ">
          <MagnifyingGlassIcon className="h-4 w-4 text-shade-pencil-light" />
          <input
            className=" flex-1 border-none text-sm placeholder:text-shade-disabled focus:ring-0"
            placeholder="Filter by link name or email"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col rounded-md border bg-white">
        <div className="grid grid-cols-12 border-b bg-shade-overlay px-6 py-4 text-xs uppercase text-shade-pencil-light shadow-sm ">
          <div className="col-span-2 grid">{"Name"}</div>
          <div className="col-span-3 grid justify-center">{"Link"}</div>
          <div className="col-span-2 grid justify-center">{"Date"}</div>
          <div className="col-span-2 grid justify-center">
            {"Duration (min)"}
          </div>
          <div className="col-span-2 grid justify-center">{"Completion %"}</div>
        </div>
        {views && views.length > 0 ? (
          views.map((view, idx) => (
            <div
              key={`${view.view_id}`}
              className="mx-2 grid grid-cols-12 items-center border-t p-4 "
            >
              <div className="col-span-2 flex items-center space-x-4">
                <div className="h-6 w-6 rounded-full border border-shade-line"></div>
                <p className={`font-semibold`}>{view.viewer}</p>
              </div>
              <div className="col-span-3 grid justify-center">
                {view.link_name}
              </div>
              <div className="col-span-2 grid justify-center">
                {view.viewed_at && formatDate(view.viewed_at, "MMM D", true)}
              </div>
              <div className="col-span-2 grid justify-center">
                {formatTime(view.duration)}
              </div>
              <div className="col-span-2 justify-center">
                <PercentageCircle percentage={view.completion} />
              </div>
              <div className="col-span-1 grid justify-end">
                <IconButton
                  ButtonId={`${view.view_id}-analytics`}
                  ButtonText={"Analytics (coming soon)"}
                  ButtonIcon={ChartBarIcon}
                  ButtonSize={4}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 bg-white p-24">
            <EyeSlashIcon className="h-8 w-8 text-shade-pencil-light" />
            <p className="text-shade-pencil-light">{`No views found`}</p>
          </div>
        )}
      </div>
    </section>
  );
}
