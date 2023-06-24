import ViewerTopBar from "@/app/(viewer)/d/[link_id]/_components/viewerTopbar";
import { getLinkProps } from "../../_components/functions";

export default async function ViewerLayout({
  children,
  params: { link_id },
}: {
  children: React.ReactNode;
  params: { link_id: string };
}) {
  const link_props = await getLinkProps(link_id);

  return (
    <main className="flex h-screen w-full flex-1 flex-col">
      <div className="sticky top-0 z-10 w-full">
        <ViewerTopBar linkProps={link_props} />
      </div>
      <div className=" flex max-h-screen w-full flex-1 justify-center overflow-hidden">
        {children}
      </div>
    </main>
  );
}
