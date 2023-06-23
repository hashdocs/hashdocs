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
    // return NextResponse.json(null, { status: 401 });
    redirect("/");
  }

  const { data: document_id_data, error: document_id_error } = await supabase
    .rpc("get_document_id")
    .returns<DocumentType[]>();

  if (document_id_error) {
    console.error(document_id_error);
    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json(document_id_data, { status: 200 });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // return NextResponse.json(null, { status: 401 });
    redirect("/");
  }

  const filedata = await request.formData();

  const name = filedata.get("name") as string;
  const type = filedata.get("type") as string;
  const filebody = filedata.get("file") as File;

  const lastDot = name.lastIndexOf(".");
  const name_without_extension =
    lastDot === -1 ? name : name.substring(0, lastDot);

  const { data: new_document_data, error: new_document_error } = await supabase
    .from("tbl_documents")
    .insert({
      document_name: name_without_extension,
      source_path: name,
      source_type: "LOCAL",
      created_by: user.id,
    })
    .select(`document_id`)
    .single();

  if (new_document_error || !new_document_data) {
    console.error(new_document_error);
    return NextResponse.json(null, { status: 500 });
  }

  const { data: _document_upload_path, error: document_upload_error } =
    await supabase.storage
      .from("documents")
      .upload(`${new_document_data.document_id}/1.pdf`, filebody, {
        contentType: type,
        upsert: true,
      });

  if (document_upload_error) {
    console.error(document_upload_error);
    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json(
    { document_id: new_document_data.document_id },
    { status: 200 }
  );
}
