import { Database } from "@/types/supabase.types";
import { AuthorizeViewerType } from "@/types/viewer.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/*================================ AUTHORIZE VIEWER ==============================*/

export async function POST(
  request: Request,
  { params: { link_id } }: { params: { link_id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { email } = await request.json();

  const { data, error } = await supabase
    .rpc("authorize_viewer", { link_id_input: link_id, email_input: email })
    .returns<AuthorizeViewerType>();

  if (error || !data) return NextResponse.error();

  cookies().set({
    name: `hashdocs-token`,
    value: data.view_token,
    maxAge: 60 * 60,
  });

  return NextResponse.json(null, { status: 200 });
}

/*================================ CHECK SESSION ==============================*/

export async function GET(
  request: Request,
  { params: { link_id } }: { params: { link_id: string } }
) {
  const cookieJar = cookies();

  const hashdocs_token = cookieJar.get("hashdocs-token")?.value;

  const supabase = createRouteHandlerClient<Database>(
    { cookies },
    {
      options: {
        global: { headers: { Authorization: `Bearer ${hashdocs_token}` } },
      },
    }
  );

  const { data, error } = await supabase
    .from("tbl_views")
    .select("*, tbl_links(*)")
    .eq("link_id", link_id)
    .maybeSingle();

  console.log(data, error);

  if (!data) NextResponse.json(null, { status: 401 });

  return NextResponse.json(data, { status: 200 });
}
