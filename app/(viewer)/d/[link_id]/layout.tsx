import ViewerTopBar from "@/app/(viewer)/d/[link_id]/_components/viewerTopbar";
import { GetLinkProps } from "@/types/documents.types";
import { Database } from "@/types/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cache } from "react";

export const revalidate = 60;

export const getLinkProps = cache(async (link_id: string) => {
  const supabase = createClientComponentClient<Database>();

  const { data, error } = await supabase
    .rpc("get_link_props", { link_id_input: link_id })
    .returns<GetLinkProps | null>();

  if (error || !data) return null;

  return data;
});

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
