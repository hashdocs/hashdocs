import { GetLinkProps } from "@/types/documents.types";
import { Database } from "@/types/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const getLinkProps = async (link_id: string) => {
  const supabase = createClientComponentClient<Database>();

  const { data, error } = await supabase
    .rpc("get_link_props", { link_id_input: link_id })
    .returns<GetLinkProps | null>();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return data;
};
