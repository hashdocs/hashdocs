import DocumentHeader from "@/app/(application)/documents/[document_id]/(controls)/_components/documentHeader";
import { DocumentType } from "@/types/documents.types";
import { Database } from "@/types/supabase.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getDocuments(document_id: string) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data, error } = await supabase
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (error || !data || data.length < 1) {
    console.error(error);
    throw error;
  }

  const versions_path = data[0].versions.map((version) => {
    return `${data[0].document_id}/${version.document_version}.pdf`;
  });

  const { data: signed_urls, error: signed_urls_error } = await supabase.storage
    .from("documents")
    .createSignedUrls(versions_path, 3600);

  if (signed_urls_error || !signed_urls) throw error;

  const signed_urls_final = data[0].versions.map((version) => {
    return {
      version: version.document_version,
      path: `${data[0].document_id}/${version.document_version}.pdf`,
      signed_url:
        signed_urls.find((url) =>
          url.signedUrl?.includes(
            `${data[0].document_id}/${version.document_version}.pdf`
          )
        )?.signedUrl ?? "",
    };
  });

  return { document: data[0], urls: signed_urls_final };
}

/*=========================================== COMPONENT ===========================================*/

export default async function DocumentIdLayout({
  children,
  params: { document_id }, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { document_id: string };
}) {
  const { document, urls } = await getDocuments(document_id);

  return (
    <DocumentHeader document={document} signed_urls={urls}>
      {children}
    </DocumentHeader>
  );
}
