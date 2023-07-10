

import { Database } from "@/types/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/*================================ DOWNLOAD DOCUMENT ==============================*/


export async function POST(
    request: NextRequest,
    { params: { link_id } }: { params: { link_id: string } }
  ) {
  
    const cookieJar = cookies();
  
    const hashdocs_token = cookieJar.get(link_id)?.value;
  
    if (!hashdocs_token) return NextResponse.json(null, { status: 500 });
  
    const supabase = createClientComponentClient<Database>({
      options: {
        global: { headers: { Authorization: `Bearer ${hashdocs_token}` } },
      },
    });
  
    const {document_id, document_version, source_path} = await request.json();

  
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(
        `${document_id}/${document_version}.pdf`,
        60,
        {
          download: source_path,
        }
      );
  
    if (!data || error) {
      console.error(error);
      return NextResponse.json(null, { status: 500 });
    }
  
    return NextResponse.json(
      { signedUrl: data.signedUrl },
      { status: 200 }
    );
  }