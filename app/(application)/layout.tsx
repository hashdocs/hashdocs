import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Sidebar from "@/app/_components/navigation/sidebar";
import TopBar from "@/app/_components/navigation/topbar";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase.types";
import { redirect, useSearchParams } from "next/navigation";
import SessionProvider from "./_components/userProvider";

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SessionProvider>
      <div className="flex max-h-screen w-full flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex h-screen w-full flex-1 flex-col items-center overflow-x-auto">
          <div className="sticky top-0 z-10 w-full">
            <TopBar />
          </div>
          <div className=" hashdocs-scrollbar flex h-full w-full flex-1 justify-center overflow-y-visible ">
            <div className="flex min-w-[800px] max-w-screen-xl flex-1 flex-col px-8 py-4 ">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
