"use client";
import { GetLinkProps } from "@/types/documents.types";
import { createContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase.types";

export const ViewerContext = createContext<GetLinkProps | null>(null);

async function getLinkProps(link_id: string): Promise<GetLinkProps | null> {
  const supabase = createClientComponentClient<Database>();

  const { data, error } = await supabase
    .rpc("get_link_props", { link_id_input: link_id })
    .returns<GetLinkProps | null>();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return data;
}

export default function ViewerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [linkProps, setLinkProps] = useState<GetLinkProps | null>(null);

  const { link_id } = useParams();

  useEffect(() => {
    getLinkProps(link_id)
      .then((linkProps) => {
        setLinkProps(linkProps);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <ViewerContext.Provider value={linkProps}>
      {children}
    </ViewerContext.Provider>
  );
}
