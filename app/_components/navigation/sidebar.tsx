"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { primaryNavigation } from "./routes.constants";
import Image from "next/image";
import { classNames } from "@/app/_utils/classNames";
import { User } from "@supabase/supabase-js";
import {
  ArrowLeftOnRectangleIcon,
  BuildingOfficeIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import PopOver from "../shared/popover";
import toast from "react-hot-toast";
import { Popover } from "@headlessui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase.types";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";

type primaryNavigationType = (typeof primaryNavigation)[0];

export default function Sidebar(user: User) {
  const path = usePathname();

  const defaultNav =
    primaryNavigation.find((nav) => {
      return path.includes(nav.path);
    }) ?? primaryNavigation[0];

  const [activeNav, setActiveNav] = useState(defaultNav);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const changeSelectedNav = useCallback(
    (newNav: primaryNavigationType) => {
      setActiveNav(newNav);
    },
    [activeNav]
  );

  const handleLogout = async (e: any) => {
    const loginPromise = new Promise(async (resolve, reject) => {
      e.preventDefault();

      const { error } = await supabase.auth.signOut();

      if (error) {
        reject(false);
      } else {
        resolve(true);
        router.push("/");
      }
    });

    toast.promise(loginPromise, {
      loading: "Signing out...",
      success: "Signed out successfully!",
      error: "Sign out failed! Please try again",
    });
  };

  const options = [
    {
      name: "Invite team",
      icon: PlusIcon,
      optionClick: () => {
        toast.success("Team management is coming soon", {
          icon: <WrenchScrewdriverIcon className="h-4 w-4" />,
        });
      },
    },
    {
      name: "Edit profile",
      icon: UserIcon,
      optionClick: () => {
        router.push(`/settings/profile`);
      },
    },
    {
      name: "Logout",
      icon: ArrowLeftOnRectangleIcon,
      optionClick: handleLogout,
    },
  ];

  return (
    <aside
      className="z-50 flex w-60 flex-shrink-0 flex-col justify-between overflow-y-hidden border-r border-shade-line p-2 px-6 shadow-sm"
      style={{ height: "100vh" }}
    >
      <div className="flex flex-col gap-y-6  ">
        <div className="flex flex-row items-center">
          <div className="relative -ml-1 h-12 w-9 scale-75 overflow-hidden">
            <Image
              src={"/hashdocs_gradient.svg"}
              fill={true}
              alt={"Hashdocs"}
            />
          </div>
          <h1 className="ml-1 mt-1 text-2xl font-bold leading-6 tracking-wide">
            Hashdocs
          </h1>
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
      <Popover className="">
        {({ open }) => (
          <>
            <Popover.Button className="flex items-center justify-center gap-x-3 py-2 focus:outline-none focus:ring-0">
              {user.user_metadata?.avatar_url ? (
                <Image
                  className="h-6 w-6 shrink-0 rounded-full "
                  src={user.user_metadata?.avatar_url ?? ""}
                  alt=""
                  height={32}
                  width={32}
                />
              ) : (
                <UserCircleIcon
                  className="h-6 w-6 text-shade-pencil-light"
                  aria-hidden="true"
                />
              )}
              <span
                aria-hidden="true"
                className="w-36 text-left truncate text-sm font-semibold leading-6 text-shade-pencil-light hover:text-shade-pencil-dark"
              >
                {user.email}
              </span>
              <EllipsisVerticalIcon className="hover:text-shade-pencil-dark h-5 w-5 text-shade-pencil-dark" />
            </Popover.Button>
            <Popover.Panel
              className={classNames(
                "absolute z-10 flex  -translate-y-full translate-x-52 transform"
              )}
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid bg-white">
                  {options.map((item) => (
                    <button
                      key={item.name}
                      onClick={item.optionClick}
                      className={classNames(
                        "focus:ring-none flex items-center rounded-lg px-2 py-3 transition duration-150 ease-in-out hover:bg-gray-50"
                      )}
                    >
                      <div className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center">
                        <item.icon aria-hidden="true" />
                      </div>
                      <div className="mx-3 text-xs">
                        <p className="">{item.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </aside>
  );
}
