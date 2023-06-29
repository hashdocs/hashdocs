import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase.types";
import { DocumentType } from "@/types/documents.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DocumentHeader from "@/app/(application)/documents/[document_id]/(controls)/_components/documentHeader";

/*=========================================== COMPONENT ===========================================*/

export default async function LoginLayout({
  children,
  params: { document_id }, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { document_id: string };
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/documents");
  }

  return <>{children}</>;
}
