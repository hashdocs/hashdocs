"use client";
import EditLinkModal from "@/app/(application)/documents/[document_id]/(controls)/_components/editLinkModal";
import { DocumentsContext } from "@/app/(application)/documents/_components/documentsProvider";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import MediumButton from "@/app/_components/shared/buttons/mediumButton";
import Toggle from "@/app/_components/shared/buttons/toggle";
import { CopyLinkToClipboard } from "@/app/_utils/common";
import { formatDate } from "@/app/_utils/dateFormat";
import { DocumentType, LinkType } from "@/types/documents.types";
import {
    AdjustmentsHorizontalIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useContext, useState } from "react";
import { BiCopy, BiLinkExternal } from "react-icons/bi";
import ViewRow from "../../views/_components/viewRow";
import { ViewsHeader } from "../../views/_components/viewsHeader";

type LinkDocumentProps = {
  link:LinkType;
  document:DocumentType
}


/*=========================================== COMPONENT ===========================================*/

const LinkRow: React.FC<LinkDocumentProps> = (props) => {

  const { link, document } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(link.is_active);
  const [showUpdateLinkModal, setShowUpdateLinkModal] = useState(false);

  const _documentsContext = useContext(DocumentsContext);

  if (!_documentsContext) return null;

  const { setDocuments } = _documentsContext;

  const { link_id, link_name, created_at, views } = link;

  
  const path = `${process.env.NEXT_PUBLIC_BASE_URL}/d/${link_id}`;

  /*================================ FUNCTIONS ==============================*/

  // Handler for the toggle
  const handleToggle = async (checked: boolean) => {
    setDocuments((prevDocuments: DocumentType[]) => {
      const newDocuments = prevDocuments;
      const index = newDocuments.findIndex(
        (document) => document.document_id === link.document_id
      );
      const linkIndex = newDocuments[index].links.findIndex(
        (link) => link.link_id === link.link_id
      );

      newDocuments[index].links[linkIndex].is_active = checked;
      return newDocuments;
    });
    return new Promise(async (resolve, reject) => {
      const res = await fetch(
        `/api/documents/${link.document_id}/${link_id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            is_active: checked,
          }),
        }
      );

      if (res.status !== 200) {
        setDocuments((prevDocuments: DocumentType[]) => {
          const newDocuments = prevDocuments;
          const index = newDocuments.findIndex(
            (document) => document.document_id === link.document_id
          );
          const linkIndex = newDocuments[index].links.findIndex(
            (link) => link.link_id === link.link_id
          );

          newDocuments[index].links[linkIndex].is_active = !checked;
          return newDocuments;
        });
        reject("failed");
      }

      resolve("done");
    });
  };

  /*================================ RENDER ==============================*/

  return (
    <li
      key={link_id}
      className={`my-2 rounded-md bg-white p-4 shadow-sm  ${
        isActive && document?.is_enabled ? "" : "text-shade-gray-500"
      }`}
    >
      <div className={` flex items-center justify-between space-x-4`}>
        {/*-------------------------------- LEFT ------------------------------*/}

        <div className=" flex w-1/4 shrink-0 flex-row items-center space-x-4">
          <div className="flex flex-col ">
            <p className={`font-semibold`}>{link_name}</p>
            <p className="text-xs text-shade-gray-500">
              {created_at && formatDate(created_at, "MMM D", false)}
            </p>
          </div>
        </div>

        {/*-------------------------------- MIDDLE ------------------------------*/}

        <div
          className="flex w-1/3 shrink-0 flex-row items-center space-x-2 text-xs"
          data-tooltip-id={`${link_id}-url`}
          data-tooltip-content={`🚫 Disabled`}
        >
          <div
            onClick={() => CopyLinkToClipboard(path, true, `${link_id}-url`)}
            className={`flex items-center space-x-2 rounded-xl bg-gray-50 px-4 py-2 ${
              isActive && document?.is_enabled
                ? "cursor-pointer text-stratos-default "
                : "pointer-events-none text-shade-gray-500"
            } shadow-inner`}
          >
            <span className="px-1 font-mono">
              {path.replace(/^https?:\/\//, "")}
            </span>
            <BiCopy className="h-4 w-4 " />
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/d/${link_id}`}
              target="_blank"
              rel="noreferrer"
              className="px-1"
            >
              <BiLinkExternal className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <MediumButton
          ButtonId={`${link_id}-viewCount`}
          ButtonText={`${views.length} views`}
          ButtonIcon={EyeIcon}
          ButtonSize={3}
          ButtonHref={{
            pathname: `/documents/${document?.document_id}/views`,
            search: `id=${link_id}`,
          }}
        />

        <div className="flex items-center space-x-3">
          {/* <EnvelopeIcon className="h-5 w-5" />
          <KeyIcon className="h-5 w-5" />
          <ClockIcon className="h-5 w-5" />
          <FolderArrowDownIcon className="h-5 w-5" />
          <LockClosedIcon className="h-5 w-5" /> */}

          <Toggle
            toggleId={`${link_id}-toggle`}
            SuccessToastText={
              isActive ? (
                <p>
                  Link for {link_name} is now{" "}
                  {<span className="text-shade-gray-500">INACTIVE</span>}
                </p>
              ) : (
                <p>
                  Link for {link_name} is now{" "}
                  {<span className="text-stratos-default">ACTIVE</span>}
                </p>
              )
            }
            isChecked={isActive}
            setIsChecked={setIsActive}
            onToggle={handleToggle}
            isDisabled={!document?.is_enabled}
          />

          <IconButton
            ButtonIcon={AdjustmentsHorizontalIcon}
            ButtonId={`${link_id}-settings`}
            ButtonText={""}
            ButtonSize={4}
            onClick={() => {
              setShowUpdateLinkModal(true);
            }}
          />
          <div
            className="pointer-events-auto cursor-pointer rounded-md p-2 hover:bg-gray-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>
      <motion.div
        initial={isOpen}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { height: "auto", opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <AnimatePresence initial={false}>
          {isOpen && views && views.length > 0 && (
            <div className="accordion-content mt-6 flex w-full flex-col">
              {ViewsHeader()}
              {views &&
                views.map((view, idx) =>
                  idx < 5 ? (
                    ViewRow({link_name, ...view},idx)
                  ) : null
                )}
              <div className=" grid grid-cols-12 justify-end pt-2 text-xs text-shade-gray-500 shadow-sm hover:text-stratos-default hover:underline">
                <Link
                  href={{
                    pathname: `/documents/${document?.document_id}/views`,
                    search: `id=${link_id}`,
                  }}
                  className="col-span-12 flex justify-end"
                >
                  {`see all ${views.length} views`}
                </Link>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
      <EditLinkModal
        isOpen={showUpdateLinkModal}
        setIsOpen={setShowUpdateLinkModal}
        isActive={isActive}
        setIsActive={setIsActive}
        handleToggle={handleToggle}
        link_id={link_id}
        {...document}
      />
    </li>
  );
};

export default LinkRow;

/*=========================================== OTHER FUNCTIONS ===========================================*/
