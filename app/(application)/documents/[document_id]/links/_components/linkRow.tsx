"use client";
import Link from "next/link";
import { useState, useContext } from "react";
import { BiCopy, BiLinkExternal } from "react-icons/bi";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Toggle from "@/app/_components/shared/buttons/toggle";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import { AnimatePresence, motion } from "framer-motion";
import PercentageCircle from "@/app/_components/shared/buttons/percentageCircle";
import { formatDate, formatTime } from "@/app/_utils/dateFormat";
import { LinkType, DocumentType } from "@/types/documents.types";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import MediumButton from "@/app/_components/shared/buttons/mediumButton";
import EditLinkModal from "@/app/(application)/documents/[document_id]/_components/newLinkModal";
import { DocumentContext } from "../../_components/documentHeader";
import { CopyLinkToClipboard } from "@/app/_utils/common";

/*=========================================== COMPONENT ===========================================*/

const LinkRow: React.FC<LinkType> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(props.is_active);
  const [showUpdateLinkModal, setShowUpdateLinkModal] = useState(false);

  const _documentContext = useContext(DocumentContext);

  if (!_documentContext) return null;

  const { document, setDocument } = _documentContext;

  const { link_id, link_name, created_at, views } = props;

  const path = `${process.env.NEXT_PUBLIC_BASE_URL}/d/${link_id}`;

  /*================================ FUNCTIONS ==============================*/

  // Handler for the toggle
  const handleToggle = async (checked: boolean) => {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(
        `/api/documents/${props.document_id}/${link_id}`,
        {
          method: "POST",
          body: JSON.stringify({
            is_active: checked,
          }),
        }
      );

      if (res.status !== 200) reject(res.statusText);

      const document: DocumentType = await res.json();
      if (!document || !document.links[0] || !document.links[0].link_id)
        reject("error");
      if (res.ok) {
        resolve("done");
      }
    });
  };

  return (
    <li
      key={link_id}
      className={`my-2 rounded-md bg-white p-4 shadow-sm  ${
        isActive && document?.is_enabled ? "" : "text-shade-pencil-light"
      }`}
    >
      <div className={` flex items-center justify-between space-x-4`}>
        {/*-------------------------------- LEFT ------------------------------*/}

        <div className=" flex w-1/4 shrink-0 flex-row items-center space-x-4">
          <div className="flex flex-col ">
            <p className={`font-semibold`}>{link_name}</p>
            <p className="text-xs text-shade-pencil-light">
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
            onClick={() => CopyLinkToClipboard(path,true, `${link_id}-url`)}
            className={`flex items-center space-x-2 rounded-xl bg-shade-overlay px-4 py-2 ${
              isActive && document?.is_enabled
                ? "cursor-pointer text-stratos-default "
                : "pointer-events-none text-shade-pencil-light"
            } shadow-inner`}
          >
            <span className="px-1 font-mono">{path}</span>
            <BiCopy className="h-4 w-4 " />
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`https://${path}`}
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
                  {<span className="text-shade-pencil-light">INACTIVE</span>}
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
            className="pointer-events-auto cursor-pointer rounded-md p-2 hover:bg-shade-overlay"
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
              <div className="grid grid-cols-12 py-2 text-xs uppercase text-shade-pencil-light shadow-sm">
                <div className="col-span-4 grid">{"Name"}</div>
                <div className="col-span-3 grid justify-center">{"Date"}</div>
                <div className="col-span-2 grid justify-center">
                  {"Duration (min)"}
                </div>
                <div className="col-span-2 grid justify-center">
                  {"Completion %"}
                </div>
                <div className="col-span-1 grid justify-center">{""}</div>
              </div>
              {views &&
                views.map((view, idx) =>
                  idx < 5 ? (
                    <div
                      key={`${link_id}-${view.view_id}`}
                      className="grid grid-cols-12 items-center border-t border-dashed py-3"
                    >
                      <div className="col-span-4 flex items-center space-x-4">
                        <div className="h-6 w-6 rounded-full border border-shade-line"></div>
                        <p className={`font-semibold`}>{view.viewer}</p>
                      </div>
                      <div className="col-span-3 grid justify-center">
                        <div className="">
                          {view.viewed_at &&
                            formatDate(view.viewed_at, "MMM D", true)}
                        </div>
                      </div>

                      <div className="col-span-2 grid justify-center">
                        {formatTime(view.duration)}
                      </div>
                      <div className="col-span-2 flex items-center justify-center gap-x-2">
                        <PercentageCircle percentage={view.completion} />
                        {`${view.completion}%`}
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
                  ) : null
                )}
              <div className=" grid grid-cols-12 justify-end pt-2 text-xs text-shade-pencil-light shadow-sm hover:text-stratos-default hover:underline">
                <Link
                  href={{
                    pathname: `/documents/${document?.document_id}/views`,
                    search: `id=${link_id}`,
                  }}
                  className="col-span-12 flex justify-end"
                >
                  {`see all ${
                    views.length
                  } views`}
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
        setDocument={setDocument}
        handleToggle={handleToggle}
        link_id={link_id}
        {...document}
      />
    </li>
  );
};

export default LinkRow;

/*=========================================== OTHER FUNCTIONS ===========================================*/
