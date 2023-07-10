import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { errorHandler } from "../_shared/errorHandler.ts";
import { DocumentType, supabaseAdmin } from "../_shared/supabaseClient.ts";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";
import { randomInt } from "https://deno.land/x/collections@0.12.1/mod.ts";

serve(async (req) => {
  const { document_id } = await req.json();

  const { data: document_data, error: document_error } = await supabaseAdmin
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_error || !document_data || !document_data[0]) {
    return errorHandler(document_error);
  }

  const document_version = document_data[0].versions.find(
    (v) => v.is_enabled
  )?.document_version;

  console.info(
    `${document_id}: Creating URL for ${document_id}/${document_version}.pdf`
  );

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(`${document_id}/${document_version}.pdf`, 60);

  if (error || !data || !data.signedUrl) {
    return errorHandler(error);
  }

  console.info(`${document_id}: Created a signed url - ${data.signedUrl}`);

  const arrayBuffer = await fetch(data.signedUrl).then((res) =>
    res.arrayBuffer()
  );
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const numPages = pdfDoc.getPages().length;

  try {
    const res = await fetch(
      `https://v2.convertapi.com/convert/pdf/to/jpg?Secret=${Deno.env.get(
        "CONVERTAPI_SECRET"
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Parameters: [
            {
              Name: "File",
              FileValue: {
                Url: data.signedUrl,
              },
            },
            {
              Name: "PageRange",
              Value: "1",
            },
            {
              Name: "PreserveResolution",
              Value: true,
            },
          ],
        }),
      }
    );

    const return_body = await res.json();

    if (!return_body.Files || !return_body.Files[0])
      throw Error("No file returned");

    const thumbnail_file = return_body.Files[0];
    const thumbnail_arrayBuffer = base64ToArrayBuffer(thumbnail_file.FileData);

    const { data: upload_data, error: upload_error } =
      await supabaseAdmin.storage
        .from("thumbnails")
        .upload(
          `${document_id}/${randomInt({ start: 100000, end: 999999 })}.jpg`,
          thumbnail_arrayBuffer,
          {
            contentType: "image/jpeg",
            upsert: true,
          }
        );

    if (upload_error || !upload_data) {
      throw Error(JSON.stringify(upload_error));
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("thumbnails").getPublicUrl(upload_data.path);

    const { error: update_error } = await supabaseAdmin
      .from("tbl_documents")
      .update({ image: publicUrl })
      .eq("document_id", document_id);

    if (update_error) {
      throw Error(JSON.stringify(update_error));
    }
  } catch (e) {
    console.error(`${document_id}: Could not update image - ${e}`);
  }

  const { error: page_update_error } = await supabaseAdmin
    .from("tbl_document_versions")
    .update({ page_count: numPages })
    .eq("document_id", document_id)
    .eq("document_version", document_version);

  console.log(
    `${document_id}: Updated document version to ${document_version} with ${numPages} pages`
  );

  if (page_update_error) {
    return errorHandler(page_update_error);
  }

  const { data: new_document } = await supabaseAdmin
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  return new Response(JSON.stringify(new_document), {
    headers: { "Content-Type": "application/json" },
  });
});

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
