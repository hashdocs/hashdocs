import ViewerTopBar from "@/app/(viewer)/_components/viewerTopbar";

export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="flex h-full w-full">
      // <aside className="h-screen" style={{ height: "100vh" }}></aside>
      <main className="flex flex-1 flex-col h-screen w-full">
        <div className="sticky top-0 z-10 w-full">
          <ViewerTopBar />
        </div>
        <div className=" flex flex-1 w-full max-h-screen justify-center overflow-hidden">
          {children}
        </div>
      </main>
    // </div>
  );
}
