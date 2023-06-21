"use client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase.types";
import Login from "./auth/login";
import { cookies } from "next/headers";
import Loader from "@/app/_components/navigation/loader";
import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import IconButton from "./_components/shared/buttons/iconButton";

export default async function Home() {
  return (
    <section className="flex flex-1 flex-col items-center">
      <TopBar />
      <div className="flex-1 w-full flex flex-col items-center gap-y-4">
        <div className="flex flex-row gap-x-4">
          <Image src={"/hashdocs.svg"} width={50} height={50} alt={"hashdocs"} />
          <div className="text-6xl font-semibold py-6">{"Welcome to hashdocs"}</div>
        </div>
        <p>Swap is a dodo</p>
      </div>
      <Login />
    </section>
  );
}
function TopBar() {
  return (
    <div className="flex h-12 w-full flex-row items-center justify-between border-b border-shade-line bg-shade-overlay px-4">
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
      <div className="mr-4 flex flex-row items-center gap-x-4">
        <IconButton
          ButtonId={"topbar-download"}
          ButtonText={"Download document"}
          ButtonIcon={ArrowDownTrayIcon}
        />
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
