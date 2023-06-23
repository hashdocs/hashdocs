import { Database } from "@/types/supabase.types";
import { AuthorizeViewerType } from "@/types/viewer.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/*================================ AUTHORIZE VIEWER ==============================*/

export async function POST(
  request: Request,
  { params: { link_id } }: { params: { link_id: string } }
) {
  const supabase = createClientComponentClient<Database>();

  const { email } = await request.json();

  const { data, error } = await supabase.functions.invoke<AuthorizeViewerType>(
    "authorize-viewer",
    {
      body: { link_id_input: link_id, email_input: email },
    }
  );

  if (error || !data) return NextResponse.json(null, { status: 401 });

  cookies().set({
    name: `hashdocs-token`,
    value: data.view_token,
    maxAge: 60 * 60,
  });

  return NextResponse.json(null, { status: 200 });
}

/*================================ UPDATE VIEW LOGS ==============================*/

export async function PUT(
  request: Request,
  { params: { link_id } }: { params: { link_id: string } }
) {
  const cookieJar = cookies();

  const hashdocs_token = cookieJar.get("hashdocs-token")?.value;

  if (!hashdocs_token) return null;

  const rawBody = (await request.json()) as {
    pageNumber: number;
    entryTime: number;
    exitTime: number;
  }[];

  const body: Database["public"]["Tables"]["tbl_view_logs"]["Update"][] =
    rawBody.map((item) => {
      return {
        page_num: item.pageNumber,
        start_time: item.entryTime,
        end_time: item.exitTime,
      };
    });

  const supabase = createClientComponentClient<Database>({
    options: {
      global: { headers: { Authorization: `Bearer ${hashdocs_token}` } },
    },
  });

  const { error } = await supabase
    .from("tbl_view_logs")
    .upsert(body, { onConflict: "view_id, page_num, start_time" });

  if (error) return NextResponse.json(null, { status: 500 });

  return NextResponse.json(null, { status: 200 });
}
