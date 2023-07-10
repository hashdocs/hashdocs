import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Database } from "@/types/supabase.types";
import type { DocumentType } from "@/types/documents.types";

/* ------------------------ GET DOCUMENT ----------------------- */

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // const url = request.nextUrl.clone();
    // url.pathname = '/login'
    // return NextResponse.redirect(url);
    return NextResponse.json(null, { status: 500 });
  }

  const { data: document_id_data, error: document_id_error } = await supabase
    .rpc("get_documents")
    .returns<DocumentType[]>();

  if (document_id_error) {
    console.error(document_id_error);
    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json(document_id_data, { status: 200 });
}

/* ------------------------ UPLOAD OR UPDATE DOCUMENT ----------------------- */

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // const url = request.nextUrl.clone();
    // url.pathname = '/login'
    // return NextResponse.redirect(url);
    return NextResponse.json(null, { status: 500 });
  }

  //STEP 1 - Parse body
  const body = (await request.json()) as {
    document_id: string | null;
    path: string;
    source_path: string;
    document_name: string | null;
    source_type: string | null;
  };

  let { document_id, path, source_path, document_name, source_type } = body;

  const lastDot = source_path.lastIndexOf(".");
  const name_without_extension =
    lastDot === -1 ? source_path : source_path.substring(0, lastDot);

  //STEP 3 - Insert document into db
  const { data: new_document_data, error: new_document_error } = await supabase
    .rpc("upsert_document", {
      document_id_input: document_id ?? undefined,
      document_name_input: document_name ?? name_without_extension,
      source_path_input: source_path,
      source_type_input: source_type ?? "LOCAL",
    })
    .returns<DocumentType[]>();

  if (new_document_error || !new_document_data || !new_document_data[0]) {
    console.error(new_document_error);
    return NextResponse.json(null, { status: 500 });
  }

  document_id = new_document_data[0].document_id;
  const document_version = new_document_data[0].versions.find(
    (version) => version.is_enabled == true
  )?.document_version;

  //STEP 4 - Store document in supabase storage
  const { data: _document_upload_path, error: document_upload_error } =
    await supabase.storage
      .from("documents")
      .move(path, `${document_id}/${document_version}.pdf`);

  if (document_upload_error) {
    console.error(document_upload_error);
    return NextResponse.json(null, { status: 500 });
  }

  supabase.functions
    .invoke("upload-document", {
      body: JSON.stringify({ document_id }),
    })
    .then((res) => {
      console.log(`Updated ${document_id} successfully`);
    })
    .catch((err) => {
      console.error(err);
      console.error(`Failed to update ${document_id}`);
    });

  return NextResponse.json(new_document_data[0], { status: 200 });
}
