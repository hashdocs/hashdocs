import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Database } from "@/types/supabase.types";
import { LinkType } from "@/types/documents.types";
import { redirect } from "next/navigation";

/*================================ CREATE NEW LINK ==============================*/

export async function POST(
  request: Request,
  { params: { document_id } }: { params: { document_id: string } }
) {
  const props: LinkType = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
    redirect("/");
  }

  const { error } = await supabase
    .from("tbl_links")
    .insert(props)
    .eq("document_id", document_id)
    .maybeSingle();

  if (error) return NextResponse.error();

  const { data: document_id_data, error: document_id_error } = await supabase
    .rpc("get_document_id", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_id_error || !document_id_data) {
    return NextResponse.error();
  }
  return NextResponse.json(document_id_data[0], { status: 200 });
}

/*================================ TOGGLE DOCUMENT ==============================*/

export async function PATCH(
  request: Request,
  { params: { document_id } }: { params: { document_id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
    redirect("/");
  }

  const { is_enabled } = await request.json();

  const { data, error } = await supabase
    .from("tbl_documents")
    .update({ is_enabled })
    .eq("document_id", document_id)
    .select("*")
    .maybeSingle();

  if (error) console.error(error);
  if (!data || error) return NextResponse.error();

  return NextResponse.json(
    { message: `Successfully updated ${data.document_id}` },
    { status: 200 }
  );
}

/*================================ DELETE DOCUMENT ==============================*/

export async function DELETE(
  request: Request,
  { params: { document_id } }: { params: { document_id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
    redirect("/");
  }

  const { data, error } = await supabase
    .from("tbl_documents")
    .delete()
    .eq("document_id", document_id)
    .select("*")
    .maybeSingle();

  if (error) console.error(error);
  if (!data || error) return NextResponse.error();

  return NextResponse.json(
    { message: `Successfully deleted ${data.document_id}` },
    { status: 200 }
  );
}
