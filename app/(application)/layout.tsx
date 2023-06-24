import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Sidebar from "@/app/_components/navigation/sidebar";
import TopBar from "@/app/_components/navigation/topbar";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase.types";
import { redirect } from "next/navigation";
import Loader from "@/app/_components/navigation/loader";

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  return (
    <div className="flex max-h-screen w-full flex-1 overflow-hidden">
      <Sidebar />
      <main className="h-screen w-full flex flex-1 flex-col items-center overflow-x-auto">
        <div className="sticky top-0 z-10 w-full">
          <TopBar />
        </div>
        <div className=" flex flex-1 hashdocs-scrollbar justify-center h-full w-full overflow-y-visible ">
          <div className="min-w-[800px] flex max-w-screen-xl flex-1 flex-col py-4 px-8 ">{children}</div>
        </div>
      </main>
    </div>
  );
}
