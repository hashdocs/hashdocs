"use client";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import LargeButton from "@/app/_components/shared/buttons/largeButton";
import Toggle from "@/app/_components/shared/buttons/toggle";
import {
  ArrowDownTrayIcon,
  ArrowLongLeftIcon,
  ArrowPathIcon,
  BackwardIcon,
  CalendarDaysIcon,
  DocumentArrowUpIcon,
  LinkIcon,
  PencilIcon,
  PhotoIcon,
  PresentationChartBarIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useContext, useState } from "react";
import { DiGoogleDrive } from "react-icons/di";
import { FiHardDrive } from "react-icons/fi";
import EditLinkModal from "./editLinkModal";
import {
  DocumentType,
} from "@/types/documents.types";
import DocumentTabs from "./documentTabs";
import { formatDate } from "@/app/_utils/dateFormat";
import { ThumbnailImage } from "@/app/_components/shared/thumbnail";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import UploadDocumentModal from "../../../_components/uploadDocument";
import PopOver from "@/app/_components/shared/popover";
import UploadThumbnailModal from "../../../_components/uploadThumbnail";
import { DocumentsContext } from "../../../_components/documentsProvider";
import AnalyticsModal from "../analytics/_components/analyticsModal";

export default function DocumentHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { document_id } = useParams();

  const _documents = useContext(DocumentsContext);

  const {
    documents,
    setDocuments,
    showViewAnalyticsModal,
    setShowViewAnalyticsModal,
  } = _documents!;

  const document = documents.find((doc) => doc.document_id === document_id)!;

  const { image, is_enabled, document_name, source_path, source_type, links } = document;

  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(is_enabled);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(document_name);
  const [showUpdateDocumentModal, setShowUpdateDocumentModal] = useState(false);
  const [showUpdateThumbnailModal, setShowUpdateThumbnailModal] =
    useState(false);

  const document_version =
    document.versions.find((version) => version.is_enabled)?.document_version ??
    0;
  const updated_at =
    document.versions.find((version) => version.is_enabled)?.created_at ?? "";

  /* -------------------------------- FUNCTIONS ------------------------------- */

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  // Optimistically set name after change
  const handleBlur = () => {
    setIsEditing(false);
    setDocuments((prevDocuments: DocumentType[]) => {
      const newDocuments = prevDocuments;
      const index = newDocuments.findIndex(
        (document) => document.document_id === document_id
      );
      newDocuments[index].document_name = name;
      return newDocuments;
    });
    const updatePromise = new Promise(async (resolve, reject) => {
      const res = await fetch(`/api/documents/${document_id}`, {
        method: "PUT",
        body: JSON.stringify({
          document_name: name,
        }),
      });
      if (res.ok) {
        resolve(res.status);
      } else {
        setDocuments((prevDocuments: DocumentType[]) => {
          const newDocuments = prevDocuments;
          const index = newDocuments.findIndex(
            (document) => document.document_id === document_id
          );
          newDocuments[index].document_name = document_name;
          return newDocuments;
        });
        reject(Error("Error updating link status"));
      }
    });

    updatePromise.then((_res) => {});
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  // Refresh document
  const handleRefresh = async () => {
    const refreshPromise = new Promise(async (resolve, reject) => {
      await fetch(`/api/documents`)
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            setDocuments(data);
            router.refresh();
          }
        })
        .catch((err) => {
          reject(Error("Error refreshing doc"));
          return;
        });
      resolve("success");
    });

    toast.promise(refreshPromise, {
      loading: "Refreshing data...",
      success: "Successfully refreshed the document",
      error: "Error in refreshing document. Please try again",
    });
  };

  // Optimistically toggle the document
  const handleToggle = async (checked: boolean) => {
    setDocuments((prevDocuments: DocumentType[]) => {
      const newDocuments = prevDocuments;
      const index = newDocuments.findIndex(
        (document) => document.document_id === document_id
      );
      newDocuments[index].is_enabled = checked;
      return newDocuments;
    });
    router.refresh();
    return new Promise(async (resolve, reject) => {
      const res = fetch(`/api/documents/${document_id}`, {
        method: "PUT",
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
          setDocuments((prevDocuments: DocumentType[]) => {
            const newDocuments = prevDocuments;
            const index = newDocuments.findIndex(
              (document) => document.document_id === document_id
            );
            newDocuments[index].is_enabled = !checked;
            return newDocuments;
          });
          reject(Error("Error updating link status"));
        });
    });
  };

  // Delete document
  const handleDelete = async () => {
    const deletePromise = new Promise(async (resolve, reject) => {
      const res = fetch(`/api/documents/${document_id}`, {
        method: "DELETE",
      });

      res
        .then((res) => {
          if (res.ok) {
            resolve(res.status);
            router.push("/documents");
            setDocuments((prevDocuments: DocumentType[]) => {
              let newDocuments = prevDocuments;
              const index = newDocuments.findIndex(
                (document) => document.document_id === document_id
              );
              newDocuments = newDocuments.filter((item, i) => i !== index);
              return newDocuments;
            });
          }
        })
        .catch((err) => {
          reject(Error("Error updating doc status"));
        });
    });

    toast.promise(deletePromise, {
      loading: "Deleting document...",
      success: "Successfully deleted document",
      error: "Error in deleting document. Please try again",
    });
  };

  // Download document
  const handleDownload = async () => {
    const getPromise = new Promise(async (resolve, reject) => {
      const res = await fetch(`/api/documents/${document_id}`, {
        method: "GET",
      });

      if (res.status !== 200) reject(res.statusText);

      const data = await res.json();

      if (!data.signedUrl) reject("error");

      if (typeof window !== "undefined") {
        window.location.href = data.signedUrl;
      }

      resolve(data.signedUrl);
    });

    toast.promise(
      getPromise,
      {
        loading: "Generating download link...",
        success: (url: any) => (
          <p>
            Your document is fetched.{" "}
            <Link
              href={url}
              target="_blank"
              className="text-stratos-default underline"
            >
              Click here
            </Link>{" "}
            to download
          </p>
        ),
        error: "Error in downloading the document",
      },
      { duration: 6000 }
    );
  };

  /* --------------------------------- RENDER --------------------------------- */

  return (
    <section>
      <div className="flex flex-col">
        <Link href="/documents" className="pointer-events-none">
          <div className="pointer-events-auto inline-flex  items-center gap-x-2 text-shade-disabled hover:text-stratos-default hover:underline">
            <ArrowLongLeftIcon className="my-1 h-7 w-7" />
            <p>all documents</p>
          </div>
        </Link>
        <div className="mb-4 flex flex-row items-center justify-between gap-x-2">
          <div className="flex w-1/2 flex-row gap-x-4 overflow-hidden text-shade-pencil-black">
            <ThumbnailImage src={image} document_id={document_id} />
            <div className="flex flex-col space-y-1 overflow-hidden">
              {isEditing ? (
                <input
                  className="truncate rounded-sm px-1 py-0 text-lg font-semibold text-shade-pencil-black focus:ring-2 focus:ring-stratos-default"
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
                <p className="flex-nowrap truncate text-xs ">{`Version ${document_version} | Updated on ${formatDate(
                  updated_at,
                  "MMM D YYYY"
                )}`}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <Toggle
              toggleId={`${document_id}-toggle`}
              SuccessToastText={
                document.is_enabled ? (
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
              LoadingToastText={<p>Updating {document_name}...</p>}
              ErrorToastText={
                <p>Error in updating {document_name}. Please try again!</p>
              }
              Label={
                document.is_enabled
                  ? `${
                      links.filter((link) => link.is_active === true).length ??
                      0
                    } links are enabled`
                  : "All links are disabled"
              }
            />
            <Link href={`/preview/${document_id}`} target="_blank">
              <IconButton
                key={`${document_id}-preview`}
                ButtonId={`${document_id}-preview`}
                ButtonText={"Preview document"}
                ButtonIcon={PresentationChartBarIcon}
              />
            </Link>
            <IconButton
              key={`${document_id}-update`}
              ButtonId={`${document_id}-update`}
              ButtonText={"Update document"}
              ButtonIcon={DocumentArrowUpIcon}
              onClick={() => setShowUpdateDocumentModal(true)}
            />
            <IconButton
              key={`${document_id}-refresh`}
              ButtonId={`${document_id}-refresh`}
              ButtonText={"Refresh"}
              ButtonIcon={ArrowPathIcon}
              onClick={handleRefresh}
            />
            <PopOver
              options={[
                {
                  name: "Edit name",
                  icon: PencilIcon,
                  optionClick: () => {
                    setIsEditing(true);
                  },
                },
                {
                  name: "Change thumbnail",
                  icon: PhotoIcon,
                  optionClick: () => {
                    setShowUpdateThumbnailModal(true);
                  },
                },
                {
                  name: "Download",
                  icon: ArrowDownTrayIcon,
                  optionClick: handleDownload,
                },
                {
                  name: "Version history",
                  icon: BackwardIcon,
                  optionClick: () => {
                    toast.success("Version history is coming soon", {
                      icon: <WrenchScrewdriverIcon className="h-4 w-4" />,
                    });
                  },
                },
                {
                  name: "Delete",
                  icon: TrashIcon,
                  optionClick: handleDelete,
                  optionClassName: "text-red-500",
                },
              ]}
            />
            <LargeButton
              ButtonText={"New Link"}
              ButtonIcon={LinkIcon}
              ButtonId={`${document_id}-newlink`}
              ButtonClassName={
                document.is_enabled
                  ? `bg-stratos-gradient hover:bg-stratos-gradient/80 text-white`
                  : `bg-shade-disabled cursor-not-allowed`
              }
              disabled={!document.is_enabled}
              onClick={() => setShowNewLinkModal(true)}
            />
          </div>
          <EditLinkModal
            isOpen={showNewLinkModal}
            setIsOpen={setShowNewLinkModal}
            link_id={null}
            {...document}
          />
          <UploadDocumentModal
            isOpen={showUpdateDocumentModal}
            setIsOpen={setShowUpdateDocumentModal}
            document_id={document_id}
            document_name={document_name}
          />
          <UploadThumbnailModal
            isOpen={showUpdateThumbnailModal}
            setIsOpen={setShowUpdateThumbnailModal}
            document_id={document_id}
            document_name={document_name}
            image={image}
          />
          <AnalyticsModal
            viewId={showViewAnalyticsModal}
            setViewId={setShowViewAnalyticsModal}
          />
        </div>
        <DocumentTabs {...document} />
      </div>
      {children}
    </section>
  );
}
