"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import { GetLinkProps } from "@/types/documents.types";

export default function ViewerTopBar({
  linkProps,
}: {
  linkProps: GetLinkProps | null;
}) {
  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-shade-line bg-shade-overlay px-4">
      <Link
        href={`/`}
        className="flex w-1/6 flex-row items-center"
      >
        <div className="relative -ml-1 h-10 w-8 scale-75 rounded-md">
          <Image src={"/hashdocs.svg"} fill={true} alt={"hashdocs"} />
        </div>
        <header className="ml-1 mt-1 text-2xl font-bold leading-6 tracking-wide">
          hashdocs
        </header>
      </Link>
      <div className="mr-4 flex flex-row items-center justify-center gap-x-4">
        {linkProps && (
          <h1 className="text-base font-semibold text-shade-pencil-light leading-6 tracking-wide">
            {linkProps.document_name}
          </h1>
        )}
        {linkProps?.is_download_allowed && (
          <IconButton
            ButtonId={"topbar-download"}
            ButtonText={"Download document"}
            ButtonIcon={ArrowDownTrayIcon}
          />
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
