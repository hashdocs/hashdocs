"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import clsx from "clsx";

const navItems = ["pricing", "roadmap", "login"];

export default function Navbar() {
  return (
    <div
      className={clsx(
        `sticky inset-x-0 top-0 z-30 w-full bg-shade-overlay bg-opacity-90 transition-all`
      )}
    >
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 ">
        <Link href={`/`} className="flex flex-row items-center">
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
        </Link>

        <div className="hidden items-center space-x-6 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`/${item}`}
              className={`rounded-md text-sm font-medium capitalize ${"text-shade-pencil-light"} transition-colors ease-out hover:text-shade-pencil-black`}
            >
              {item}
            </Link>
          ))}
          <Link
            href={`/login?new_user=true`}
            className="rounded-md bg-stratos-default px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-stratos-default/80"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
