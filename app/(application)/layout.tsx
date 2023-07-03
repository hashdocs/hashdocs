import Sidebar from "@/app/_components/navigation/sidebar";
import TopBar from "@/app/_components/navigation/topbar";
import UserProvider from "./_components/userProvider";
import PHProvider from "../_components/providers/posthog";

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PHProvider>
      <UserProvider>
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
      </UserProvider>
    </PHProvider>
  );
}
