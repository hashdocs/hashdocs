"use client";
import { UserContext } from "@/app/(application)/_components/userProvider";
import { classNames } from "@/app/_utils/classNames";
import { Database } from "@/types/supabase.types";
import { Popover } from "@headlessui/react";
import {
    ArrowLeftOnRectangleIcon,
    CreditCardIcon,
    EllipsisVerticalIcon,
    PlusIcon,
    QuestionMarkCircleIcon,
    UserIcon,
    WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";
import { BoltIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useContext, useState } from "react";
import toast from "react-hot-toast";
import { primaryNavigation } from "./routes.constants";

type primaryNavigationType = (typeof primaryNavigation)[0];

export default function Sidebar() {
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

  const _userContext = useContext(UserContext);

  const { user, org } = _userContext!;

  const handleLogout = async (e: any) => {
    const loginPromise = new Promise(async (resolve, reject) => {
      e.preventDefault();

      const { error } = await supabase.auth.signOut();

      if (error) {
        reject(false);
      } else {
        resolve(true);
        router.replace("/", { forceOptimisticNavigation: true });
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
      name: "Get help",
      icon: QuestionMarkCircleIcon,
      optionClick: () => {
        toast.success(
          <p>
            Please email us at{" "}
            <Link
              target="_blank"
              href={`mailto:bharat@hashlabs.dev?subject=Hashdocs%20-%20Help%20please`}
              className="text-stratos-default underline"
            >
              bharat@hashlabs.dev
            </Link>
          </p>,
          {
            icon: <QuestionMarkCircleIcon className="h-4 w-4" />,
          }
        );
      },
    },
    {
      name: "Manage billing",
      icon: CreditCardIcon,
      optionClick: () => {
        router.push(`/settings/billing`);
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
        <Link href={`/`} className="flex flex-row items-center">
          <div className="relative -ml-1 h-12 w-9 scale-75 overflow-hidden">
            <Image
              src={"/hashdocs_gradient.svg"}
              fill={true}
              alt={"Hashdocs"}
            />
          </div>
          <h1 className="ml-1 mt-1 text-2xl font-extrabold leading-9 tracking-wide text-shade-pencil-black">
            Hashdocs
          </h1>
        </Link>
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
                        : "text-shade-gray-500 hover:text-shade-pencil-dark",
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
      <div className="flex flex-col gap-y-6">
        {org?.stripe_product_plan === 'Free' && <Link href={'/settings/billing'} className="flex gap-x-2 px-2 py-2 bg-white rounded-md hover:bg-stratos-default hover:text-white border shadow-inner border-stratos-default text-stratos-default font-semibold items-center">
          <BoltIcon className="h-5 w-5" /><p>Upgrade to Pro</p>
        </Link>}
        {user && (
          <Popover className="">
            {({ open }) => (
              <>
                <Popover.Button className="flex items-center justify-center gap-x-3 py-2 focus:outline-none focus:ring-0">
                  {user?.user_metadata?.picture ? (
                    <Image
                      className="h-6 w-6 shrink-0 rounded-full "
                      src={user.user_metadata?.picture ?? ""}
                      alt=""
                      height={32}
                      width={32}
                    />
                  ) : (
                    <UserCircleIcon
                      className="h-6 w-6 text-shade-gray-500"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="w-36 truncate text-left text-sm font-semibold leading-6 text-shade-gray-500 hover:text-shade-pencil-dark"
                  >
                    {user?.email}
                  </span>
                  <EllipsisVerticalIcon className="h-5 w-5 text-shade-pencil-dark hover:text-shade-pencil-dark" />
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
        )}
      </div>
    </aside>
  );
}
