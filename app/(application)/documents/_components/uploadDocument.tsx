// import { Dialog, Transition } from "@headlessui/react";
// import Uppy, { UppyFile } from "@uppy/core";
// import { Dashboard } from "@uppy/react";
// import XHR from "@uppy/xhr-upload";
// import { Fragment, useContext, useState } from "react";

// import Loader from "@/app/_components/navigation/loader";
// import { classNames } from "@/app/_utils/classNames";
// import { DocumentType } from "@/types/documents.types";
// import { PresentationChartBarIcon } from "@heroicons/react/24/outline";
// import "@uppy/core/dist/style.min.css";
// import "@uppy/dashboard/dist/style.min.css";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { UserContext } from "../../_components/userProvider";
// import { DocumentsContext } from "./documentsProvider";

// interface UploadDocumentModalProps {
//   isOpen: boolean;
//   setIsOpen: (state: boolean) => void;
//   document_id?: string | null;
//   document_name?: string | null;
// }

// const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
//   isOpen,
//   setIsOpen,
//   document_id = null,
//   document_name = null,
// }) => {
//   const router = useRouter();

//   /*-------------------------------- SET STATE VARIABLES  ------------------------------*/

//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isChecked, setIsChecked] = useState<boolean>(false);

//   const _documentContext = useContext(DocumentsContext);
//   const _userContext = useContext(UserContext);

//   if (!_documentContext || !_userContext) return null;

//   const { documents, setDocuments } = _documentContext;
//   const { user, org } = _userContext;

//   /*-------------------------------- FUNCTIONS ------------------------------*/

//   const handleBeforeUpload = (files: {
//     [key: string]: UppyFile<Record<string, unknown>, Record<string, unknown>>;
//   }) => {
//     if (
//       !document_id &&
//       org?.stripe_product_plan === "Free" &&
//       (documents ?? []).length > 0
//     ) {
//       toast.error(
//         <p>
//           You have reached the maximum number of documents for the free plan.
//           Please{" "}
//           <Link
//             className="text-stratos-default underline"
//             href={"/settings/billing"}
//           >
//             upgrade
//           </Link>{" "}
//           to our Pro plan for unlimited documents.
//         </p>
//       );
//       return false;
//     }

//     if (Object.keys(files).length > 1) return false;

//     let file = files[Object.keys(files)[0]];

//     if (file.type !== "application/pdf") return false;

//     return true;
//   };

//   const uppy = new Uppy({
//     id: "uppy",
//     restrictions: {
//       allowedFileTypes: [".pdf"],
//       maxFileSize: 100000000, // 1MB
//     },
//     onBeforeUpload: (files) => handleBeforeUpload(files),
//     allowMultipleUploads: false,
//   }).use(XHR, {
//     headers: {
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
//       "x-upsert": "true",
//     },
//     endpoint: `${
//       process.env.NEXT_PUBLIC_SUPABASE_URL
//     }/storage/v1/object/documents/TEMP/${Math.round(Math.random() * 1000000)}`,
//   });

//   uppy.on("upload-success", (file, response) => {
//     const path = (response.body.Key as string).replace(`documents/`, "");

//     const postUploadPromise = new Promise<DocumentType>(
//       async (resolve, reject) => {
//         setIsOpen(false);
//         const res = await fetch(`/api/documents`, {
//           method: "POST",
//           body: JSON.stringify({
//             document_id,
//             path,
//             source_path: file?.name,
//             document_name: document_name,
//             source_type: "LOCAL",
//           }),
//         });

//         if (!res.ok) {
//           reject();
//           return;
//         }

//         const new_document = (await res.json()) as DocumentType;

//         resolve(new_document);
//         setDocuments((prevDocuments: DocumentType[]) => {
//           const docIndex = prevDocuments.findIndex((doc) => {
//             return doc.document_id === new_document.document_id;
//           });
//           if (docIndex > -1) {
//             const newDocuments = [...prevDocuments];
//             newDocuments[docIndex] = new_document;
//             return newDocuments;
//           } else {
//             const newDocuments = [new_document, ...prevDocuments];
//             return newDocuments;
//           }
//         });
//         router.push(`/documents/${new_document.document_id}/links`);
//         router.refresh();
//       }
//     );

//     toast.promise(postUploadPromise, {
//       loading: "Processing your document...",
//       success: (new_doc: DocumentType) => (
//         <div className={`max-w-1/2 flex items-center justify-start gap-x-4`}>
//           <div className="flex flex-col gap-y-1">
//             <p className="">
//               <span className="font-semibold text-stratos-default">
//                 {document_name || file?.name}
//               </span>{" "}
//               {document_id ? "updated" : "uploaded"} successfully
//             </p>
//             <p className="font-normal">
//               You can now create secure links for sharing.
//             </p>
//             {/* <p className="font-normal">
//             It may take a few seconds to generate the thumbnail. But if you prefer, you can upload a custom thumbnail from the three dots
//           </p> */}
//           </div>
//           <Link
//             onClick={(e) => {
//               e.stopPropagation();
//               toast.dismiss(`${new_doc.document_id}-toast`);
//             }}
//             href={`/preview/${new_doc.document_id}`}
//             target="_blank"
//             rel="noreferrer"
//             className="flex flex-col items-center gap-y-1 border-l pl-2 hover:text-stratos-default hover:underline"
//           >
//             <PresentationChartBarIcon className="h-5 w-5 " />
//             <span className="font-normal">{`Preview`}</span>
//           </Link>
//         </div>
//       ),
//       error: "Upload failed, please try again",
//     });
//   });

//   uppy.on("upload-error", (file, error) => {
//     toast.error("Upload failed, please try again");
//   });

//   /*-------------------------------- RENDER ------------------------------*/

//   return (
//     <Transition.Root show={isOpen} as={Fragment}>
//       <Dialog as="div" className="z-100 relative" onClose={setIsOpen}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-gray-50 bg-opacity-75 transition-opacity" />
//         </Transition.Child>

//         <div className="z-100 fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center text-left">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//               enterTo="opacity-100 translate-y-0 sm:scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//               leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             >
//               {isLoading ? (
//                 <Loader />
//               ) : (
//                 <Dialog.Panel className="relative flex w-full max-w-xl transform flex-col space-y-6 overflow-hidden rounded-lg bg-white px-6 py-4 shadow-xl transition-all">
//                   <div className="flex items-start justify-between">
//                     <div className="flex flex-col justify-between">
//                       <Dialog.Title
//                         as="h3"
//                         className="text-left font-semibold uppercase leading-6"
//                       >
//                         {document_id
//                           ? "Update document"
//                           : "Upload new document"}
//                       </Dialog.Title>
//                       <Dialog.Description
//                         as="h3"
//                         className="text-left text-xs leading-6 text-shade-gray-500"
//                       >
//                         {
//                           "Your documents are securely stored with AES-256 encryption"
//                         }
//                       </Dialog.Description>
//                     </div>
//                     {/* <CustomThumbnailCheckbox
//                       isChecked={isChecked}
//                       setIsChecked={setIsChecked}
//                       id="custom-thumbnail"/> */}
//                   </div>
//                   <Dashboard
//                     uppy={uppy}
//                     plugins={[]}
//                     proudlyDisplayPoweredByUppy={false}
//                     showProgressDetails={true}
//                     hideUploadButton={false}
//                     target="uppy-upload-area"
//                     height={200}
//                   />
//                 </Dialog.Panel>
//               )}
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// };

// function CustomThumbnailCheckbox({
//   isChecked,
//   setIsChecked,
//   id,
// }: {
//   isChecked: boolean;
//   setIsChecked: Function;
//   id: string;
// }): JSX.Element {
//   return (
//     <div className="relative flex items-start">
//       <div className="ml-3 text-sm leading-6">
//         <label
//           htmlFor={id}
//           className={classNames(
//             "font-medium",
//             isChecked ? "" : "text-shade-gray-500",
//             "cursor-pointer"
//           )}
//         >
//           {`Custom thumbnail?`}
//         </label>
//         <p className="text-xs text-shade-gray-500/80">{`Generated from the 1st page`}</p>
//       </div>
//       <div className="flex h-6 items-center">
//         <input
//           id={id}
//           checked={isChecked}
//           onChange={() => setIsChecked(!isChecked)}
//           type="checkbox"
//           className={classNames(
//             "h-4 w-4 rounded border-shade-line text-stratos-default focus:ring-white",
//             "cursor-pointer"
//           )}
//         />
//       </div>
//     </div>
//   );
// }

// export default UploadDocumentModal;
