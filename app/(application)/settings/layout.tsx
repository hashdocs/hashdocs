"use client";
/*=========================================== COMPONENT ===========================================*/

import { primaryNavigation } from "@/app/_components/navigation/routes.constants";
import { classNames } from "@/app/_utils/classNames";
import {
  BuildingOfficeIcon,
  CreditCardIcon,
  PuzzlePieceIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

const tabs = [
  { name: "Profile", href: "profile", icon: UserIcon },
  { name: "Organization", href: "organization", icon: BuildingOfficeIcon },
  { name: "Billing", href: "billing", icon: CreditCardIcon },
  { name: "Integrations", href: "integrations", icon: PuzzlePieceIcon },
];

export default function SettingsLayout({
  children,
  params: { document_id }, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { document_id: string };
}) {
  const pageProps = primaryNavigation.find((page) => page.path === "/settings");

  const activeTab = useSelectedLayoutSegment();

  return (
    <div className="block">
      <div className="mb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col space-y-1">
          <h1 className="text-lg font-semibold text-shade-pencil-black">
            {pageProps?.name}
          </h1>
          <p className="text-sm text-shade-pencil-light">
            {pageProps?.description}
          </p>
        </div>
      </div>
      <div className="mb-4 border-b border-shade-line">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={`/settings/${tab.href}`}
              className={classNames(
                tab.href == activeTab
                  ? "border-stratos-default text-stratos-default"
                  : "border-transparent text-shade-pencil-light hover:border-shade-line hover:text-shade-pencil-black",
                "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium"
              )}
            >
              <tab.icon
                className={classNames(
                  tab.href == activeTab
                    ? "text-stratos-default"
                    : "text-shade-pencil-light group-hover:text-shade-pencil-black",
                  "-ml-0.5 mr-2 h-5 w-5"
                )}
                aria-hidden="true"
              />
              <span>{tab.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
