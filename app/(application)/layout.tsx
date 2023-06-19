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
    <div className="flex max-h-screen w-full overflow-x-auto">
      <Sidebar />
      <main className="flex flex-1 flex-col items-center overflow-x-auto overflow-y-scroll scrollbar-thin scrollbar-track-shade-line scrollbar-thumb-shade-disabled">
        <div className="sticky top-0 z-10 w-full">
          <TopBar />
        </div>
        <div className=" flex h-full w-full min-w-[800px] max-w-screen-xl flex-1 flex-col p-8 ">
          {children}
        </div>
      </main>
    </div>
  );
}
