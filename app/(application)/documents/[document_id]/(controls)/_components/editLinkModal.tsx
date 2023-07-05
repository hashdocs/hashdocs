import { Fragment, useContext, useEffect, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { classNames } from "@/app/_utils/classNames";
import { BiCopy, BiLinkExternal } from "react-icons/bi";
import Toggle from "@/app/_components/shared/buttons/toggle";
import { DocumentType, LinkType } from "@/types/documents.types";
import toast from "react-hot-toast";
import { CopyLinkToClipboard } from "@/app/_utils/common";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Database } from "@/types/supabase.types";
import { useRouter } from "next/navigation";
import { DocumentsContext } from "../../../_components/documentsProvider";

interface EditLinkModalProps extends DocumentType {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  isActive?: boolean;
  setIsActive?: (state: boolean) => void;
  handleToggle?: (checked: boolean) => Promise<unknown>;
  link_id: string | null;
}

const EditLinkModal: React.FC<EditLinkModalProps> = (
  props: EditLinkModalProps
) => {
  const {
    isOpen,
    setIsOpen,
    link_id,
    isActive = true,
    setIsActive = () => {},
    handleToggle,
  } = props;

  /*-------------------------------- SET DEFAULT VALUES ------------------------------*/

  const {
    is_email_required = true,
    is_password_required = false,
    is_verification_required = false,
    is_domain_restricted = false,
    is_download_allowed = false,
    is_watermarked = false,
    is_expiration_enabled = false,
  } = props && props.links && props.links.length > 0
    ? props.links.find((link) => link.link_id === link_id) ?? props.links[0]
    : {};

  const { link_name, link_password, restricted_domains } =
    link_id && props.links.length > 0
      ? props.links.find((link) => link.link_id === link_id) ?? {
          link_name: null,
          link_password: null,
          restricted_domains: null,
        }
      : { link_name: null, link_password: null, restricted_domains: null };

  const defaultHeight = restricted_domains
    ? Math.ceil(restricted_domains.length / 32) * 32
    : 32;
  const maxHeight = 128;
  const [height, setHeight] = useState<number>(32);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());

  /*-------------------------------- SET STATE VARIABLES FOR PROPS (9 + INHERITED ACTIVE) ------------------------------*/

  const [isEmailRequired, setIsEmailRequired] =
    useState<boolean>(is_email_required);
  const [isVerifyEmail, setIsVerifyEmail] = useState<boolean>(
    is_verification_required
  );
  const [isDomainRestricted, setIsDomainRestricted] =
    useState<boolean>(is_domain_restricted);
  const [isPasswordRequired, setIsPasswordRequired] =
    useState<boolean>(is_password_required);
  const [isDownloadAllowed, setIsDownloadAllowed] =
    useState<boolean>(is_download_allowed);
  const [isWatermarked, setIsWatermarked] = useState<boolean>(is_watermarked);
  const [domains, setDomains] = useState<string | null>(restricted_domains);
  const [password, setPassword] = useState<string | null>(link_password);
  const [linkName, setLinkName] = useState<string | null>(link_name);
  const [isExpirationEnabled, setIsExpirationEnabled] = useState<boolean>(
    is_expiration_enabled
  );
  const router = useRouter();

  const _documentsContext = useContext(DocumentsContext);

  /*-------------------------------- RESET STATE ON CLOSE ------------------------------*/

  useEffect(() => {
    if (isOpen) {
      setIsSaved(false);
    }

    if (!isOpen && !isSaved) {
      setIsEmailRequired(is_email_required);
      setIsVerifyEmail(is_verification_required);
      setIsDomainRestricted(is_domain_restricted);
      setIsPasswordRequired(is_password_required);
      setIsDownloadAllowed(is_download_allowed);
      setIsWatermarked(is_watermarked);
      setDomains(restricted_domains);
      setPassword(link_password);
      setLinkName(link_name);
    }
  }, [isOpen]);

  /*-------------------------------- SET HEIGHT OF TEXTAREA ------------------------------*/
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDomains(e.target.value);

    if (e.target.scrollHeight > height && e.target.scrollHeight < maxHeight) {
      setHeight(e.target.scrollHeight);
    }
  };

  useEffect(() => {
    setHeight(defaultHeight);
  }, [defaultHeight]);

  if (!_documentsContext) return null;

  const { setDocuments } = _documentsContext;

  /*-------------------------------- HANDLE SAVE BUTTON ------------------------------*/

  const handleSave = async () => {
    if (
      !linkName ||
      (isDomainRestricted && !(domains && domains.length > 0)) ||
      (isPasswordRequired && !(password && password.length > 0))
    ) {
      return toast.error("Please fill in all required fields");
    }

    const toastPromise = new Promise(async (resolve, reject) => {
      const _url = link_id
        ? `/api/documents/${props.document_id}?link_id=${link_id}`
        : `/api/documents/${props.document_id}`;

      const saveProps: Database["public"]["Tables"]["tbl_links"]["Update"] = {
        document_id: props.document_id,
        link_name: linkName!,
        link_password: password,
        restricted_domains: domains,
        is_active: isActive,
        is_email_required: isEmailRequired,
        is_password_required: isPasswordRequired,
        is_verification_required: isVerifyEmail,
        is_domain_restricted: isDomainRestricted,
        is_download_allowed: isDownloadAllowed,
        is_expiration_enabled: isExpirationEnabled,
        is_watermarked: isWatermarked,
      };

      const res = await fetch(_url, {
        method: "POST",
        body: JSON.stringify(saveProps),
      });

      if (res.status !== 200) reject(res.statusText);

      const document: DocumentType = await res.json();
      if (!document || !document.links[0] || !document.links[0].link_id)
        reject("error");
      if (res.ok) {
        setIsSaved(true);

        setDocuments((prevDocuments: DocumentType[] | null) => {
          if (!prevDocuments) return null;
          const newDocuments = prevDocuments;
          const index = newDocuments.findIndex(
            (document) => document.document_id === props.document_id
          );
          newDocuments[index] = document;
          return newDocuments;
        });
        router.push(`/documents/${props.document_id}`);
        router.refresh();
        resolve(link_id ?? document.links[0].link_id);
        setIsOpen(false);
      }
    });

    const toastPromiseText = {
      loading: link_id ? "Updating link..." : "Generating link...",
      success: (updated_link_id: any) => (
        <div className={`flex items-center justify-start space-x-2`}>
          <p className="font-normal">
            {link_id
              ? "Link updated successfully | "
              : "Link generated successfully | "}
          </p>
          <Link
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(`${updated_link_id}-toast`);
            }}
            href={`/d/${updated_link_id}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-row space-x-2"
          >
            <span className="text-stratos-default underline">{`${(
              process.env.NEXT_PUBLIC_BASE_URL ?? ""
            ).replace(/^https?:\/\//, "")}/d/${updated_link_id}`}</span>
            <BiLinkExternal className="h-4 w-4" />
          </Link>
          <BiCopy
            className="h-4 w-4 cursor-pointer"
            onClick={() =>
              CopyLinkToClipboard(
                `${process.env.NEXT_PUBLIC_BASE_URL}/d/${updated_link_id}`,
                true,
                `${updated_link_id}-toast`
              )
            }
          />
        </div>
      ),
      error: link_id
        ? "Error in updating link! Please try again."
        : "Error in generating a link! Please try again.",
    };

    toast.promise(toastPromise, toastPromiseText, {
      id: `${link_id}-toast`,
      style: {
        minWidth: "250px",
      },
      success: {
        duration: 5000,
        icon: "🔗",
      },
    });
  };

  /*-------------------------------- HANDLE DELETE BUTTON ------------------------------*/

  const handleDelete = async () => {
    const toastPromise = new Promise(async (resolve, reject) => {
      const res = await fetch(
        `/api/documents/${props.document_id}/${link_id}`,
        {
          method: "DELETE",
        }
      );

      if (res.status !== 200) reject(res.statusText);

      const document: DocumentType = await res.json();
      if (!document) reject("error");
      if (res.ok) {
        setIsSaved(true);
        setDocuments((prevDocuments: DocumentType[] | null) => {
          if (!prevDocuments) return null;
          const newDocuments = prevDocuments;
          const index = newDocuments.findIndex(
            (document) => document.document_id === props.document_id
          );
          newDocuments[index] = document;
          return newDocuments;
        });
        resolve("deleted");
        router.refresh();
        setIsOpen(false);
      }
    });

    const toastPromiseText = {
      loading: "Deleting link...",
      success: "Link deleted successfully!",
      error: "Error in deleting the link! Please try again.",
    };

    toast.promise(toastPromise, toastPromiseText);
  };

  /*-------------------------------- RENDER ------------------------------*/

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="z-100 relative" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-shade-overlay bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <form
          className="z-100 fixed inset-0 overflow-y-auto"
          onSubmit={handleSave}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
        >
          <div className="flex min-h-full items-center justify-center text-left">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative flex w-full max-w-xl transform flex-col space-y-6 overflow-hidden rounded-lg bg-white px-6 py-4 shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-left font-semibold uppercase leading-6"
                  >
                    {link_id ? "Update link" : "Create link"}
                  </Dialog.Title>

                  {link_id ? (
                    <div
                      className="flex flex-row items-center space-x-2 text-xs"
                      data-tooltip-id={`url`}
                      data-tooltip-content={`🚫 Disabled`}
                    >
                      <div
                        onClick={() =>
                          CopyLinkToClipboard(
                            `${process.env.NEXT_PUBLIC_BASE_URL}/d/${link_id}`,
                            true,
                            `${link_id}-modal`
                          )
                        }
                        className={`flex items-center space-x-2 rounded-xl py-1 ${
                          isActive
                            ? "cursor-pointer text-stratos-default "
                            : "pointer-events-none text-shade-pencil-light"
                        } `}
                      >
                        <span className="px-1 font-mono">{`${(
                          process.env.NEXT_PUBLIC_BASE_URL ?? ""
                        ).replace(/^https?:\/\//, "")}/d/${link_id}`}</span>
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
                  ) : null}
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <div className="text-sm leading-6">
                    <label className="font-medium">Link Name</label>
                    <p
                      id="required-email-description"
                      className="text-xs text-shade-pencil-light/80"
                    >
                      {"Enter the organization or recipient name"}
                    </p>
                  </div>
                  <input
                    type="text"
                    name="link_name"
                    id="link_name"
                    onChange={(e) => setLinkName(e.target.value)}
                    className="w-full max-w-[16rem] rounded-md border-0 py-1.5 text-sm shadow-inner ring-1 ring-inset ring-shade-line placeholder:text-shade-disabled focus:ring-inset focus:ring-stratos-default "
                    placeholder="e.g. Hooli Ventures or Gavin Belson"
                    defaultValue={link_name ? link_name : undefined}
                    maxLength={30}
                    autoFocus={link_id ? false : true}
                  />
                </div>
                {/* <div className="flex items-center justify-between space-x-4">
                  <div className="text-sm leading-6">
                    <label className="font-medium">Status</label>
                    <p className="text-xs text-shade-pencil-light/80">
                      {"Change link status to active or inactive"}
                    </p>
                  </div>

                  <Toggle
                    toggleId={`${link_id}-toggle`}
                    isChecked={isActive}
                    setIsChecked={setIsActive}
                    onToggle={handleToggle}
                    isDisabled={!link_id}
                  />
                </div> */}
                <div className="-my-2 flex items-center justify-between text-xs text-shade-disabled">
                  <p className="pr-3">LINK SETTINGS</p>
                  <div className=" h-[1px] flex-grow bg-shade-line"></div>
                </div>
                <div className="flex flex-col">
                  <LinkModalCheckBox
                    isChecked={isEmailRequired}
                    setIsChecked={setIsEmailRequired}
                    id={"required-email-checkbox"}
                    name={"required-email-checkbox"}
                    label={"Email required"}
                    disabled={false}
                    description={
                      "Viewers need to enter their email to access the document"
                    }
                  />
                  <motion.div
                    initial={isEmailRequired}
                    animate={isEmailRequired ? "open" : "closed"}
                    variants={{
                      open: { height: "auto", opacity: 1 },
                      closed: { height: 0, opacity: 0 },
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <AnimatePresence initial={isEmailRequired}>
                      {
                        <div className="accordion-content ml-7 mt-4 flex w-full flex-col space-y-4">
                          <LinkModalCheckBox
                            isChecked={isVerifyEmail}
                            setIsChecked={setIsVerifyEmail}
                            id={"verify-email-checkbox"}
                            name={"verify-email-checkbox"}
                            label={"Verify Email (coming soon)"}
                            description={
                              "Viewers will be sent a confirmation link to verify their email"
                            }
                          />
                          <LinkModalCheckBox
                            isChecked={isDomainRestricted}
                            setIsChecked={setIsDomainRestricted}
                            id={"restrict-domains-checkbox"}
                            name={"restrict-domains-checkbox"}
                            label={"Restrict Domains"}
                            description={
                              "Restrict viewer access to select email domains or addresses"
                            }
                            disabled={false}
                          />
                          <textarea
                            name="domains"
                            id="domains"
                            onChange={handleChange}
                            className={classNames(
                              "ml-7 w-full max-w-[20rem] rounded-md border-0 py-1.5 text-sm shadow-inner ring-1 ring-inset ring-shade-line placeholder:text-shade-disabled focus:ring-inset focus:ring-stratos-default ",
                              !isDomainRestricted
                                ? "pointer-events-none bg-shade-line/20"
                                : ""
                            )}
                            placeholder="e.g. gmail.com, hooli.com, sequoia.com"
                            defaultValue={domains ? domains : undefined}
                            disabled={!isDomainRestricted}
                            style={{
                              height: `${height}px`,
                              maxHeight: `128px`,
                              minHeight: `32px`,
                            }}
                          />
                        </div>
                      }
                    </AnimatePresence>
                  </motion.div>
                </div>
                <div className="flex flex-col">
                  <LinkModalCheckBox
                    isChecked={isExpirationEnabled}
                    setIsChecked={setIsExpirationEnabled}
                    id={"expiry-checkbox"}
                    name={"expiry-checkbox"}
                    label={"Expiration settings (coming soon)"}
                    disabled={true}
                    description={
                      "Set the link to automatically expire after a certain date"
                    }
                  />
                  <motion.div
                    initial={isExpirationEnabled}
                    animate={isExpirationEnabled ? "open" : "closed"}
                    variants={{
                      open: { height: "auto", opacity: 1 },
                      closed: { height: 0, opacity: 0 },
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <AnimatePresence initial={isExpirationEnabled}>
                      {
                        <div className="accordion-content ml-7 mt-4 flex w-full flex-col space-y-4">
                          <DatePicker
                            selected={startDate}
                            onChange={(date) =>
                              setStartDate(date ?? new Date())
                            }
                            className="rounded-md border-0 py-1.5 text-sm shadow-inner ring-1 ring-inset ring-shade-line placeholder:text-shade-disabled focus:ring-inset focus:ring-stratos-default"
                            calendarClassName="font-inter"
                          />
                        </div>
                      }
                    </AnimatePresence>
                  </motion.div>
                </div>
                <LinkModalCheckBox
                  isChecked={isDownloadAllowed}
                  setIsChecked={setIsDownloadAllowed}
                  id={"download-allowed-checkbox"}
                  name={"download-allowed-checkbox"}
                  label={"Allow downloads"}
                  disabled={false}
                  description={"Viewers can download a copy of the document"}
                />
                <div className="flex flex-col space-y-4">
                  <LinkModalCheckBox
                    isChecked={isPasswordRequired}
                    setIsChecked={setIsPasswordRequired}
                    id={"password-required-checkbox"}
                    name={"password-required-checkbox"}
                    label={"Password"}
                    disabled={false}
                    description={
                      "Viewers need to enter the password to view the document"
                    }
                  />
                  <input
                    type="text"
                    name="link_password"
                    id="link_password"
                    onChange={(e) => setPassword(e.target.value)}
                    className={classNames(
                      "ml-7 w-full max-w-[20rem] rounded-md border-0 py-1.5 text-sm shadow-inner ring-1 ring-inset ring-shade-line placeholder:text-shade-disabled focus:ring-inset focus:ring-stratos-default ",
                      !isPasswordRequired
                        ? "cursor-not-allowed bg-shade-line/20"
                        : ""
                    )}
                    placeholder="Enter password"
                    defaultValue={password ? password : undefined}
                    maxLength={32}
                    disabled={!isPasswordRequired}
                  />
                </div>
                <LinkModalCheckBox
                  isChecked={isWatermarked}
                  setIsChecked={setIsWatermarked}
                  id={"watermarked-checkbox"}
                  name={"watermarked-checkbox"}
                  label={"Watermark (coming soon)"}
                  description={
                    "All files are watermarked with the viewer's email. Custom watermarks are coming soon"
                  }
                />
                <div className="mt-3 flex justify-between pt-3">
                  <button
                    type="button"
                    className={classNames(
                      "inline-flex justify-center rounded-md py-2 text-xs  hover:underline",
                      link_id
                        ? "text-red-600"
                        : "pointer-events-none text-white"
                    )}
                    onClick={handleDelete}
                  >
                    Delete Link
                  </button>
                  <div className="flex flex-row justify-end space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md px-3 py-2 text-xs text-shade-pencil-light hover:text-shade-pencil-black hover:underline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-stratos-default hover:bg-stratos-default/80 disabled:bg-stratos-default/50 inline-flex justify-center rounded-md px-3 py-2 font-semibold text-white shadow-sm"
                      onClick={handleSave}
                      disabled={linkName ? false : true}
                    >
                      {link_id ? "Save changes" : "Create new link"}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </form>
      </Dialog>
    </Transition.Root>
  );
};

export default EditLinkModal;

function LinkModalCheckBox({
  isChecked,
  setIsChecked,
  id,
  name,
  label,
  description,
  disabled = true,
}: {
  isChecked: boolean;
  setIsChecked: Function;
  id: string;
  name: string;
  label: string;
  description: string;
  disabled?: boolean;
}): JSX.Element {
  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={id}
          name={name}
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          type="checkbox"
          disabled={disabled}
          className={classNames(
            "h-4 w-4 rounded border-shade-line text-stratos-default focus:ring-white",
            disabled ? "cursor-not-allowed bg-shade-line/50" : "cursor-pointer"
          )}
          data-tooltip-id={id}
          data-tooltip-content={"Coming soon"}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label
          htmlFor={id}
          className={classNames(
            "font-medium",
            isChecked ? "" : "text-shade-pencil-light",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          {label}
        </label>
        <p className="text-xs text-shade-pencil-light/80">{description}</p>
      </div>
      {/* {disabled ? CustomTooltip(id) : null} */}
    </div>
  );
}
