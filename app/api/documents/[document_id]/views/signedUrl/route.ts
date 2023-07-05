/*================================ UPDATE LINK ==============================*/

import { GetViewLogs, LinkType, ViewType } from "@/types/documents.types";
import { Database } from "@/types/supabase.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

  const { data: versions, error: versions_error } = await supabase
    .from("tbl_document_versions")
    .select("*")
    .eq("document_id", document_id);

  if (versions_error || !versions)
    return NextResponse.json(null, { status: 500 });

  const versions_array = Array.from(
    { length: versions.length },
    (_, i) => i + 1
  ).map((version) => {
    return { version, path: `${document_id}/${version}.pdf` };
  });

  const versions_path = versions_array.map((version) => {
    return version.path;
  });

  const { data: signed_urls, error: signed_urls_error } = await supabase.storage
    .from("documents")
    .createSignedUrls(versions_path, 3600);

  if (signed_urls_error || !signed_urls)
    return NextResponse.json(null, { status: 500 });

  const versions_array_final = versions_array.map((version) => {
    return {
      ...version,
      signed_url: signed_urls.find((url) =>
        url.signedUrl.includes(version.path)
      )?.signedUrl,
    };
  });

  return NextResponse.json(versions_array_final, { status: 200 });
}
