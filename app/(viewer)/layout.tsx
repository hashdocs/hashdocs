import ViewerTopBar from "@/app/(viewer)/_components/viewerTopbar";

export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="flex h-full w-full">
      // <aside className="h-screen" style={{ height: "100vh" }}></aside>
      <main className="flex flex-1 flex-col items-center overflow-auto">
        <div className="sticky top-0 z-10 w-full">
          <ViewerTopBar />
        </div>
        <div className=" flex flex-1 flex-col p-8">
          {children}
        </div>
      </main>
    // </div>
  );
}
