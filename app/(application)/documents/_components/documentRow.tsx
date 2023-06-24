"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  LinkIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PresentationChartBarIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Toggle from "@/app/_components/shared/buttons/toggle";
import Link from "next/link";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import { useRef, useState } from "react";
import { DocumentType } from "@/types/documents.types";
import MediumButton from "@/app/_components/shared/buttons/mediumButton";
import EditLinkModal from "../[document_id]/(controls)/_components/editLinkModal";
import { ThumbnailImage } from "@/app/_components/shared/thumbnail";
import UploadDocumentModal from "./uploadDocument";

/*=========================================== MAIN COMPONENT FUNCTION ===========================================*/

const DocumentRow: React.FC<DocumentType> = (props) => {
  const {
    document_id,
    document_name,
    image,
    is_enabled,
    total_view_count,
    total_links_count,
    links,
  } = props;

  const [document, setDocument] = useState<DocumentType>(props);
  const [isEnabled, setIsEnabled] = useState<boolean>(is_enabled);
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [showUpdateDocumentModal, setShowUpdateDocumentModal] = useState(false);

  const active_links_count =
    links.filter((link) => link.is_active === true).length ?? 0;

  const handleToggle = async (checked: boolean) => {
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
          reject(Error("Error updating doc status"));
        });
    });
  };

  return (
    <li
      key={document_id}
      className="my-2 flex items-center justify-between space-x-4 rounded-md bg-white p-4 text-shade-pencil-black shadow-sm"
    >
      <div className="flex w-1/2 items-center space-x-4">
        <ThumbnailImage src={image} document_id={document_id} />
        <div className="flex flex-col space-y-2">
          <Link href={`/documents/${document_id}/links`}>
            <h4 className="w-full overflow-hidden text-base font-semibold hover:text-stratos-default hover:underline">
              {document_name}
            </h4>
          </Link>
          <div className="flex space-x-4">
            <MediumButton
              ButtonId={`${document_id}-links`}
              ButtonText={`${total_links_count} links`}
              ButtonIcon={LinkIcon}
              ButtonSize={3}
              ButtonHref={`/documents/${document_id}/links`}
            />
            <MediumButton
              ButtonId={`${document_id}-views`}
              ButtonText={`${total_view_count} views`}
              ButtonIcon={EyeIcon}
              ButtonSize={3}
              ButtonHref={`/documents/${document_id}/views`}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center space-x-4">
        <MediumButton
          ButtonId={`${document_id}-newlink`}
          ButtonText={"New Link"}
          ButtonIcon={LinkIcon}
          ButtonSize={4}
          onClick={() => setShowNewLinkModal(true)}
        />
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
          LoadingToastText={<p>Updating {document_name}...</p>}
          ErrorToastText={
            <p>Error in updating {document_name}. Please try again!</p>
          }
          Label={
            isEnabled
              ? `${active_links_count} links are enabled`
              : "All links are disabled"
          }
        />
        <div className="space-x-1">
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
            ButtonText={"Refresh document"}
            ButtonIcon={ArrowPathIcon}
            onClick={() => setShowUpdateDocumentModal(true)}
          />
          <IconButton
            key={`${document_id}-options`}
            ButtonId={`${document_id}-options`}
            ButtonText={"More options"}
            ButtonIcon={EllipsisHorizontalIcon}
            // onClick={() => setShowUpdateDocumentModal(true)}
          />
        </div>
      </div>
      <EditLinkModal
        isOpen={showNewLinkModal}
        setIsOpen={setShowNewLinkModal}
        link_id={null}
        setDocument={setDocument}
        {...document}
      />
      <UploadDocumentModal
        isOpen={showUpdateDocumentModal}
        setIsOpen={setShowUpdateDocumentModal}
        document_id={document_id}
      />
    </li>
  );
};

export default DocumentRow;
