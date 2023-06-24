"use client";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import LargeButton from "@/app/_components/shared/buttons/largeButton";
import Toggle from "@/app/_components/shared/buttons/toggle";
import {
  ArrowLeftIcon,
  ArrowLongLeftIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  LinkIcon,
  PresentationChartBarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { createContext, useState } from "react";
import { DiGoogleDrive } from "react-icons/di";
import { FiHardDrive } from "react-icons/fi";
import EditLinkModal from "./editLinkModal";
import { DocumentContextType, DocumentType } from "@/types/documents.types";
import DocumentTabs from "./documentTabs";
import Image from "next/image";
import { EyeIcon } from "@heroicons/react/24/solid";
import { formatDate } from "@/app/_utils/dateFormat";
import { ThumbnailImage } from "@/app/_components/shared/thumbnail";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const rowButtons = [
  { id: "View", name: "View document", icon: PresentationChartBarIcon },
  { id: "Refresh", name: "Refresh document", icon: ArrowPathIcon },
  { id: "Trash", name: "Delete document", icon: TrashIcon },
];

export const DocumentContext = createContext<DocumentContextType | null>(null);

export default function DocumentHeader({
  children,
  props, // will be a page or nested layout
}: {
  children: React.ReactNode;
  props: DocumentType;
}) {
  const {
    document_id,
    document_name,
    source_path,
    source_type,
    is_enabled,
    created_at,
  } = props;

  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(is_enabled);
  const [document, setDocument] = useState<DocumentType>(props);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(document_name ?? ".");

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setDocument({ ...document, document_name: name });
    const updatePromise = new Promise(async (resolve, reject) => {
      const res = await fetch(`/api/documents/${props.document_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          document_name: name,
        }),
      });
      if (res.ok) {
        resolve(res.status);
      } else {
        setDocument({ ...document, document_name: document_name });
        reject(Error("Error updating link status"));
      }
    });

    toast.promise(updatePromise, {
      loading: "Updating document name...",
      success: "Successfully updated",
      error: "Failed to update! Please try again",
    });
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleToggle = async (checked: boolean) => {
    setDocument({ ...document, is_enabled: checked });
    return new Promise(async (resolve, reject) => {
      const res = fetch(`/api/documents/${props.document_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          is_enabled: checked,
        }),
      });

      res
        .then((res) => {
          if (res.ok) {
            resolve(res.status);
          }
        })
        .catch((err) => {
          setDocument({ ...document, is_enabled: !checked });
          reject(Error("Error updating link status"));
        });
    });
  };

  const handleUploadClick = () => { 

  }

  return (
    <DocumentContext.Provider
      value={{ document, setDocument, showNewLinkModal, setShowNewLinkModal }}
    >
      <div className="flex flex-col">
        <Link href="/documents" className="pointer-events-none">
          <div className="pointer-events-auto inline-flex  items-center gap-x-2 text-shade-disabled hover:text-stratos-default hover:underline">
            <ArrowLongLeftIcon className="my-1 h-7 w-7" />
            <p>all documents</p>
          </div>
        </Link>
        <div className="mb-4 flex flex-row items-center justify-between gap-x-2">
          <div className="flex w-1/2 flex-row gap-x-4 overflow-hidden text-shade-pencil-black">
            <ThumbnailImage src={document.image} document_id={document_id} />
            <div className="flex flex-col space-y-1 overflow-hidden">
              {isEditing ? (
                <input
                  className="truncate rounded-sm px-1 py-0 text-lg font-semibold text-shade-pencil-black"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={handleBlur}
                  autoFocus
                />
              ) : (
                <h3
                  className="cursor-text truncate text-lg font-semibold  text-shade-pencil-black hover:underline"
                  onClick={handleClick}
                >
                  {name}
                </h3>
              )}
              <div className="flex flex-row items-center space-x-1 text-shade-pencil-light">
                {source_type === "LOCAL" ? (
                  <FiHardDrive className="h-4 w-4" />
                ) : null}
                {source_type === "GDRIVE" ? (
                  <DiGoogleDrive className="h-4 w-4" />
                ) : null}
                <p className="flex-nowrap truncate text-xs ">
                  {source_path ?? "."}
                </p>
              </div>
              <div className="flex flex-row items-center space-x-1 text-shade-pencil-light">
                <CalendarDaysIcon className="h-4 w-4" />
                <p className="flex-nowrap truncate text-xs ">{`Last refreshed on ${formatDate(
                  created_at,
                  "MMM D YYYY"
                )}`}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <Toggle
              toggleId={`${document_id}-toggle`}
              SuccessToastText={
                isEnabled ? (
                  <p>
                    {document_name} is now{" "}
                    {<span className="text-shade-pencil-light">DISABLED</span>}
                  </p>
                ) : (
                  <p>
                    {document_name} is now{" "}
                    {<span className="text-stratos-default">ENABLED</span>}
                  </p>
                )
              }
              isChecked={isEnabled}
              setIsChecked={setIsEnabled}
              onToggle={handleToggle}
              EnabledHoverText="Disable all links"
              DisabledHoverText="Enable links"
              LoadingToastText={<p>Updating {document?.document_name}...</p>}
              ErrorToastText={
                <p>
                  Error in updating {document?.document_name}. Please try again!
                </p>
              }
              Label={
                isEnabled
                  ? `${document?.links.length} links are enabled`
                  : "All links are disabled"
              }
            />
            {rowButtons.map((button) => (
              <IconButton
                key={`${document_id}-${button.id}`}
                ButtonId={`${document_id}-${button.id}`}
                ButtonText={button.name}
                ButtonIcon={button.icon}
                onClick={handleUploadClick}
              />
            ))}
            <div className="pr-1"></div>
            <LargeButton
              ButtonText={"New Link"}
              ButtonIcon={LinkIcon}
              ButtonId={`${document_id}-newlink`}
              ButtonClassName={
                isEnabled
                  ? `bg-stratos-default hover:bg-stratos-default/80 text-white`
                  : `bg-shade-disabled cursor-not-allowed`
              }
              onClick={() => setShowNewLinkModal(true)}
            />
          </div>
          <EditLinkModal
            isOpen={showNewLinkModal}
            setIsOpen={setShowNewLinkModal}
            link_id={null}
            setDocument={setDocument}
            {...document}
          />
        </div>
        <DocumentTabs {...document} />
      </div>
      {children}
    </DocumentContext.Provider>
  );
}
