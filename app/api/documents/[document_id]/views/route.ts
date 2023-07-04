/*================================ UPDATE LINK ==============================*/

import { GetViewLogs, LinkType, ViewType } from "@/types/documents.types";
import { Database } from "@/types/supabase.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, 
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

  const { data: view_data, error: view_error } = await supabase
    .rpc("get_views", { document_id_input: document_id })
    .returns<GetViewLogs>();

  if (view_error) return NextResponse.json(null, { status: 500 });

  return NextResponse.json(view_data, { status: 200 });
}
