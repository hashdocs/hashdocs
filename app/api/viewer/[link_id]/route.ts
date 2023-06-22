import { Database } from "@/types/supabase.types";
import { AuthorizeViewerType } from "@/types/viewer.types";
import {
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
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