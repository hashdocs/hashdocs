import TopBar from "@/app/_components/navigation/topbar";

export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full">
      <aside className="h-screen" style={{ height: "100vh" }}></aside>
      <main className="flex flex-1 flex-col items-center overflow-auto">
        <div className="sticky top-0 z-10 w-full">{/* <TopBar /> */}</div>
        <div className=" flex h-full w-full max-w-screen-xl flex-1 flex-col p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
