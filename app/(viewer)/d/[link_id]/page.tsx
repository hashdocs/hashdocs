import { Database } from "@/types/supabase.types";
import { createClientComponentClient, createRouteHandlerClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ViewerAuth from "./_components/viewer_auth";
import InvalidLink from "./_components/invalid_link";
import { GetLinkProps } from "@/types/documents.types";
import { createClient } from "@supabase/supabase-js";

export async function getLinkProps(link_id: string) {

  const supabase = createClientComponentClient<Database>();

  const { data, error } = await supabase
    .rpc("get_link_props", { link_id_input: link_id })
    .returns<GetLinkProps | null>();

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
