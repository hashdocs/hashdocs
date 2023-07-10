import { Database } from "@/types/supabase.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/*================================ ADD FEEDBACK ==============================*/
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
    error: user_error,
  } = await supabase.auth.getUser();

  if (user_error || !user) {
    console.error(user_error);
    return NextResponse.json(user_error, { status: 500 });
  }

  const data = (await request.json()) as {
    feedback: string;
    pathname: string;
  };

  const { error: feedback_insert_error } = await supabase
    .from("tbl_feedback")
    .insert({
      feedback_text: data.feedback,
      user_id: user.id,
      user_email: user.email,
      pathname: data.pathname,
    });

  if (feedback_insert_error) {
    console.error(feedback_insert_error);
    return NextResponse.json(feedback_insert_error, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
