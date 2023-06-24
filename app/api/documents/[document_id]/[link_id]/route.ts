import { LinkType } from "@/types/documents.types";
import { Database } from "@/types/supabase.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/*================================ UPDATE LINK ==============================*/

export async function PUT(
  request: Request,
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
    return NextResponse.json(null, { status: 401 });
    redirect("/");
  }

  const { error } = await supabase
    .from("tbl_links")
    .update(props)
    .eq("link_id", link_id)
    .maybeSingle();

  if (error) return NextResponse.error();

  const { data: document_id_data, error: document_id_error } = await supabase
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_id_error || !document_id_data) {
    return NextResponse.error();
  }
  return NextResponse.json(document_id_data[0], { status: 200 });
}

/*================================ DELETE LINK ==============================*/

export async function DELETE(
  request: Request,
  {
    params: { document_id, link_id },
  }: { params: { document_id: string; link_id: string } }
) {
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
    .delete()
    .eq("link_id", link_id)
    .maybeSingle();

  if (error) return NextResponse.error();

  const { data: document_id_data, error: document_id_error } = await supabase
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_id_error || !document_id_data) {
    return NextResponse.error();
  }
  return NextResponse.json(document_id_data[0], { status: 200 });
}

/*================================ UPDATE LINK ==============================*/

// export async function PATCH(
//   request: Request,
//   {
//     params: { document_id, link_id },
//   }: { params: { document_id: string; link_id: string } }
// ) {
//   const supabase = createRouteHandlerClient<Database>({ cookies });

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return NextResponse.json(null, { status: 401 });
//     redirect("/");
//   }

//   const { is_active } = await request.json();

//   const { data, error } = await supabase
//     .from("tbl_links")
//     .update({ is_active })
//     .eq("link_id", link_id)
//     .select("*")
//     .maybeSingle();

//   if (error) console.error(error);
//   if (!data || error) return NextResponse.error();

//   return NextResponse.json(
//     { message: `Successfully updated ${data.link_id}` },
//     { status: 200 }
//   );
// }
