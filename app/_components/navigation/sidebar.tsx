'use client'
import { Fragment, useCallback, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "./routes.constants";
import Image from "next/image";

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type primaryNavigationType = (typeof primaryNavigation)[0];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const path = usePathname();

  const defaultNav =
    primaryNavigation.find((nav) => {
      return path.includes(nav.path);
    }) ?? primaryNavigation[0];

  const [activeNav, setActiveNav] = useState(defaultNav);

  const changeSelectedNav = useCallback(
    (newNav: primaryNavigationType) => {
      setActiveNav(newNav);
    },
    [activeNav]
  );

  return (
    <aside
      className="z-50 flex w-60 flex-col justify-between overflow-y-hidden border-r border-shade-line p-2 px-6"
      style={{ height: "100vh" }}
    >
      <div className="flex flex-col gap-y-6  ">
        <div className="flex flex-row items-center">
          <div className="overflow-hidden w-9 h-12 scale-75 -ml-1 relative">
            <Image src={"/hashdocs.svg"} fill={true} alt={"hashdocs"}/>
          </div>
          <h1 className="font-bold text-2xl mt-1 leading-6 ml-1 tracking-wide">hashdocs</h1>
        </div>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {primaryNavigation.map((nav) => (
                <li key={nav.name}>
                  <Link
                    href={nav.path}
                    onClick={() => changeSelectedNav(nav)}
                    className={classNames(
                      nav.path === activeNav.path
                        ? "text-stratos-default"
                        : "text-shade-pencil-light hover:text-shade-pencil-dark",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                    )}
                  >
                    <nav.icon
                      className={"h-6 w-6 shrink-0"}
                      aria-hidden="true"
                    />
                    {nav.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
        </div>
        <div className="">
            <a
              href="#"
              className="text-pencil-dark flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 "
            >
              <img
                className="h-8 w-8 rounded-full "
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </a>
          </div>
      
    </aside>
  );
}
