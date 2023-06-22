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