"use client";
import Image from "next/image";
import {
  LinkIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PresentationChartBarIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import Toggle from "@/app/_components/shared/buttons/toggle";
import Link from "next/link";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import { useState } from "react";
import { DocumentType } from "@/types/documents.types";
import MediumButton from "@/app/_components/shared/buttons/mediumButton";

/*=========================================== CONSTANTS ===========================================*/

const rowButtons = [
  { id: "View", name: "View document", icon: PresentationChartBarIcon },
  { id: "Refresh", name: "Refresh document", icon: CloudArrowUpIcon },
  { id: "Options", name: "More options", icon: EllipsisHorizontalIcon },
];

/*=========================================== MAIN COMPONENT FUNCTION ===========================================*/

const DocumentRow: React.FC<DocumentType> = (props) => {
  const {
    document_id,
    document_name,
    image,
    is_enabled,
    total_view_count,
    total_links_count,
  } = props;

  const [isEnabled, setIsEnabled] = useState<boolean>(is_enabled);

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
      <div className="flex items-center space-x-4">
        <div className="container relative block h-[72px] w-[128px] rounded-md border">
          {
            <Image
              src={image ?? "/images/no_document_fallback.png"}
              alt={document_id}
              fill={true}
            />
          }
        </div>
        <div className="flex flex-col space-y-2">
          <Link href={`/documents/${document_id}/links`}>
            <h4 className="text-base font-semibold hover:text-stratos-default hover:underline">
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
          ButtonHref={""}
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
          LoadingToastText={<p>Updating {document_name}...</p>}
          ErrorToastText={
            <p>Error in updating {document_name}. Please try again!</p>
          }
        />
        <div className="space-x-1">
          {rowButtons.map((button) => (
            <IconButton
              key={`${document_id}-${button.id}`}
              ButtonId={`${document_id}-${button.id}`}
              ButtonText={button.name}
              ButtonIcon={button.icon}
            />
          ))}
        </div>
      </div>
    </li>
  );
};

export default DocumentRow;
