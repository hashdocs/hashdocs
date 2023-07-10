import Sidebar from "@/app/_components/navigation/sidebar";
import TopBar from "@/app/_components/navigation/topbar";
import UserProvider from "./_components/userProvider";
import PHProvider from "./_components/posthog";
import Link from "next/link";
import Image from "next/image";
import { BackwardIcon } from "@heroicons/react/24/outline";
import { User, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OrgType } from "@/types/settings.types";

async function getUser() {
  const supabase = createServerComponentClient({cookies});
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: org } = await supabase
  .rpc("get_org")
  .returns<OrgType[]>()
  .maybeSingle();

  if (!user) {
    await supabase.auth.signOut();
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`)
  }

  return {user, org};
}

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const {user, org} = await getUser();

  return (
    <PHProvider>
      <UserProvider user={user} org={org} >
        <div className="hidden max-h-screen w-full flex-1 overflow-hidden lg:flex" id="app">
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
        {MobileNotCompatible()}
      </UserProvider>
    </PHProvider>
  );
}

function MobileNotCompatible() {
  return (
    <div className="flex max-h-screen w-full flex-1 flex-col items-center justify-center gap-y-4 overflow-hidden lg:hidden">
      <Link href={`/`} className="flex flex-row items-center">
        <div className="relative -ml-1 h-12 w-9 scale-75 overflow-hidden">
          <Image src={"/hashdocs_gradient.svg"} fill={true} alt={"Hashdocs"} />
        </div>
        <h1 className="ml-1 mt-1 text-2xl font-extrabold leading-9 tracking-wide text-shade-pencil-black">
          Hashdocs
        </h1>
      </Link>
      <p className="px-8 text-center font-semibold text-shade-pencil-light">
        We are not optimized for mobile screens yet. <br />
        Coming soon shortly
      </p>
      <Link
        className="flex items-center justify-center space-x-2 rounded-lg border px-5 py-2 font-semibold shadow-inner transition-all hover:border-shade-pencil-dark"
        href="/"
      >
        <BackwardIcon className="h-5 w-5 text-shade-pencil-light" />
        <p className="text-sm text-shade-pencil-light">Go back</p>
      </Link>
    </div>
  );
}
