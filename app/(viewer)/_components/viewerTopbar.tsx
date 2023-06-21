'use client';
import Link from "next/link";
import Image from "next/image";
import { ArrowDownTrayIcon, CalendarDaysIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import IconButton from "@/app/_components/shared/buttons/iconButton";

export default function ViewerTopBar() {
  return (
    <div className="w-full bg-shade-overlay justify-between flex h-12 border-b border-shade-line px-4">
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}`}
        className="flex flex-row items-center"
      >
        <div className="relative -ml-1 h-10 w-8 scale-75 overflow-hidden rounded-md">
          <Image src={"/hashdocs.svg"} fill={true} alt={"hashdocs"} />
        </div>
        <h1 className="ml-1 mt-1 text-2xl font-bold leading-6 tracking-wide">
          hashdocs
        </h1>
      </Link>
      <div className="flex flex-row items-center gap-x-4 mr-4">
        <IconButton ButtonId={"topbar-download"} ButtonText={"Download document"} ButtonIcon={ArrowDownTrayIcon}  />
        <IconButton ButtonId={"topbar-download"} ButtonText={"Schedule a meeting"} ButtonIcon={CalendarDaysIcon}  />
        <IconButton ButtonId={"topbar-download"} ButtonText={"Email the author"} ButtonIcon={EnvelopeIcon}  />
        </div>
    </div>
  );
}
