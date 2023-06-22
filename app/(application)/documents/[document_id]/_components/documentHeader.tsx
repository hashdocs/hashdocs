"use client";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import LargeButton from "@/app/_components/shared/buttons/largeButton";
import Toggle from "@/app/_components/shared/buttons/toggle";
import {
  ArrowPathIcon,
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
  const { document_id, document_name, source_path, source_type, is_enabled } =
    props;

  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(is_enabled);
  const [document, setDocument] = useState<DocumentType>(props);

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

  return (
    <DocumentContext.Provider value={{ document, setDocument }}>
      <div className="flex flex-col">
        <div className="mb-4 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-2 text-shade-pencil-black">
            <Link href="/documents">
              <ChevronLeftIcon className="h-4 w-4" />
            </Link>
            <div className="flex flex-col space-y-1">
              <h3 className="text-lg font-semibold text-shade-pencil-black">
                {document_name ?? "."}
              </h3>
              <div className="flex flex-row items-center space-x-1 text-shade-pencil-light">
                {source_type === "LOCAL" ? (
                  <FiHardDrive className="h-4 w-4" />
                ) : null}
                {source_type === "GDRIVE" ? (
                  <DiGoogleDrive className="h-4 w-4" />
                ) : null}
                <p className="text-xs  ">{source_path ?? "."}</p>
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
              />
            ))}
            <div className="pr-1"></div>
            <LargeButton
              ButtonText={"New Link"}
              ButtonIcon={LinkIcon}
              ButtonId={`${document_id}-newlink`}
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
