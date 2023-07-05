"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
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
      <Link href={`/`} className="flex w-1/6 flex-row items-center">
        <div className="-ml-1 h-10 w-8 shrink-0 scale-75 rounded-md">
          <Image src={"/hashdocs_gradient.svg"} fill={true} alt={"Hashdocs"} />
        </div>
        <header className="ml-1 mt-1 text-2xl font-bold leading-6 tracking-wide">
          Hashdocs
        </header>
      </Link>
      <div className="mr-4 flex flex-row items-center justify-center gap-x-4">
        {documentProps && (
          <h1 className="hidden text-base font-semibold leading-6 tracking-wide text-shade-pencil-light lg:flex">
            {documentProps.document_name} (Preview)
          </h1>
        )}
        <IconButton
          ButtonId={"topbar-download"}
          ButtonText={"Download document"}
          ButtonIcon={ArrowDownTrayIcon}
        />
        <IconButton
          ButtonId={"topbar-download"}
          ButtonText={"Schedule a meeting (coming soon)"}
          ButtonIcon={CalendarDaysIcon}
        />
        <IconButton
          ButtonId={"topbar-download"}
          ButtonText={"Email author (coming soon)"}
          ButtonIcon={EnvelopeIcon}
        />
      </div>
    </div>
  );
}
