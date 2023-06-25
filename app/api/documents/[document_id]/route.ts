import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Database } from "@/types/supabase.types";
import { LinkType, DocumentType } from "@/types/documents.types";
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

  const { searchParams } = new URL(request.url);
  let link_id = searchParams.get("link_id");

  const { error } = link_id
    ? await supabase
        .from("tbl_links")
        .update(props)
        .eq("document_id", document_id)
        .eq("link_id", link_id)
        .maybeSingle()
    : await supabase
        .from("tbl_links")
        .insert(props)
        .eq("document_id", document_id)
        .maybeSingle();

  console.error("Error in inserting or updating link", error);

  if (error) {
    console.error("Error in inserting or updating link", error);
    return NextResponse.json(null, { status: 500 });
  }

  const { data: document_id_data, error: document_id_error } = await supabase
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_id_error || !document_id_data) {
    console.error("Error in fetching document", document_id_error);
    return NextResponse.json(null, { status: 500 });
  }
  return NextResponse.json(document_id_data[0], { status: 200 });
}

/*================================ UPDATE DOCUMENT ==============================*/

export async function PUT(
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

  const props = await request.json();

  const { data, error } = await supabase
    .from("tbl_documents")
    .update(props)
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

/*================================ CREATE DOWNLOAD LINK ==============================*/

export async function GET(
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

  const { data: document_data, error: document_error } = await supabase
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_error || !document_data || !document_data[0]) {
    redirect("/documents");
  }

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(
      `${document_data[0].document_id}/${document_data[0].document_version}.pdf`,
      60,
      {
        download: document_data[0].document_name,
      }
    );

  if (!data || error) {
    console.error(error);
    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json(
    { document_data, signedUrl: data.signedUrl },
    { status: 200 }
  );
}
