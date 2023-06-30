import { Database } from "@/types/supabase.types";
import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DocumentType } from "@/types/documents.types";
import ViewerTopBar from "../../d/[link_id]/_components/viewerTopbar";
import PDFViewerPage from "../../_components/pdf_viewer_page";
import PreviewTopBar from "./previewTopBar";
import InvalidLink from "../../d/[link_id]/_components/invalid_link";
import { redirect } from "next/navigation";

export const revalidate = 0;

async function getSignedURL(document_id: string) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {data: {session}, error:sessionError} = await supabase.auth.getSession(); 

  if (!session || sessionError) {
    redirect("/login");
  };

  const { data: document_data, error: document_error } = await supabase
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_error || !document_data || !document_data[0]) {
    return null;
  }

  const document_props = document_data[0];

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(
      `${document_id}/${document_props.document_version}.pdf`,
      10
    );

  if (error || !data) return null;

  const { signedUrl } = data;

  return { signedUrl, document_props };
}

export default async function InternalViewerPage({
  params: { document_id },
}: {
  params: { document_id: string };
}) {
  const props = await getSignedURL(document_id);

  return props ? (
    <main className="flex h-screen w-full flex-1 flex-col">
      <div className="sticky top-0 z-10 w-full">
        <PreviewTopBar documentProps={props.document_props} />
      </div>
      <div className=" flex max-h-screen w-full flex-1 justify-center overflow-hidden">
        <PDFViewerPage signedURL={props.signedUrl} />;
      </div>
    </main>
  ) : (
    <InvalidLink />
  );
}
