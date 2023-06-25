import { Database } from "@/types/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ViewerAuth from "./_components/viewerAuth";
import InvalidLink from "./_components/invalid_link";
import { decode } from "jsonwebtoken";
import PDFViewerPage from "../../_components/pdf_viewer_page";
import { getLinkProps } from "../../_components/functions";

export const revalidate = 0;

async function getSignedURL(link_id: string) {
  const cookieJar = cookies();

  const hashdocs_token = cookieJar.get(link_id)?.value;

  if (!hashdocs_token) return null;

  const supabase = createClientComponentClient<Database>({
    options: {
      global: { headers: { Authorization: `Bearer ${hashdocs_token}` } },
    },
  });

  const { document_id, document_version } = decode(hashdocs_token) as {
    document_id: string;
    document_version: number;
  };

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(`${document_id}/${document_version}.pdf`, 10);

  if (error || !data) return null;

  const { signedUrl } = data;

  return signedUrl;
}

export default async function DocumentViewerPage({
  params: { link_id },
}: {
  params: { link_id: string };
}) {
  const link_props = await getLinkProps(link_id);

  if (!link_props) return <InvalidLink />;

  const signedUrl = await getSignedURL(link_id);

  return !signedUrl ? <ViewerAuth /> : <PDFViewerPage signedURL={signedUrl} />;
}
