"use client";
import Empty from "@/app/_components/navigation/empty";
import LargeButton from "@/app/_components/shared/buttons/largeButton";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SessionContext } from "../../_components/userProvider";

/*=========================================== TYPES ===========================================*/

/*=========================================== CONSTANTS ===========================================*/

export default function AnalyticsPage() {

  const supabase = createClientComponentClient();
  const router = useRouter();

  const session = useContext(SessionContext);
  const user = session?.user

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

  return (
    <main className="flex flex-col space-y-4">
      <div className="w-full flex flex-1 flex-col p-8 items-center bg-white text-shade-pencil-light shadow-sm rounded-md gap-y-8 ">
        <div className="flex flex-row flex-1 items-center w-full">
          <div className="basis-1/2 flex flex-1 text-sm font-semibold">Email</div>
          <div className="basis-1/2 flex flex-1 bg-shade-overlay font-semibold shadow-inner rounded-md p-2 h-10 border border-shade-line">{user?.email}</div>
        </div>
        <div className="flex flex-row flex-1 items-center w-full">
          <div className="basis-3/4 flex flex-1 text-sm font-semibold"></div>
          <button className="font-semibold shadow-inner rounded-md p-2 border border-red-500 text-red-700 bg-red-50" onClick={handleLogout}>Logout of all sessions</button>
        </div>
      </div>
    </main>
  );
}
