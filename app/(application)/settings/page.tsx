'use client'
import { primaryNavigation } from "@/app/_components/navigation/routes.constants";
import Empty from "@/app/_components/navigation/empty";
import { classNames } from "@/app/_utils/classNames";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import PopOver from "@/app/_components/shared/popover";

const secondaryNavigation = [
  { name: "Account", href: "#", current: true },
  { name: "Notifications", href: "#", current: false },
  { name: "Billing", href: "#", current: false },
  { name: "Teams", href: "#", current: false },
  { name: "Integrations", href: "#", current: false },
];

export default async function SettingsPage() {
  const pageProps = primaryNavigation.find((page) => page.path === "/settings");

  return (
    <section className="flex flex-1 flex-col">
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
      <PopOver
        options={[
          {
            name: "Insights",
            icon: EllipsisHorizontalIcon,
            optionClick: () => {},
          },
          {
            name: "Automations",
            icon: EllipsisHorizontalIcon,
            optionClick: () => {},
          },
          {
            name: "Reports",
            icon: EllipsisHorizontalIcon,
            optionClick: () => {},
          },
        ]}
      />
    </section>
  );
}
