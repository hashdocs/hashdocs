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
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const revalidate = 0;

async function getSignedDownloadURL(linkProps: GetLinkProps | null) {
  if (!linkProps) return null;

  const res = await fetch(`/api/viewer/${linkProps.link_id}/download`, {
    method: "POST",
    body: JSON.stringify({
      document_id: linkProps.document_id,
      document_version: linkProps.document_version,
      source_path: linkProps.source_path,
    }),
  });

  if (!res.ok) {
    return null;
  }

  const { signedUrl } = await res.json();

  return signedUrl;
}

export default async function ViewerTopBar({
  linkProps,
}: {
  linkProps: GetLinkProps | null;
}) {
  const router = useRouter();

  const handleDownloadClick = async () => {
    const getPromise = new Promise(async (resolve, reject) => {
      const signedUrl = await getSignedDownloadURL(linkProps);

      if (!signedUrl) {
        reject("error");
        return;
      }

      if (typeof window !== "undefined") {
        window.location.href = signedUrl;
      }

      resolve(signedUrl);
    });

    toast.promise(
      getPromise,
      {
        loading: "Generating download link...",
        success: (url: any) => (
          <p>
            Your document is fetched.{" "}
            <Link
              href={url}
              target="_blank"
              className="text-stratos-default underline"
            >
              Click here
            </Link>{" "}
            to download
          </p>
        ),
        error: "Unauthorized! Error in downloading the document",
      },
      { duration: 6000 }
    );
  };

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
        {linkProps && (
          <h1 className="hidden text-base font-semibold leading-6 tracking-wide text-shade-pencil-light lg:flex">
            {linkProps.document_name}
          </h1>
        )}
        {linkProps?.is_download_allowed && (
          <IconButton
            ButtonId={"topbar-download"}
            ButtonText={"Download document"}
            ButtonIcon={ArrowDownTrayIcon}
            onClick={handleDownloadClick}
          />
        )}
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
