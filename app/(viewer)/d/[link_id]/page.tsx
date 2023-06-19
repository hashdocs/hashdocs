import { Database } from "@/app/(application)/_types/supabase.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ViewerAuth from "./components/viewer_auth";
import InvalidLink from "./components/invalid_link";

export async function getLinkProps(link_id: string) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data, error } = await supabase
    .rpc("get_link_props", { link_id_input: link_id })
    .returns<GetLinkProps | null>();

  console.log(data, error);

  if (error || !data) return null;

  return data;
}

export default async function DocumentViewerPage({
  params: { link_id },
}: {
  params: { link_id: string };
}) {
  const link_props = await getLinkProps(link_id);

  return link_props ? <ViewerAuth /> : <InvalidLink />;
}
