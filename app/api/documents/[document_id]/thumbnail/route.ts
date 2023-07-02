import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Database } from "@/types/supabase.types";
import { LinkType, DocumentType } from "@/types/documents.types";
import { redirect } from "next/navigation";
import { randomInt } from "crypto";

/*================================ UPDATE THUMBNAIL ==============================*/

export async function POST(
  request: NextRequest,
  { params: { document_id } }: { params: { document_id: string } }
) {
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

  //STEP 1 - Get document_id from search params
  const { searchParams } = new URL(request.url);
  let image = searchParams.get("image");

  if (image === "false") {
    const { error } = await supabase
      .from("tbl_documents")
      .update({ image: null })
      .eq("document_id", document_id);
    if (error) {
      console.error(error);
      return NextResponse.json(null, { status: 500 });
    } else {
      return NextResponse.json(null, { status: 200 });
    }
  }

  //STEP 2 - Parse file body from formdata
  const filedata = await request.formData();
  const name = filedata.get("name") as string;
  const type = filedata.get("type") as string;
  const filebody = filedata.get("file") as File;

  const lastDot = name.lastIndexOf(".");
  const name_without_extension =
    lastDot === -1 ? name : name.substring(0, lastDot);

  const extension = name.replace(name_without_extension, "");

  //STEP 3 - Insert document into db
  const { data: new_thumbnail_data, error: new_thumbnail_error } =
    await supabase.storage
      .from("thumbnails")
      .upload(
        `${document_id}/${randomInt(100000, 999999)}${extension}`,
        filebody,
        {
          contentType: type,
          upsert: true,
        }
      );

  if (new_thumbnail_error || !new_thumbnail_data) {
    console.error(new_thumbnail_error);
    return NextResponse.json(null, { status: 500 });
  }

  //STEP 4 - Store document in supabase storage
  const { error: thumbnail_update_error } = await supabase
    .from("tbl_documents")
    .update({
      image: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbnails/${new_thumbnail_data.path}`,
    })
    .eq("document_id", document_id);

  if (thumbnail_update_error) {
    console.error(thumbnail_update_error);
    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json({ document_id: document_id }, { status: 200 });
}
