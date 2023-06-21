import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Database } from "@/types/supabase.types";
import type { DocumentType } from "@/types/documents.types";
import { LinkType } from "@/types/documents.types";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
    redirect("/");
  }

  const { data: document_id_data, error: document_id_error } = await supabase
    .rpc("get_document_id")
    .returns<DocumentType[]>();

  if (document_id_error) {
    return NextResponse.error();
  }

  return NextResponse.json(document_id_data, { status: 200 });
}