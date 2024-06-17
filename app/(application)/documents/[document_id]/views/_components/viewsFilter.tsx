"use client";
import { DocumentsContext } from "@/app/(application)/documents/_components/documentsProvider";
import { classNames } from "@/app/_utils/classNames";
import { DocumentType, LinkType, ViewType } from "@/types/documents.types";
import { Combobox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    EyeSlashIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import ViewRow from "./viewRow";
import { ViewsHeader } from "./viewsHeader";

export type ViewTableType = ViewType & { link_name: string };

/*=========================================== COMPONENT ===========================================*/

export default function ViewsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { document_id } = useParams();

  const [searchValue, setSearchValue] = useState<string>("");
  let [views, setViews] = useState<ViewTableType[]>([]);
  let viewData: ViewTableType[] = [];

  const link_id = searchParams.get("id");
  let document: DocumentType | null = null;

  /*================================ COMBOBOX ==============================*/

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams();
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const [selectedLink, setSelectedLink] = useState<LinkType | null>(null);
  const [linkQuery, setLinkQuery] = useState("");

  const handleComboboxChange = (link_name: any) => {
    const _link = link_name
      ? document?.links.find(
          (link) => link.link_name.toLowerCase() === link_name.toLowerCase()
        ) ?? null
      : null;
    _link?.link_id
      ? router.push(pathname + "?" + createQueryString("id", _link.link_id))
      : router.push(pathname);
    setSelectedLink(_link);
  };

  useEffect(() => {
    document?.links?.forEach((link) => {
      if (selectedLink && link.link_id !== selectedLink.link_id) {
      } else {
        link.views?.forEach((view) => {
          viewData.push({ link_name: link.link_name, ...view });
        });
      }
    });

    viewData =
      searchValue.length > 0
        ? viewData.filter((view) => {
            return view.viewer
              .toLowerCase()
              .includes(searchValue.toLowerCase());
          })
        : viewData;

    viewData = Array.from(
      viewData
        .reduce(
          (map, item) => map.set(item.view_id, item),
          new Map<string | null, ViewTableType>()
        )
        .values()
    );

    viewData.sort((a, b) => {
      return b.view_seq - a.view_seq;
    });

    setViews(viewData);
  }, [selectedLink, searchValue]);

  useEffect(() => {
    const defaultLink =
      document?.links?.find((link) => link.link_id == link_id) ?? null;
    setSelectedLink(defaultLink);
  }, [document, link_id]);

  const _documentsContext = useContext(DocumentsContext);

  if (!_documentsContext) return null;

  const { documents } = _documentsContext;

  document = documents.find((doc) => doc.document_id === document_id) ?? null;

  if (!document) {
    return null;
  }

  const filteredLinks =
    linkQuery === ""
      ? document?.links
      : document?.links.filter((link) =>
          link.link_name.toLowerCase().includes(linkQuery.toLowerCase())
        );

  return (
    <section className="flex flex-1 flex-col space-y-4 py-4 ">
      <div className="flex flex-row items-center space-x-4">
        <Combobox value={selectedLink} onChange={handleComboboxChange} nullable>
          <div className="relative">
            <div
              className={classNames(
                "relative w-full cursor-default overflow-hidden rounded-lg border bg-white text-left shadow-inner focus:outline-none",
                selectedLink ? " border-stratos-default" : "border-transparent"
              )}
            >
              <div className="flex flex-row items-center">
                {selectedLink ? (
                  <XMarkIcon
                    className=" ml-2 h-4 w-4 cursor-pointer text-stratos-default"
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
                  placeholder="Filter by link"
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
                {filteredLinks?.length === 0 && linkQuery !== "" ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-shade-gray-500">
                    Nothing found.
                  </div>
                ) : (
                  filteredLinks?.map((link) => (
                    <Combobox.Option
                      key={link.link_id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-9 pr-4 ${
                          active ? "bg-stratos-gradient text-white" : ""
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
          {searchValue ? (
            <XMarkIcon
              className="h-4 w-4 cursor-pointer text-stratos-default"
              onClick={() => setSearchValue("")}
            />
          ) : (
            <MagnifyingGlassIcon className="h-4 w-4 text-shade-gray-500" />
          )}
          <input
            className=" flex-1 border-none text-sm placeholder:text-shade-disabled focus:ring-0"
            placeholder="Search by email"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col rounded-md border bg-white">
        {ViewsHeader()}
        {views && views.length > 0 ? (
          views.map((view, idx) => ViewRow(view, idx))
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 bg-white p-24">
            <EyeSlashIcon className="h-8 w-8 text-shade-gray-500" />
            <p className="text-shade-gray-500">{`No views found`}</p>
          </div>
        )}
      </div>
    </section>
  );
}
