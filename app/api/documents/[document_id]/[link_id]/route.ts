import { LinkType } from "@/types/documents.types";
import { Database } from "@/types/supabase.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

/*================================ UPDATE LINK ==============================*/

export async function PUT(
  request: NextRequest,
  {
    params: { document_id, link_id },
  }: { params: { document_id: string; link_id: string } }
) {
  const props: LinkType = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login'
    return NextResponse.redirect(url);
  }

  const { error } = await supabase
    .from("tbl_links")
    .update(props)
    .eq("link_id", link_id)
    .maybeSingle();

  if (error) return NextResponse.json(null, { status: 500 });

  const { data: document_id_data, error: document_id_error } = await supabase
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_id_error || !document_id_data) {
    return NextResponse.json(null, { status: 500 });
  }
  return NextResponse.json(document_id_data[0], { status: 200 });
}

/*================================ DELETE LINK ==============================*/

export async function DELETE(
  request: NextRequest,
  {
    params: { document_id, link_id },
  }: { params: { document_id: string; link_id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login'
    return NextResponse.redirect(url);
  }

  const { error } = await supabase
    .from("tbl_links")
    .delete()
    .eq("link_id", link_id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json(null, { status: 500 });
  }

  const { data: document_id_data, error: document_id_error } = await supabase
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_id_error || !document_id_data) {
    console.error(document_id_error);
    return NextResponse.json(null, { status: 500 });
  }
  return NextResponse.json(document_id_data[0], { status: 200 });
}
