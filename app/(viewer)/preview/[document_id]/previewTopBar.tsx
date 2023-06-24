"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownTrayIcon,
  ArrowLongLeftIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import { DocumentType } from "@/types/documents.types";

export default function PreviewTopBar({
  documentProps,
}: {
  documentProps: DocumentType | null;
}) {
  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-shade-line bg-shade-overlay px-4">
      <Link
        href={`/`}
        className="flex w-1/6 flex-row items-center"
      >
        <div className="relative -ml-1 h-10 w-8 scale-75 overflow-hidden rounded-md">
          <Image src={"/hashdocs.svg"} fill={true} alt={"hashdocs"} />
        </div>
        <header className="ml-1 mt-1 text-2xl font-bold leading-6 tracking-wide">
          hashdocs
        </header>
      </Link>
      {/* <div className="flex items-center font-semibold ml-20 space-x-2">
        <ArrowLongLeftIcon className="h-4 w-4 text-shade-disabled" />
        <h2 className="text-xs  uppercase leading-6 tracking-wide text-shade-disabled">
          {"This is a preview. Go back to documents"}
        </h2>
      </div> */}
      <div className="mr-4 flex flex-row items-center justify-center gap-x-4">
        {documentProps && (
          <h1 className="text-base font-semibold leading-6 tracking-wide text-shade-pencil-light">
            {documentProps.document_name} (Preview)
          </h1>
        )}
        <IconButton
          ButtonId={"topbar-download"}
          ButtonText={"Schedule a meeting"}
          ButtonIcon={CalendarDaysIcon}
        />
        <IconButton
          ButtonId={"topbar-download"}
          ButtonText={"Email the author"}
          ButtonIcon={EnvelopeIcon}
        />
      </div>
    </div>
  );
}
