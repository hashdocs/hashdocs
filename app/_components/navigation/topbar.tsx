"use client";
import {
    ChatBubbleOvalLeftEllipsisIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import FeedbackModal from "../shared/feedbackModal";
import { primaryNavigation } from "./routes.constants";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function splitPath(path: string) {
  const pathArray: { name: string; path: string }[] = [];
  let currentPart = "";

  for (const item of path.split("/").filter(Boolean)) {
    currentPart += "/" + item;
    pathArray.push({ name: item, path: currentPart });
  }

  return pathArray;
}

export default function TopBar() {
  const path = usePathname();

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const pathArray = splitPath(path);

  const primaryPageProps = primaryNavigation.find(
    (page) => page.path.toLowerCase() === pathArray[0].path.toLowerCase()
  );

  const secondaryPages = pathArray.slice(1);

  return (
    <div className="flex h-12 w-full flex-row items-center justify-between border-b border-shade-line bg-gray-50 xl:px-8">
      <div className="flex flex-row items-center gap-x-2 text-sm lowercase text-shade-gray-500">
        {primaryPageProps && (
          <primaryPageProps.icon
            key={`${primaryPageProps.path}-icon`}
            className={classNames("h-4 w-4")}
            aria-hidden="true"
          />
        )}
        {primaryPageProps && (
          <Link href={primaryPageProps.path}>
            <h3 className="hover:text-shade-pencil-dark">
              {primaryPageProps?.name}
            </h3>
          </Link>
        )}
        {secondaryPages &&
          secondaryPages.map((page) => (
            // <>

            <Link
              key={`${page.path}`}
              href={page.path}
              className="flex flex-row gap-x-2"
            >
              <div className="text-sm font-semibold">{"/"}</div>
              <h3 className="hover:text-shade-pencil-dark">{page.name}</h3>
            </Link>
            // </>
          ))}
      </div>
      <button
        onClick={() => setIsFeedbackModalOpen(true)}
        className="flex items-center gap-x-2 rounded-md border border-shade-line bg-white px-2 py-1 text-xs font-semibold shadow-sm hover:bg-gray-50 hover:text-stratos-default"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
        <p>Suggest feedback</p>
      </button>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        setIsOpen={setIsFeedbackModalOpen}
      />
    </div>
  );
}
